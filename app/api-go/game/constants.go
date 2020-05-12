package game

// TODO: check if it the best way to store default game data

// Constants file is where all default data reltive to game instances will be declared
// eg: arenas, environments, battlebots specs, etc...

const prefixErr = "[ERR](GAME)"
const prefixLog = "[LOG](GAME)"
const prefixWarn = "[WARN](GAME)"

// WorkerCtx hold control data such as the secret provided in entry params only shared between it and
// the api
var WorkerCtx = Worker{}

// BaseGameInstances hold all game instances
var baseGameInstances = make(map[string]Game)

// AvailableBots in the arena
var AvailableBots = []Bot{}

// Appartement Todo: put this in a config file too ?
var Appartement = Environment{
	1, "martin's appartement", AvailableBots, true,
}

// RunningBots map existing Bots
var RunningBots = []Bot{}
