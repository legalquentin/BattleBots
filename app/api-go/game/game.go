package game

// TODO: use game package as an handler for events in a game "win, loss, damage, energy, etc..."
// not as an api (it should go in the api package)

import (
	"bytes"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"sync"
	"time"

	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// CreateGame function need to be called once to setup everything
func CreateGame(res http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	decoder.DisallowUnknownFields()
	var payload NewGameValidation
	err := decoder.Decode(&payload)
	if err != nil || payload.Name == "" || payload.Token == "" {
		log.Println(prefixWarn, "Bad request")
		http.Error(res, "Bad Request", 400)
		return
	}

	id := strconv.Itoa(payload.ID)
	log.Println(prefixLog, payload.ID)
	if len(baseGameInstances) > 0 {
		log.Println(prefixWarn, "Only one game is suported")
		http.Error(res, "No available slot for a new game", 400)
		return
	}
	if _, ok := baseGameInstances[id]; ok {
		log.Println(prefixWarn, "Game '"+payload.Name+"' with id '"+id+"' already exist")
		http.Error(res, "Game already exist", 400)
		return
	}

	var flagAllTaken = true
	for _, bot := range Appartement.Bots {
		if !bot.Taken {
			flagAllTaken = false
		}
	}
	if flagAllTaken {
		log.Println(prefixWarn, "No bot left for a new game")
		http.Error(res, "No available bots for a new game", 400)
		return
	}

	baseGameInstances[id] = Game{
		Name:      payload.Name,
		Token:     payload.Token,
		Started:   false,
		Env:       &Appartement,
		CreatedAt: time.Now(),
	}

	// baseGameInstances
	log.Println(prefixLog, "creating game...", baseGameInstances[id].Name)
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(baseGameInstances[id])

	for _, b := range baseGameInstances[id].Env.Bots {
		RunningBots = append(RunningBots, &b)
	}
	return
}

// GetGameInstance return instance of a game based on it's ID
func GetGameInstance(id string) Game {
	return baseGameInstances[id]
}

func updateGameAPI(game NodeGame) {
	url := "https://ebotfight.com/api/games/worker_end"
	fmt.Println(prefixLog, url)

	requestByte, _ := json.Marshal(game)
	req, err := http.NewRequest("PUT", url, bytes.NewReader(requestByte))
	if err != nil {
		fmt.Println(prefixErr, err.Error())
		// panic(err)
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(prefixErr, err.Error())
		// panic(err)
	}
	defer resp.Body.Close()

	fmt.Println(prefixLog, "response Status:", resp.Status)
	// fmt.Println(prefixLog, "response Headers:", resp.Header)
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(prefixLog, "response Body:", string(body))
}

func terminateGameAPI(game Game, id string) {
	game.EndedAt = time.Now()
	i, _ := strconv.Atoi(id)

	for idx := range baseGameInstances[id].Env.Bots {
		baseGameInstances[id].Env.Bots[idx].Taken = false
	}

	var ngi = NodeGame{
		int16(i),
		game.Name,
		game.Token,
		game.Started,
		game.TTL,
		game.StartedAt.Unix(),
		game.EndedAt.Unix(),
		game.CreatedAt.Unix(),
		game.Env,
		game.Players,
		StatusStopped,
	}
	updateGameAPI(ngi)
	closePlayerConn(game)
}

func finishGameAPI(game Game, id string) {
	game.EndedAt = time.Now()
	i, _ := strconv.Atoi(id)

	for idx := range baseGameInstances[id].Env.Bots {
		baseGameInstances[id].Env.Bots[idx].Taken = false
	}

	var ngi = NodeGame{
		int16(i),
		game.Name,
		game.Token,
		game.Started,
		game.TTL,
		game.StartedAt.Unix(),
		game.EndedAt.Unix(),
		game.CreatedAt.Unix(),
		game.Env,
		game.Players,
		StatusEnded,
	}
	updateGameAPI(ngi)
	closePlayerConn(game)
}

func closePlayerConn(game Game) {

	var biggest, min int8 = 0, 100
	for _, player := range game.Players {
		if player.BotContext.Health > biggest {
			biggest = player.BotContext.Health
		}
		if player.BotContext.Health < min {
			min = player.BotContext.Health
		}
	}

	for _, player := range game.Players {
		player.Mutex.Lock()
		if player.BotSpecs.SocketBotCam != nil {
			player.BotSpecs.SocketClientCam.Close()
			var code int16 = TypeDisconnect
			if player.BotContext.Health == min {
				if player.BotContext.Health == biggest {
					code = TypeDisconnectDraw
				} else {
					code = TypeDisconnectLost
				}
			} else if player.BotContext.Health == biggest {
				code = TypeDisconnectWon
			}
			player.BotSpecs.SocketClientCtrl.WriteJSON(Data{Type: code, Value: 0})
			player.BotSpecs.SocketBotCam.Close()
		}
		if player.BotSpecs.SocketClientCtrl != nil {
			player.BotSpecs.SocketClientCtrl.Close()
		}
		if player.BotSpecs.SocketBotCtrl != nil {
			player.BotSpecs.SocketBotCtrl.Close()
		}
		player.Mutex.Unlock()
	}
	for _, b := range game.Env.Bots {
		b.Taken = false
	}
}

// Daemon long running process to manage game instances
func Daemon() {
	for {
		tnow := time.Now()
		for key, game := range baseGameInstances {
			// fmt.Println(key, len(game.Players), game.CreatedAt.Sub(tnow).Minutes())
			if game.Started && tnow.Sub(game.StartedAt).Seconds() > float64(GameDuration) {
				// log.Println(prefixWarn, "DELETING game [", game.Name, "] reached 5 minutes")
				finishGameAPI(game, key)
				delete(baseGameInstances, key)
			} else {
				if game.Started == false && tnow.Sub(game.CreatedAt).Seconds() > float64(GameTimeOut) {
					terminateGameAPI(baseGameInstances[key], key)
					delete(baseGameInstances, key)
				}
				for _, player := range game.Players {
					if player.BotSpecs.SocketClientCtrl != nil {
						// k := Data{Type: TypeEnergy, Value: player.BotContext.Energy}
						// player.BotSpecs.SocketClientCtrl.WriteJSON(&k)
						// k = Data{Type: TypeOverheat, Value: player.BotContext.Heat}
						// player.BotSpecs.SocketClientCtrl.WriteJSON(&k)
					}
				}
				for _, qr := range game.QrCodes {
					if qr.Cooldown > 0 {
						qr.Cooldown = qr.Cooldown - 100
					}
				}
			}
		}
		time.Sleep(time.Second * 1)
	}
}

// JoinGame function can be called by a client to authentify and add him to the player,
// if the client is already registered, just update his credentials
// TODO: add authentication stuff here
func JoinGame(res http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	decoder.DisallowUnknownFields()
	var payload JoinGameValidation
	err := decoder.Decode(&payload)
	if err != nil || payload.GameID == "" || payload.PlayerID == "" {
		log.Println(prefixWarn, "Bad request")
		http.Error(res, "Bad Request", 400)
		return
	}
	var flag = false
	var p = Player{}
	log.Println(prefixLog, "Join game: "+payload.GameID+" - Player: "+payload.PlayerID)
	if selected, ok := baseGameInstances[payload.GameID]; ok {
		// if the player already exist return it
		for _, p := range selected.Players {
			if p.ID == payload.PlayerID {
				log.Println(prefixLog, "Player exist, connecting him to his bot")
				res.Header().Set("Content-Type", "application/json")
				json.NewEncoder(res).Encode(selected)
				return
			}
		}
		// else get a bot for the player
		for idx, b := range selected.Env.Bots {
			if b.Taken == false && b.ID == payload.BotID {
				log.Println(prefixLog, "reserving a bot")
				// TODO: add a real token generation
				baseGameInstances[payload.GameID].Env.Bots[idx].Taken = true
				p = Player{payload.PlayerID, tokenGenerator(), &b, Context{Moving: false, Energy: 100, Heat: 0, Health: b.BaseHull}, "", payload.GameID, sync.Mutex{}}
				var g = baseGameInstances[payload.GameID]
				p.Mutex.Lock()
				g.Players = append(g.Players, &p)
				// for _, qr := range AllQrCodes {
				// 	g.QrCodes = append(g.QrCodes, &qr)
				// }
				g.QrCodes = AllQrCodes
				baseGameInstances[payload.GameID] = g
				res.Header().Set("Content-Type", "application/json")
				json.NewEncoder(res).Encode(&g)
				p.Mutex.Unlock()
				for _, b := range baseGameInstances[payload.GameID].Env.Bots {
					if b.Taken == false {
						fmt.Println(prefixLog, b.Name+" TAKEN - FALSE")
						return
						// still one slot left, we don'payload start the game
						// return
					}
					fmt.Println(prefixLog, b.Name+" TAKEN - TRUE")
				}
				// all slot taken, we start the game
				g = baseGameInstances[payload.GameID]
				g.StartedAt = time.Now()
				g.Started = true
				baseGameInstances[payload.GameID] = g
				fmt.Println(prefixLog, "All Slot filled, game can start")
				return
			}
		}
		log.Println(prefixWarn, "Bot not available")
		http.Error(res, "Bot not available", 400)
		return
	}
	if !flag {
		log.Println(prefixWarn, "Game does not exist")
		http.Error(res, "Game does not exist", 404)
	}
}

// DeleteGame function can be called by a client to authentify and add him to the player,
// if the client is already registered, just update his credentials
func DeleteGame(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")

	key, ok := req.URL.Query()["id"]
	if !ok || len(key[0]) < 1 {
		log.Println(prefixWarn, "Bad request")
		json.NewEncoder(res).Encode(&Response{"Url Param 'id' is missing", 400})
		return
	}
	if _, ok := baseGameInstances[key[0]]; ok {
		// TODO: remove ressources created by the game, close player sockets etc..
		terminateGameAPI(baseGameInstances[key[0]], key[0])
		delete(baseGameInstances, key[0])
		log.Println(prefixLog, "deleted game: "+key[0])
		json.NewEncoder(res).Encode(&Response{"deleted, closing connections", 200})
		return
	}
	log.Println(prefixWarn, "Not found")
	delete(baseGameInstances, key[0])
	json.NewEncoder(res).Encode(&Response{"game to delete not found", 404})
}

// WorkerInfo function return some info about what's currently running on the worker
func WorkerInfo(res http.ResponseWriter, req *http.Request) {
	const fn = "WorkerInfo"

	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(&baseGameInstances)
	return
}

// GetPlayer return a ref to a Player in Game or nil
func GetPlayer(gameID string, playerID string) *Player {
	log.Println(prefixLog, "search for:", playerID)
	if selected, ok := baseGameInstances[gameID]; ok {
		for _, p := range selected.Players {
			p.Mutex.Lock()
			log.Println(prefixLog, "player:", p.ID)
			if p.ID == playerID {
				log.Println(prefixLog, "found player", p.Token, "energy", p.BotContext.Energy)
				p.Mutex.Unlock()
				return p
			}
			p.Mutex.Unlock()
		}
	}
	log.Println(prefixWarn, "couldn'payload find player")
	return nil
}

func tokenGenerator() string {
	b := make([]byte, 12)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

func CheckAvailability(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(req)
	bots := make([]Bot, 0)
	if _, ok := baseGameInstances[vars["id"]]; ok {
		//do something here
		for _, b := range baseGameInstances[vars["id"]].Env.Bots {
			bots = append(bots, b)
		}
		println("game exist, returning bots")
	}
	json.NewEncoder(w).Encode(bots)
	return
}
