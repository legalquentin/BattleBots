package config

// Config variable
var Config = Configuration{
	Local: "127.0.0.1",
	Port:  "8888",
	Env:   "Default",
}

// Configuration of the robot server
type Configuration struct {
	Local string
	Port  string
	Env   string
}
