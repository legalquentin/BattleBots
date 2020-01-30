package main

import (
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/websocket"
	// // rpio "github.com/stianeikeland/go-rpio"
)

// Lo ws content format
type Lo struct {
	Content string `json:"c,omitempty"`
	Press   bool   `json:"p,omitempty"`
}

var laserLocked = false
var pwmFreq = 10000

// pin defined to control pi peripherics

// driver
// var pinPwma = rpio.Pin(18)
// var pinAin1 = rpio.Pin(23)
// var pinAin2 = rpio.Pin(24)

// var pinPwmb = rpio.Pin(19)
// var pinBin1 = rpio.Pin(27)
// var pinBin2 = rpio.Pin(22)
// var pinStby = rpio.Pin(25)

// var pinLaser = rpio.Pin(26)

// PWM is for analog control over the pins
// func setUpPins() {
// 	// pinPwma.Mode(rpio.Pwm)
// 	// pinPwmb.Mode(rpio.Pwm)

// 	// pinPwma.Freq(pwmFreq)
// 	// pinPwmb.Freq(pwmFreq)

// 	// pinPwma.DutyCycle(0, 100)
// 	// pinPwmb.DutyCycle(0, 100)

// 	// pinAin1.Output()
// 	// pinAin2.Output()
// 	// pinBin1.Output()
// 	// pinBin2.Output()
// 	// pinStby.Output()
// 	// pinLaser.Output()
// }

// func backward(spd uint32) {
// 	runMotor(0, spd, 0)
// 	runMotor(1, spd, 0)
// }

// func forward(spd uint32) {
// 	runMotor(0, spd, 1)
// 	runMotor(1, spd, 1)
// }

// func rotateLeft(spd uint32) {
// 	runMotor(0, spd, 1)
// 	runMotor(1, spd, 0)
// }

// func rotateRight(spd uint32) {
// 	runMotor(0, spd, 0)
// 	runMotor(1, spd, 1)
// }

// func runMotor(motor int, spd uint32, direction int) {
// 	pinStby.High()

// 	if motor == 0 {
// 		if direction == 1 {
// 			pinAin1.Low()
// 			pinAin2.High()
// 		} else {
// 			pinAin1.High()
// 			pinAin2.Low()
// 		}
// 		pinPwma.DutyCycle(spd, 100)
// 		//	 log.Println("A")
// 	} else if motor == 1 {
// 		if direction == 1 {
// 			pinBin1.High()
// 			pinBin2.Low()
// 		} else {
// 			pinBin1.Low()
// 			pinBin2.High()
// 		}
// 		pinPwmb.DutyCycle(spd, 100)
// 		//		log.Println("B")
// 	}
// }

// func stopMotor() {
// 	pinStby.Low()
// }

// func shutdownLaser() {
// 	time.Sleep(100 * time.Millisecond)
// 	pinLaser.Low()
// 	time.Sleep(300 * time.Millisecond)
// 	pinLaser.High()
// 	time.Sleep(100 * time.Millisecond)
// 	pinLaser.Low()
// 	time.Sleep(300 * time.Millisecond)
// 	pinLaser.High()
// 	time.Sleep(100 * time.Millisecond)
// 	pinLaser.Low()
// 	time.Sleep(300 * time.Millisecond)
// 	pinLaser.High()
// 	time.Sleep(100 * time.Millisecond)
// 	pinLaser.Low()
// 	laserLocked = false
// }

// func fireLaser() {
// 	if !laserLocked {
// 		laserLocked = true
// 		pinLaser.High()
// 		go shutdownLaser()
// 	}
// }

//  pin.DutyCycle(0, 32)
// the LED will be blinking at 2000Hz
// pin.DutyCycle(i, 32)
// (source frequency divided by cycle length => 64000/32 = 2000)

// Pin output  example
// pin.Output()       // Output mode
// pin.High()         // Set pin High
// pin.Low()          // Set pin Low
// pin.Toggle()       // Toggle pin (Low -> High -> Low)

// pin.Input()        // Input mode
// res := pin.Read()  // Read state from pin (High / Low)

// pin.Mode(rpio.Output)   // Alternative syntax
// pin.Write(rpio.High)    // Alternative syntax

var addr = flag.String("addr", "127.0.0.1:8088", "http service address")

var upgrader = websocket.Upgrader{} // use default options

func control(w http.ResponseWriter, r *http.Request) {
	println("client connecting to bot...")

	//	enableCors(&w)
	c, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Print("upgrade:", err)
		return
	}

	defer c.Close()
	for {
		dat := Lo{}

		mt, message, err := c.ReadMessage()
		if err != nil {
			println("lost client connexion..")
			break
		}

		if err := json.Unmarshal(message, &dat); err != nil {
			//panic(err)
			log.Println(err)
		}

		if err != nil {
			log.Println("read:", err)
			//			break
		}
		i1, err := strconv.Atoi(dat.Content)
		if err != nil {
			log.Println(err)
		}
		// log.Printf("all: %s\n", dat)
		// log.Printf("recv: %s\n", dat.Content)
		processInput(i1, dat.Press)
		err = c.WriteMessage(mt, message)
		if err != nil {
			log.Println("write:", err)
			//		 		break
		}
	}
}

func processInput(msg int, press bool) string {
	// speed := uint32(100)
	var res = ""
	e := ""
	switch msg {
	case 37:
		res = "left"
		println("left")
		// rotateLeft(speed)
	case 38:
		res = "up"
		println("up")
		// forward(speed)
	case 39:
		res = "right"
		println("right")
		// rotateRight(speed)
	case 40:
		res = "down"
		println("down")
		// backward(speed)
	case 32:
		res = "space"
		println("space")
		// fireLaser()
	}
	if press {
		e = res + "-p"

	} else {
		e = res + "-r"
		// stopMotor()
	}

	log.Println(e)
	return e
}

func main() {

	// Check if gpio is available else quit
	// err := rpio.Open()
	// if err != nil {
	// 	os.Exit(1)
	// }
	// defer rpio.Close()

	// setUpPins()
	// flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/ctrl", control)
	log.Fatal(http.ListenAndServe(*addr, nil))

	// ...
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}
