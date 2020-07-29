package bot

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"../utils"
	"github.com/gorilla/websocket"
)

const prefixErr = "[ERR](BOT)"
const prefixLog = "[LOG](BOT)"
const prefixWarn = "[WARN](BOT)"

var upgrader = websocket.Upgrader{}

// WsBotCtrl is the ws handler in charge of translating input in rpio operations
func WsBotCtrl(w http.ResponseWriter, r *http.Request) {
	log.Println(prefixLog, "client connecting to bot...")

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
		utils.ProcessInput(msg.Content, msg.Press)
		err = c.WriteMessage(mt, message)
		if err != nil {
			log.Println(prefixErr, err)
		}
	}
}

func runMotor(motor int, spd uint32, direction int) {
	pinStby.High()

	if motor == 0 {
		if direction == 1 {
			pinAin1.Low()
			pinAin2.High()
		} else {
			pinAin1.High()
			pinAin2.Low()
		}
		pinPwma.DutyCycle(spd, 100)
		log.Println("A")
	} else if motor == 1 {
		if direction == 1 {
			pinBin1.High()
			pinBin2.Low()
		} else {
			pinBin1.Low()
			pinBin2.High()
		}
		pinPwmb.DutyCycle(spd, 100)
		log.Println("B")
	}
}

func stopMotor() {
	pinStby.Low()
}

func backward(spd uint32) {
	runMotor(0, spd, 0)
	runMotor(1, spd, 0)
}

func forward(spd uint32) {
	runMotor(0, spd, 1)
	runMotor(1, spd, 1)
}

func rotateLeft(spd uint32) {
	runMotor(0, spd, 1)
	runMotor(1, spd, 0)
}

func rotateRight(spd uint32) {
	runMotor(0, spd, 0)
	runMotor(1, spd, 1)
}

func shutdownLaser() {
	time.Sleep(100 * time.Millisecond)
	pinLaser.Low()
	time.Sleep(300 * time.Millisecond)
	pinLaser.High()
	time.Sleep(100 * time.Millisecond)
	pinLaser.Low()
	time.Sleep(300 * time.Millisecond)
	pinLaser.High()
	time.Sleep(100 * time.Millisecond)
	pinLaser.Low()
	time.Sleep(300 * time.Millisecond)
	pinLaser.High()
	time.Sleep(100 * time.Millisecond)
	pinLaser.Low()
	laserLocked = false
}

func fireLaser() {
	if !laserLocked {
		laserLocked = true
		pinLaser.High()
		go shutdownLaser()
	}
}
