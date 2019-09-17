package main

import (
	"TIC-GPE5/Worker/client"
	"TIC-GPE5/Worker/handlers"
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

func startHTTPServer() *http.Server {

	router := handlers.NewRouter()
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handlers.PreProcessHandler(w, r, router)
	})
	srv := &http.Server{Addr: ":1234", Handler: handler}

	go func() {
		if err := srv.ListenAndServe(); err != nil {
			// handle err
		}
	}()

	// returning reference so caller can call Shutdown()
	return srv
}

func main() {

	log.Printf("main: starting HTTP server")
	srv := startHTTPServer()

	// start sockets manager in goroutine
	go client.PlayerManager.Start()

	// Setting up signal capturing
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)

	// Waiting for SIGINT (pkill -2)
	<-stop
	log.Printf("main: stopping HTTP server")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		// handle err
	}
	log.Printf("main: done. exiting")
}
