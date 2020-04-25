package game

// TODO: use game package as an handler for events in a game "win, loss, damage, energy, etc..."
// not as an api (it should go in the api package)

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
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

	log.Println(prefixLog, t.ID)
	if _, ok := baseGameInstances[strconv.Itoa(t.ID)]; ok {
		log.Println(prefixWarn, "Game '"+t.Name+"' with id '"+strconv.Itoa(t.ID)+"' already exist")
		http.Error(res, "Game already exist", 400)
		return
	}
	var ref = &appartement
	baseGameInstances[strconv.Itoa(t.ID)] = Game{t.Name, t.Token, false, ref, nil}

	// baseGameInstances
	log.Println(prefixLog, "creating game...")
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(baseGameInstances[strconv.Itoa(t.ID)])
	return
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
	decoder := json.NewDecoder(req.Body)
	var t DeleteGameValidation
	err := decoder.Decode(&t)
	if err != nil {
		res.Header().Set("Content-Type", "application/json")
		log.Println(prefixWarn, "Bad request")
		json.NewEncoder(res).Encode(&Response{"invalid payload", 400})
		return
	}

	delete(baseGameInstances, strconv.Itoa(t.id))
	// TODO: remove ressources created by the game, close player sockets etc..

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
