package config

// Config variable
var Config = Configuration{
	Local: "192.16.1.31",
	Port:  "8888",
	Env:   "default",
}

// Configuration of the robot server
type Configuration struct {
	Local string
	Port  string
	Env   string
}
