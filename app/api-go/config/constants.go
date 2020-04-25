package config

import (
	"../game"
)

// Config variable
var Config = Configuration{
	Local:   "127.0.0.1",
	Port:    "8888",
	Env:     "default",
	KeyPath: "/Users/quentin/D.PERS/BattleBots/app/api-go/",
	Bots: []game.Bot{{
		ID:           1,
		Address:      "127.0.0.1",
		Running:      true,
		Taken:        false,
		Name:         "Stub-Robot",
		BaseSpeed:    100,
		BaseDamage:   100,
		BaseHull:     100,
		BaseFireRate: 100,
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
