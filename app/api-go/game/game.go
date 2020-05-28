package game

// TODO: use game package as an handler for events in a game "win, loss, damage, energy, etc..."
// not as an api (it should go in the api package)

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"net/http"
	"strconv"
)

// CreateGame function need to be called once to setup everything
func CreateGame(res http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	decoder.DisallowUnknownFields()
	var t NewGameValidation
	err := decoder.Decode(&t)
	if err != nil || t.Name == "" || t.Token == "" {
		log.Println(prefixWarn, "Bad request")
		http.Error(res, "Bad Request", 400)
		return
	}

	id := strconv.Itoa(t.ID)
	log.Println(prefixLog, t.ID)
	if _, ok := baseGameInstances[id]; ok {
		log.Println(prefixWarn, "Game '"+t.Name+"' with id '"+id+"' already exist")
		http.Error(res, "Game already exist", 400)
		return
	}
	baseGameInstances[id] = Game{
		Name:      t.Name,
		Token:     t.Token,
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

// Daemon long running process to manage game instances
func Daemon() {
	for {
		tnow := time.Now()
		for key, game := range baseGameInstances {
			fmt.Println(key, len(game.Players), game.CreatedAt.Sub(tnow))
			for _, player := range game.Players {
				if player.BotSpecs.SocketClientCtrl != nil {
					// k := Data{Type: TYPE_ENERGY, Value: player.BotContext.Energy}
					// player.BotSpecs.SocketClientCtrl.WriteJSON(&k)
					// k = Data{Type: TYPE_OVERHEAT, Value: player.BotContext.Heat}
					// player.BotSpecs.SocketClientCtrl.WriteJSON(&k)
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
	var t JoinGameValidation
	err := decoder.Decode(&t)
	if err != nil || t.GameID == "" || t.PlayerID == "" {
		log.Println(prefixWarn, "Bad request")
		http.Error(res, "Bad Request", 400)
		return
	}
	var flag = false
	var p = Player{}
	if selected, ok := baseGameInstances[t.GameID]; ok {

		// if the player already exist return it
		for _, p := range selected.Players {
			if p.ID == t.PlayerID {
				res.Header().Set("Content-Type", "application/json")
				json.NewEncoder(res).Encode(selected)
				return
			}
		}
		for _, b := range selected.Env.Bots {
			if b.Taken == false {
				log.Println(prefixLog, "reserving a bot")
				// TODO: add a real token generation
				p = Player{t.PlayerID, tokenGenerator(), &b, Context{Moving: false, Energy: IntMutex{Mutex: &sync.Mutex{}, Value: 100}, Heat: IntMutex{Mutex: &sync.Mutex{}, Value: 0}}}
				b.Taken = true
				var g = baseGameInstances[t.GameID]
				g.Players = append(g.Players, p)
				baseGameInstances[t.GameID] = g
				res.Header().Set("Content-Type", "application/json")
				json.NewEncoder(res).Encode(&g)
				for _, b := range selected.Env.Bots {
					if b.Taken == false {
						// still one slot left, we don't start the game
						return
					}
				}
				// all slot taken, we start the game
				g = baseGameInstances[t.GameID]
				g.Started = true
				g.StartedAt = time.Now()
				baseGameInstances[t.GameID] = g
				return
			}
		}
		log.Println(prefixWarn, "All bots/slots are taken")
		http.Error(res, "All bots are taken", 400)
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
			log.Println(prefixLog, "player:", p.ID)
			if p.ID == playerID {
				p.BotContext.Energy.Mutex.Lock()
				log.Println(prefixLog, "found player", p.Token, "energy", p.BotContext.Energy.Value)
				p.BotContext.Energy.Mutex.Unlock()
				return &p
			}
		}
	}
	log.Println(prefixWarn, "couldn't find player")
	return nil
}

func tokenGenerator() string {
	b := make([]byte, 12)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}
