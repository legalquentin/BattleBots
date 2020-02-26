package game

// TODO: check if it the best way to store default game data

// Constants file is where all default data reltive to game instances will be declared
// eg: arenas, environements, battlebots specs, etc...

const prefixErr = "[ERR](GAME)"
const prefixLog = "[LOG](GAME)"
const prefixWarn = "[WARN](GAME)"

// WorkerCtx hold control data such as the secret provided in entry params only shared between it and
// the api
var WorkerCtx = Worker{}

// BaseGameInstances hold all game instances
var baseGameInstances = make(map[string]Game)

var availableBots = []Bot{
	// Bot{2, "192.168.1.66", false, false, "Rocinante", 6, 10, 10, 5},
	// Bot{1, "192.168.1.31", false, false, "Razorback", 10, 4, 6, 10},
	Bot{1, "127.0.0.1", false, false, "stubRobot", 10, 2, 6, 10},
}

var appartement = Environment{
	1, "quentin's appartement", []*Bot{&availableBots[0]}, true,
}
