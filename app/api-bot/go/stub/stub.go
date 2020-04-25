package stub

import (
	"encoding/json"
	"log"
	"net/http"

	"../config"
	"../utils"
	"github.com/gorilla/websocket"
)

const prefixErr = "[ERR](STUB)"
const prefixLog = "[LOG](STUB)"
const prefixWarn = "[WARN](STUB)"

var upgrader = websocket.Upgrader{}

type health struct {
	Message string `json:"message,omitempty"`
	Code    int    `json:"code,omitempty"`
}

// WsStubCtrl stub for the ws controller handler
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

// WsStubVideoStream stub for the python server
func WsStubVideoStream(w http.ResponseWriter, r *http.Request) {
	log.Println(prefixLog, "client connecting to video stub...")
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

// HealthCtrl to ping the robot server with http pprotocol
func HealthCtrl(w http.ResponseWriter, r *http.Request) {
	log.Println(prefixLog, "healthcheck")

	// TODO: return avg consumption of ram/cpu/gpu and available battery of the pi

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(&health{"Bot server running with " + config.Config.Env + " environment", 200})
	return
}
