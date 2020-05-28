package client

import (
	"log"
	"net/http"
	"net/url"

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
	player.BotSpecs.SocketClientCtrl = conn
	player.BotContext.Heat = 0
	player.BotContext.Moving = false

	u := url.URL{Scheme: "ws", Host: "192.168.1.66:8088", Path: "/wsctrl"}

	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Println(prefixErr, err)
		http.NotFound(res, req)
		return
	}
	player.BotSpecs.SocketBotCtrl = c

	for {
		// read a message from the client [c]
		// TODO: check if message is valid
		var cmd Key
		err := c.ReadJSON(&cmd)
		if err != nil {
			log.Println(prefixWarn, err)
			return
		}
		log.Println(prefixLog, "command sent;", cmd.Content, cmd.Press)
		player.BotContext.Moving = cmd.Press
		// write a message to the bot [conn]
		if err := conn.WriteJSON(&cmd); err != nil {
			log.Println(prefixWarn, err)
			return
		}
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
