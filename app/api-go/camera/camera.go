package camera

import (
	"bufio"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

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
	if player == nil {
		return
	}

	player.Mutex.Lock()
	player.BotSpecs.SocketClientCam = conn

	u := url.URL{Scheme: "ws", Host: player.BotSpecs.Address + ":8084", Path: "/"}

	log.Println(prefixLog, req.Host+"=>"+u.String())
	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Println(prefixErr, err)
	}
	player.BotSpecs.SocketBotCam = c

	file, err := os.OpenFile("./streams/"+fmt.Sprintf("%v", player.BotSpecs.ID)+"_"+fmt.Sprintf("%v", time.Now().Unix())+".bbs", os.O_APPEND|os.O_WRONLY, 0600)
	player.Mutex.Unlock()

	if err != nil {
		panic(err)
	}
	defer file.Close()

	bufferedWriter := bufio.NewWriter(file)

	// Read c(robot) video stream and write to conn(client)
	defer conn.Close()
	defer c.Close()
	for {
		messageType, p, err := c.ReadMessage()
		if err != nil {
			log.Println(prefixWarn, err)
			return
		}

		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(prefixWarn, err)
			return
		}
		_, error := bufferedWriter.Write(p)
		if err != nil {
			return
		}
	}
}
