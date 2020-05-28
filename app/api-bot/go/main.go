package main

import (
	"flag"
	"log"
	"net/http"

	"./bot"
	"./config"
	"./stub"
	rpio "github.com/stianeikeland/go-rpio"
)

const prefixErr = "[ERR](MAIN)"
const prefixLog = "[LOG](MAIN)"
const prefixWarn = "[WARN](MAIN)"

func main() {
	err := config.ReadConfig()
	if err != nil {
		log.Println(prefixWarn, "Environment variable not defined, running with default parameters")
	}
	// rpio open() try to open rpio  in the pi, if it fail, the program start a stub server and there's no video feed
	e := rpio.Open()
	http.HandleFunc("/", stub.HealthCtrl)
	if e != nil {
		log.Println(prefixWarn, "RPIO unavailable, starting as stub...")
		http.HandleFunc("/wsctrl", stub.WsStubCtrl)
		http.HandleFunc("/wsvideo", stub.WsStubVideoStream)
	} else {
		defer rpio.Close()
		// bot.SetUpPins()
		http.HandleFunc("/wsctrl", bot.WsBotCtrl)
	}
	var addr = flag.String("addr", config.Config.Local+":"+config.Config.Port, "http service address")
	log.Fatal(http.ListenAndServe(*addr, nil))
}
