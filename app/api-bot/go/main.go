package main

import (
	"flag"
	"log"
	"net/http"

	"./bot"
	"./stub"
	rpio "github.com/stianeikeland/go-rpio"
)

const prefixErr = "[ERR](MAIN)"
const prefixLog = "[LOG](MAIN)"
const prefixWarn = "[WARN](MAIN)"

var addr = flag.String("addr", "127.0.0.1:8088", "http service address")

func main() {
	err := rpio.Open()
	if err != nil {
		log.Println(prefixWarn, "RPIO unavailable, starting as stub...")
		http.HandleFunc("/", stub.WsStubCtrl)
		http.HandleFunc("/video", stub.WsStubVideoStream)
	} else {
		defer rpio.Close()
		bot.SetUpPins()
		http.HandleFunc("/", bot.WsBotCtrl)
	}
	log.Fatal(http.ListenAndServe(*addr, nil))
}
