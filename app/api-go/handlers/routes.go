package handlers

import (
	"TIC-GPE5/Worker/client"
	"net/http"
)

// Route model
type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

// Routes model
var Routes = []Route{
	Route{
		"Connect to bot",
		"GET",
		"/api/bots/ws",
		client.WsHandler,
	},
}
