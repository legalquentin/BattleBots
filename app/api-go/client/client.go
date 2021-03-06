package client

import (
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"../game"
	"../socket"
	"github.com/gorilla/websocket"
)

// TODO: remove the flags, in the end the addresses are defined from the game instance
// var addr = flag.String("camera", "192.168.1.66:8084", "cam ws address")

// TODO: Need to secure who can open a socket to the robot feed

// WsHandlerCtrl handle client input, game event and data
func WsHandlerCtrl(res http.ResponseWriter, req *http.Request) {

	player, conn := socket.WsAuth(res, req)
	if player == nil {
		return
	}
	fmt.Println(prefixLog, player.ID, player.BotSpecs.Name, "logged in")

	player.Mutex.Lock()
	player.BotSpecs.SocketClientCtrl = conn
	player.BotContext.Moving = false
	player.Mutex.Unlock()

	u := url.URL{Scheme: "ws", Host: player.BotSpecs.Address + ":8888", Path: "/wsctrl"}

	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Println(prefixErr, err)
		http.NotFound(res, req)
		return
	}
	player.BotSpecs.SocketBotCtrl = c
	// conn.WriteJSON(&QrMsgStruct{Id: -1, Message: player.BotSpecs.Name})

	var flag = true

	go func(flag bool) {
		defer conn.Close()
		for {
			// read a message from the client [c]
			// TODO: check if message is valid
			var r = Key{}
			if err := conn.ReadJSON(&r); err != nil {
				log.Println(prefixErr, err)
				break
			}

			// ignore the command if the game hasn't started
			if game.GetGameInstance(player.GameID).Started {
				log.Println(prefixLog, "command sent;", r.Content, r.Press)
				// player.Mutex.Lock()
				if r.Content != Keymap.KEY_SPACEBAR {
					log.Println(prefixLog, "arrow")
					player.BotContext.Moving = r.Press
				} else if r.Press {
					log.Println(prefixLog, "space")
					fireLaser(conn, player)
				}
				// write a message to the bot [conn]
				if player.BotContext.Energy <= 0 || player.BotContext.Heat >= 100 {
					r = Key{0, false}
				}
				// player.Mutex.Unlock()
				if err := c.WriteJSON(r); err != nil {
					log.Println(prefixWarn, err)
				}
				if flag {
					go doEvery(100*time.Millisecond, calcAttributes, player, conn, c)
					flag = false
				}
			} else {
				log.Println(prefixLog, "game not started, can't process: ", r.Content, r.Press)
			}
		}
	}(flag)

	for {
		// read a message from the bot [c]
		// TODO: check if message is valid
		_, _, err := c.ReadMessage()
		if err != nil {
			log.Println(prefixWarn, err)
			return
		}
		// // write a message to the bot [conn]
		// log.Println(prefixLog, "Message from bot", websocket.TextMessage)
		// if err := conn.WriteMessage(websocket.TextMessage, p); err != nil {
		// 	log.Println(prefixWarn, err)
		// 	return
		// }
	}
}

func doEvery(d time.Duration, f func(*game.Player, *websocket.Conn, *websocket.Conn),
	player *game.Player, conn *websocket.Conn, bot *websocket.Conn) {
	log.Println(prefixLog, "do every")
	for range time.Tick(d) {
		f(player, conn, bot)
	}
}

func calcAttributes(player *game.Player, conn *websocket.Conn, bot *websocket.Conn) {
	player.Mutex.Lock()
	if player.BotContext.Moving {
		log.Println(prefixLog, "moving, changing energy: ", player.BotContext.Energy)
		if player.BotContext.Energy > 0 {
			player.BotContext.Energy = player.BotContext.Energy - 1
			conn.WriteJSON(&game.Data{Type: game.TypeEnergy, Value: player.BotContext.Energy})
		} else {
			player.BotContext.Moving = false
		}
		if player.BotContext.Heat < 100 {
			player.BotContext.Heat = player.BotContext.Heat + 2
			conn.WriteJSON(&game.Data{Type: game.TypeOverheat, Value: player.BotContext.Heat})
		} else {
			player.BotContext.Moving = false
		}
	} else {
		// if player.BotContext.Energy < 100 {
		// 	player.BotContext.Energy = player.BotContext.Energy + 1
		// 	conn.WriteJSON(&game.Data{Type: game.TypeEnergy, Value: player.BotContext.Energy})
		// }
		if player.BotContext.Heat > 0 {
			player.BotContext.Heat = player.BotContext.Heat - 2
			conn.WriteJSON(&game.Data{Type: game.TypeOverheat, Value: player.BotContext.Heat})
		}
	}
	player.Mutex.Unlock()
}

