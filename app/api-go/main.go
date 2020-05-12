package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"./config"
	"./game"
	"./handlers"
)

const prefixErr = "[ERR](MAIN)"
const prefixLog = "[LOG](MAIN)"
const prefixWarn = "[WARN](MAIN)"

func startHTTPServer() *http.Server {

	router := handlers.NewRouter()
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlers.PreProcessHandler(w, r, router)
	})
	srv := &http.Server{Addr: (":" + config.Config.Port), Handler: handler}

	go func() {
		kp := config.Config.KeyPath
		if err := srv.ListenAndServeTLS(kp+"cert.pem", kp+"key.pem"); err != nil {
			log.Fatalln(prefixLog, err.Error())
		}
	}()

	// returning reference so caller can call Shutdown()
	return srv
}

// get secret from program params used to authentify "api only" functions
func getSecret() (string, error) {
	log.Println(prefixLog, os.Args)
	if len(os.Args) == 1 || len(os.Args[1]) < 10 {
		return "", errors.New("worker secret key invalid")
	}
	return os.Args[1], nil
}

func main() {

	err := config.ReadConfig()
	if err != nil {
		log.Println(prefixWarn, (*err).Error())
	}

	r, e := getSecret()
	if e != nil {
		fmt.Println(prefixErr, e)
		return
	}
	game.WorkerCtx.Secret = r

	go func() {
		for _, b := range game.RunningBots {
			if b.Socket == nil {
				go game.Daemon(b)
			}
		}
		time.Sleep(time.Second)
	}()

	log.Println(prefixLog, "Starting HTTP server on port:", config.Config.Port)
	log.Println(prefixLog, "secret is :", game.WorkerCtx.Secret)
	srv := startHTTPServer()

	// Setting up signal capturing
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)

	// Waiting for SIGINT (pkill -2)
	<-stop
	log.Println(prefixLog, "Stopping HTTP server")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		// handle err
	}
	log.Println(prefixLog, "Done, exiting...")
}
