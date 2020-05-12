package camera

import (
	"log"
	"net/http"

	"../socket"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	// Commented to check if default buffer size impact negatively the video stream pipe socket
	// ReadBufferSize:  1024,
	// WriteBufferSize: 1024,
}

// TODO: remove the flags, in the end the addresses are defined from the game instance
// var addr = flag.String("camera", "192.168.1.66:8084", "cam ws address")

// TODO: Need to secure who can open a socket to the robot feed

// WsHandlerCam pipe camera output from bot to frontend via sockets
func WsHandlerCam(res http.ResponseWriter, req *http.Request) {

	player, conn := socket.WsAuth(res, req)
	if player == nil || conn == nil {
		log.Println(prefixWarn, "player or conn is nil")
		return
	}

	// we attach the client conn to the robot
	player.BotSpecs.Client = conn
	for {
		if player.BotSpecs != nil {
			if player.BotSpecs.Socket == nil {
				return
			}
		}
	}
}
