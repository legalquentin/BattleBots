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

	// "./game"
	"./handlers"
)

const prefixErr = "[ERR](MAIN)"
const prefixLog = "[LOG](MAIN)"
const prefixWarn = "[WARN](MAIN)"

const port = "443"

func startHTTPServer() *http.Server {

	router := handlers.NewRouter()
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlers.PreProcessHandler(w, r, router)
	})
	srv := &http.Server{Addr: (":" + port), Handler: handler}

	go func() {
		if err := srv.ListenAndServeTLS("cert.pem",
			"key.pem"); err != nil {
			log.Println(prefixErr, err)
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

	if r, e := getSecret(); e != nil {
		fmt.Println(prefixErr, e)
		return
	} else {
		println(r)
		// game.WorkerCtx.Secret = r
	}

	log.Println(prefixLog, "Starting HTTP server on port:", port)
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
