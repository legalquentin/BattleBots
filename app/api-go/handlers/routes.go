package handlers

import (
	"net/http"

	"../camera"
	"../client"
	"../game"
	"../health"
)

// Route model
type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
	secure      bool
}

// Routes model
var Routes = []Route{
	Route{
		"Start a game instance",
		"POST",
		"/api/game/create",
		game.CreateGame,
		true,
	},
	Route{
		"Join a game instance",
		"POST",
		"/api/game/join",
		game.JoinGame,
		false,
	},
	Route{
		"Delete a game instance",
		"DELETE",
		"/api/game/delete",
		game.DeleteGame,
		true,
	},
	Route{
		"get games info",
		"GET",
		"/api/game/info",
		game.WorkerInfo,
		false,
	},
	Route{
		"Connect to bot",
		"GET",
		"/api/bots/ws",
		client.WsHandlerCtrl,
		false,
	},
	Route{
		"Connect to bot cam",
		"GET",
		"/api/bots/wscam",
		camera.WsHandlerCam,
		false,
	},
	Route{
		"Health check",
		"GET",
		"/api/health",
		health.Check,
		false,
	},
	Route{
		"Availability check",
		"GET",
		"/api/game/availability/",
		game.CheckAvailability,
		false,
	},
}
