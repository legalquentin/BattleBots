package stub

import (
	"encoding/json"
	"log"
	"net/http"

	"../utils"
	"github.com/gorilla/websocket"
)

const prefixErr = "[ERR](STUB)"
const prefixLog = "[LOG](STUB)"
const prefixWarn = "[WARN](STUB)"

var upgrader = websocket.Upgrader{}

// WsStubCtrl ws hander
func WsStubCtrl(w http.ResponseWriter, r *http.Request) {
	log.Println(prefixLog, "client connecting to stub...")

	utils.EnableCors(&w)
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(prefixErr, err)
		return
	}

	defer c.Close()
	for {
		msg := utils.Key{}
		mt, message, err := c.ReadMessage()
		if err != nil {
			log.Println(prefixWarn, "lost client connexion..")
			break
		}
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Println(prefixErr, err)
		}
		if err != nil {
			log.Println(prefixErr, err)
		}
		// utils.ProcessInput(i1, msg.Press)
		log.Println(prefixLog, "INPUT", msg.Content)
		err = c.WriteMessage(mt, message)
		if err != nil {
			log.Println(prefixErr, err)
		}
	}
}
