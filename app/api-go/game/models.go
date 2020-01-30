package game

// Worker is the main data struct holding all games
type Worker struct {
	Secret string
}

// Game is the struct holding all data of each instance
type Game struct {
	Name    string
	Token   string
	Started bool
	Env     *Environment
	Players []Player
}

// Player is one of the entity playing in a game, it hold bot data
type Player struct {
	ID    string
	Token string
	// botAttr  BotAttr
	BotSpecs   *Bot
	BotContext Context
}

// Context hold game data on a specific bot while running
type Context struct {
	Moving bool
	Energy int16
	Heat   int16
}

// BotAttr hold game data on a specific bot (default multiplicators & values)
type BotAttr struct {
	name     string
	energy   int8
	hull     int8
	heat     int8
	crew     int8
	funds    int16
	video    bool
	damage   int8
	fireRate int8
	speed    int8
}

// Bot hold technicals info on its physical attributes and virtualgame info :
// - Physical info { network ip address, currently running, where it is (the arena) etc... }
// - Game info { robot name, speed, damage, hull... }
// think about the attributes that shouldn't be changed (ip, id, basestats)
type Bot struct {
	// technical stuff
	id      int16
	Address string
	Running bool
	Taken   bool

	// game relative stuff
	Name         string
	BaseSpeed    int8
	BaseDamage   int8
	BaseHull     int8
	BaseFireRate int8
}

// Environment is the physical place where battlebots are: (room 1, room2, room3)
type Environment struct {
	ID        int16
	Name      string
	Bots      []*Bot
	Available bool
}

// Rules hold the rules of the game instance (deathmatch, capture the flag, free for all,
// team match, exploration...)
type Rules struct {
	id   int
	name string
	desc string
}

// Map is the virtual env that can be selected when creating a game
// it could have some cool stuf like modifier multiplicator on bots attributes, video feed
// color/brightness/perturbations, and other stuff TODO: (To be defined)
type Map struct {
	id          int
	name        string
	desc        string
	modifSpeed  int16
	modifHealth int16
	modifDamage int16
	modifRate   int16
	modifLight  int16
	modifHull   int16
}

// **************************** API MODELS VALIDATION / RESPONSES **************************

// Response basic json res
type Response struct {
	Message string `json:"message,omitempty"`
	Code    int    `json:"code,omitempty"`
}

// NewGameValidation payload
type NewGameValidation struct {
	ID    int    `json:"id,omitempty"`
	Name  string `json:"name,omitempty"`
	Token string `json:"token,omitempty"`
}

// JoinGameValidation payload
type JoinGameValidation struct {
	GameID   string `json:"gameID"`
	PlayerID string `json:"playerID"`
}

// JoinIDs are required felds to specify on wich game instance/bot to connect
// usefull for controls, camera and also data
type JoinIDs struct {
	PlayerID string `validate:"required"`
	GameID   string `validate:"required"`
}

// DeleteGameValidation payload
type DeleteGameValidation struct {
	id int `validate:"required"`
}

// Info hold usefull info about what's currently running in the worker
type Info struct {
	Code  int
	games []Game
}
