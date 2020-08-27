package config

import (
	"../game"
)

// Config variable
var Config = Configuration{
	Local:   "127.0.0.1",
	Port:    "4443",
	Env:     "default",
	KeyPath: "/home/pi/BattleBots/app/api-go/",
	Bots: []game.Bot{
		{
			ID:           1,
			Address:      "192.168.1.66",
			Running:      1,
			Taken:        false,
			Name:         "Rocinante",
			BaseSpeed:    100,
			BaseDamage:   25,
			BaseHull:     100,
			BaseFireRate: 4,
		},
		{
			ID:           2,
			Address:      "192.168.1.31",
			Running:      0,
			Taken:        false,
			Name:         "Razorback",
			BaseSpeed:    100,
			BaseDamage:   35,
			BaseHull:     100,
			BaseFireRate: 5,
		}},
}

// Configuration of the robot server
type Configuration struct {
	Local   string
	Port    string
	Env     string
	KeyPath string
	Bots    []game.Bot
}
