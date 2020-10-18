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

// GameDuration in seconds
const GameDuration = 60
const GameTimeOut = 60

// RunningBots map existing Bots
var RunningBots = []*Bot{}

// TODO: Define types
const TypeDisconnect = -1
const TypeEnergy = 1
const TypeOverheat = 2
const TypeHealth = 3
const TypePoints = 4
const TypeCooldown = 5

// Type displaying the message popup on the front
const TypeAlert = 10
const TypeInfo = 11
const TypeSuccess = 12
const TypeWarning = 13

// Type displaying the message popup on the front with a timer
const TypeAlertTimer = 20
const TypeInfoTimer = 21
const TypeSuccessTimer = 22
const TypeWarningTimer = 23

type GameStatus int

const StatusCreated = "CREATED"
const StatusStarted = "STARTED"
const StatusStopped = "STOPPED"
const StatusEnded = "ENDED"

var AllQrCodes = []QrCodes{
	{"1", 0},
	{"2", 0},
	{"6", 0},
}
