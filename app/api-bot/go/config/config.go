package config

import (
	"encoding/json"
	"os"
)

// ReadConfig read a json file with constant definitions based on the environment variable "ENV"
// Possible values are: 'localhost', 'dev', 'prod'
func ReadConfig() *error {
	var env = os.Getenv("ENV")

	file, err := os.Open("env/config." + env + ".json")
	if err != nil {
		return &err
	}

	decoder := json.NewDecoder(file)
	err = decoder.Decode(&Config)
	if err != nil {
		return &err
	}

	return nil
}
