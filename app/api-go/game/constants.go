package game

// TODO: check if it the best way to store default game data

// Constants file is where all default data reltive to game instances will be declared
// eg: arenas, environements, battlebots specs, etc...

const prefixErr = "[ERR](GAME)"
const prefixLog = "[LOG](GAME)"
const prefixWarn = "[WARN](GAME)"

// WorkerCtx hold control data such as the secret provided in entry params only shared between it and
// the api
var WorkerCtx = Worker{""}

// BaseGameInstances hold all game instances
var baseGameInstances = make(map[string]Game)

var availableBots = []Bot{
	Bot{2, "192.168.1.66", false, false, "Rocinante", 6, 10, 10, 5},
	Bot{1, "192.168.1.31", false, false, "Razorback", 10, 4, 6, 10},
}

TABLE STREAMS
stream_id, game_id, robot_id, kinesis_url, s3_url, private, running, duration, encodage

TABLE GAMES
game_id, game_name, arena_id, game_status, date_created

TABLE ARENA
arnena_id, arena_name, available

TABLE ROBOTS
bot_id, bot_ip, running, taken, name, speed, damage, fire_rate, health, armor, arena_id, player_id, game_id

TABLE PLAYER_GAME
game_id, player_id, winner(true/false), game_points

TABLE PLAYER
player_id, total_points

var appartement = Environment{
	1, "quentin's appartement", []*Bot{&availableBots[0], &availableBots[1]}, true,
}
