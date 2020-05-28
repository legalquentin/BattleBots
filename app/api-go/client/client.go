package client

import (
	"log"
	"net/http"
	"net/url"
	"time"

	"../game"
	"../socket"
	"github.com/gorilla/websocket"
)

// TODO: remove the flags, in the end the addresses are defined from the game instance
// var addr = flag.String("camera", "192.168.1.66:8084", "cam ws address")

// TODO: Need to secure who can open a socket to the robot feed

// WsHandlerCtrl handle client input, game
func WsHandlerCtrl(res http.ResponseWriter, req *http.Request) {
	player, _ := socket.WsAuth(res, req)
	if player == nil {
		return
	}

	u := url.URL{Scheme: "ws", Host: "192.168.1.66:8088", Path: "/wsctrl"}

	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Println(prefixErr, err)
	}
	conn, err := (&websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}).Upgrade(res, req, nil)
	if err != nil {
		log.Println(prefixErr, err)
		http.NotFound(res, req)
		return
	}

	var flag = true

	// go func(flag bool) {
	defer c.Close()
	defer conn.Close()
	for {
		// read a message from the client [c]
		// TODO: check if message is valid
		var r = Key{}
		if err := conn.ReadJSON(&r); err != nil {
			log.Println(prefixWarn, err)
			break
		}

		player.BotContext.Moving = r.Press

		if flag {
			go doEvery(100*time.Millisecond, calcAttributes, player, conn, c)
			flag = false
		}

		// write a message to the bot [conn]
		if player.BotContext.Energy <= 0 || player.BotContext.Heat >= 100 {
			r = Key{"0", false}
		}

		if err := c.WriteJSON(r); err != nil {
			log.Println(prefixWarn, err)
			return
		}
	}
	// }(flag)

	// for {
	// 	// read a message from the client [c]
	// 	// TODO: check if message is valid
	// 	_, p, err := c.ReadMessage()
	// 	if err != nil {
	// 		log.Println(prefixWarn, err)
	// 		return
	// 	}
	// 	// write a message to the bot [conn]
	// 	if err := conn.WriteMessage(websocket.TextMessage, p); err != nil {
	// 		log.Println(prefixWarn, err)
	// 		return
	// 	}
	// }

}

func doEvery(d time.Duration, f func(*game.Player, *websocket.Conn, *websocket.Conn),
	player *game.Player, conn *websocket.Conn, bot *websocket.Conn) {
	for range time.Tick(d) {
		f(player, conn, bot)
	}
}

func calcAttributes(player *game.Player, conn *websocket.Conn, bot *websocket.Conn) {
	if player.BotContext.Moving {
		if player.BotContext.Energy > 0 {
			player.BotContext.Energy--
			conn.WriteJSON(&Data{TYPE_ENERGY, player.BotContext.Energy})
		} else {
			player.BotContext.Moving = false
			bot.WriteJSON(&Key{"0", false})
		}
		if player.BotContext.Heat < 100 {
			player.BotContext.Heat += 2
			conn.WriteJSON(&Data{TYPE_OVERHEAT, player.BotContext.Heat})
		} else {
			player.BotContext.Moving = false
			bot.WriteJSON(&Key{"0", false})
		}
	} else {
		if player.BotContext.Energy < 100 {
			player.BotContext.Energy++
			conn.WriteJSON(&Data{TYPE_ENERGY, player.BotContext.Energy})
		}
		if player.BotContext.Heat > 0 {
			player.BotContext.Heat -= 2
			conn.WriteJSON(&Data{TYPE_OVERHEAT, player.BotContext.Heat})
		}
	}
}
