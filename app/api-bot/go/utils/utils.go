package utils

import (
	"log"
	"net/http"
)

//ProcessInput = function maping keys to (TBD function passed in params)
func ProcessInput(msg int, press bool) string {
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

// EnableCors allow cors
func EnableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}
