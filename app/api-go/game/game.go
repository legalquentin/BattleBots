package game

// TODO: use game package as an handler for events in a game "win, loss, damage, energy, etc..."
// not as an api (it should go in the api package)

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
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
		for key, game := range baseGameInstances {
			fmt.Println("GameID:", key, "=>", "Players:", len(game.Players))
		}
		fmt.Println("#####################")
		time.Sleep(time.Second * 2)
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
				json.NewEncoder(res).Encode(&p)
				return
			}
		}
		for _, b := range selected.Env.Bots {
			if b.Taken == false {
				log.Println(prefixLog, "reserving a bot")
				// TODO: add a real token generation
				p = Player{t.PlayerID, tokenGenerator(), &b, Context{false, 100, 0}}
				b.Taken = true
				var g = baseGameInstances[t.GameID]
				g.Players = append(g.Players, p)
				baseGameInstances[t.GameID] = g
				res.Header().Set("Content-Type", "application/json")
				json.NewEncoder(res).Encode(&p)
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
	if selected, ok := baseGameInstances[gameID]; ok {
		for _, p := range selected.Players {
			if p.ID == playerID {
				return &p
			}
		}
	}
	return nil
}

func tokenGenerator() string {
	b := make([]byte, 12)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}
