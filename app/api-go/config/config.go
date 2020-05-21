package config

import (
	"encoding/json"
	"log"
	"os"

	"../game"
)

const prefixWarn = "[WARN](CONFIG)"

// ReadConfig read a json file with constant definitions based on the environment variable "ENV"
// Possible values are: 'localhost', 'dev', 'prod'
// keep in mind that default config require one bot running on localhost with port 8888 opened (default config there too)
// TODO: ws connect to 8084 and 8888 on the bot api, but 8084 (python stream is not available in stub mode), find a fix @quentin.legal
func ReadConfig() *error {
	var env = os.Getenv("ENV")

	game.Appartement.Bots = Config.Bots
	dir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
	file, err := os.Open(dir + "/env/config." + env + ".json")
	if err != nil {
		log.Println(prefixWarn, "ENV must be of: 'localhost', 'dev' or 'prod'. starting with default configuration")
		return &err
	}

	decoder := json.NewDecoder(file)
	err = decoder.Decode(&Config)
	if err != nil {
		return &err
	}

	return nil
}