func getZbar(address string) string {
	resp, err := http.Get(address)
	if err != nil {
		log.Println(prefixErr, err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Println(prefixErr, err)
	}
	return string(body)
}

func fireLaser(conn *websocket.Conn, player *game.Player) {
	// the spacebar is pressed so we fire
	// TODO: implement a cooldown between the shots
	diff := time.Now().Sub(player.BotContext.FiredAt).Seconds()
	if int(diff) < int(player.BotSpecs.BaseFireRate) {
		conn.WriteJSON(&game.TextData{Type: game.TypeCooldown, Value: strconv.FormatFloat(diff, 'E', -1, 64)})
		return
	}
	player.BotContext.FiredAt = time.Now()

	conn.WriteJSON(&game.TextData{Type: game.TypeAlert, Value: "Robot Firing !"})
	// req python api to make zbar inference
	response := getZbar("http://" + player.BotSpecs.Address + ":8082")
	resp := strings.Split(response, " ")[0]
	log.Println(prefixLog, resp)
	if qrMsg, ok := QrCodesLinks[resp]; ok {
		// change other player bot attributes
		conn.WriteJSON(&game.TextData{Type: game.TypeSuccess, Value: qrMsg.Message + " !"})
		gameinstance := game.GetGameInstance(player.GameID)
		for _, p := range gameinstance.Players {
			log.Println(prefixLog, "DEBUG", resp, p.BotSpecs.ID)
			p.Mutex.Lock()
			if p.BotSpecs.ID == qrMsg.Id {
				log.Println(prefixLog, "write message to target")
				player.Mutex.Lock()
				p.BotContext.Health = p.BotContext.Health - player.BotSpecs.BaseDamage
				dmgAsStr := strconv.Itoa(int(player.BotSpecs.BaseDamage))
				dmgMsg := "You've been hit by " + player.BotSpecs.Name + " for " + dmgAsStr + "health points !"
				player.Mutex.Unlock()
				// log.Println(prefixLog, p.BotSpecs.SocketClientCtrl.RemoteAddr().String())
				if err := p.BotSpecs.SocketClientCtrl.WriteJSON(&game.TextData{Type: game.TypeAlert, Value: dmgMsg}); err != nil {
					log.Println(prefixWarn, err)
				}
				sendAllAttributes(p.BotSpecs.SocketClientCtrl, p)
				msg := "You've hit " + p.BotSpecs.Name + " for " + dmgAsStr + "health points !"
				log.Println(prefixLog, "send success message to sender")
				conn.WriteJSON(&game.TextData{Type: game.TypeSuccess, Value: msg})
				p.Mutex.Unlock()
				return
			}
			p.Mutex.Unlock()
		}
	}
	player.Mutex.Lock()
	msg := randQrMsg(resp, player)
	conn.WriteJSON(&game.TextData{Type: game.TypeSuccess, Value: msg})
	sendAllAttributes(conn, player)
	player.Mutex.Unlock()
}

func randQrMsg(qrId string, player *game.Player) string {
	gameinstance := game.GetGameInstance(player.GameID)
	for _, qr := range gameinstance.QrCodes {
		if qr.Id == qrId && qr.Cooldown <= 0 {
			qr.Cooldown = 2600
			min := 5
			max := 75
			value := int16(rand.Intn(max-min) + min)
			if rand1() {
				player.BotContext.Energy = player.BotContext.Energy + value
				return "You've found an energy cache !\n+" + strconv.Itoa(int(value)) + " Energy"
			}
			player.BotContext.Health = player.BotContext.Health + int8(value)
			return "You've found a repair kit !\n+" + strconv.Itoa(int(value)) + " Health"
		} else if qr.Id == qrId && qr.Cooldown > 0 {
			return "The cache has already been looted !"
		}
	}
	return "You haven't found anything"
}

func rand1() bool {
	return rand.Float32() < 0.5
}

func sendAllAttributes(c *websocket.Conn, player *game.Player) {
	c.WriteJSON(&game.Data{Type: game.TypeEnergy, Value: player.BotContext.Energy})
	c.WriteJSON(&game.Data{Type: game.TypeOverheat, Value: player.BotContext.Heat})
	c.WriteJSON(&game.Data{Type: game.TypeHealth, Value: int16(player.BotContext.Health)})
}
