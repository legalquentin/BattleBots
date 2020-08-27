package socket

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"../game"
	"github.com/gorilla/websocket"
)

// TODO: move this to the main package

// Local set to true to simulate robots and run the project without connexion to them
var Local = false

//  ============ UTILS ============

// WsAuth check if the get request sent to init a socket have correct params,
// if the game/player exist, if the user token is valid, and finally init a socket;
// return nil if an error happen
func WsAuth(res http.ResponseWriter, req *http.Request) (player *game.Player, conn *websocket.Conn) {
	var err *game.Response
	v := req.URL.Query()
	token := v.Get("token")
	gameID := v.Get("gameid")
	playerID := v.Get("playerid")

	fmt.Println(prefixLog, "start wsAuth", playerID)

	if len(token) == 0 || len(gameID) == 0 || len(playerID) == 0 {
		err = &game.Response{Message: "bad request", Code: 400}
		log.Println(prefixWarn, "bad request")
		res.Header().Set("Content-Type", "application/json")
		json.NewEncoder(res).Encode(err)
		return nil, nil
	}

	player = game.GetPlayer(gameID, playerID)
	if player == nil {
		err = &game.Response{Message: "player not found", Code: 404}
		log.Println(prefixWarn, "bad request")
		res.Header().Set("Content-Type", "application/json")
		json.NewEncoder(res).Encode(err)
		return nil, nil
	}

	if token != player.Token {
		log.Println(prefixWarn, "bad token")
		err = &game.Response{Message: "forbidden", Code: 403}
		res.Header().Set("Content-Type", "application/json")
		json.NewEncoder(res).Encode(err)
		return nil, nil
	}

	conn, errc := (&websocket.Upgrader{CheckOrigin: wsOriginAllowed}).Upgrade(res, req, nil)
	if errc != nil {
		log.Println(prefixErr, errc.Error())
		err = &game.Response{Message: errc.Error(), Code: 500}
	}
	if err != nil {
		log.Println(prefixErr, err)
	}

	fmt.Println(prefixLog, "wsAuth validated", player.ID)
	return player, conn
}

// allow cross origin for req
func wsOriginAllowed(req *http.Request) bool {
	return true
}
