package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"../game"

	"github.com/gorilla/mux"
)

// NewRouter to build mux router
func NewRouter() *mux.Router {

	router := mux.NewRouter().StrictSlash(true)
	for _, route := range Routes {
		router.HandleFunc(route.Pattern, route.HandlerFunc).Methods(route.Method).Name(route.Name)
	}

	return router
}

// PreProcessHandler called before handler calls
// use it to set cors headers, validation, and generic stuff..
func PreProcessHandler(w http.ResponseWriter, r *http.Request, router *mux.Router) {
	log.Println(prefixLog, r.RemoteAddr, r.RequestURI)
	setupResponse(&w)
	if (*r).Method == "OPTIONS" {
		return
	}

	for _, v := range Routes {
		if v.Pattern == r.RequestURI && v.secure {
			if strings.Split(r.RemoteAddr, ":")[0] != "127.0.0.1" {
				log.Println(prefixWarn, "invalid host triggering 'CreateGame'")
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(403)
				json.NewEncoder(w).Encode(game.Response{Message: "forbidden", Code: 403})
				return
			}

			rToken := r.Header.Get("x-api-key")
			if len(rToken) == 0 || rToken != game.WorkerCtx.Secret {
				log.Println(prefixWarn, "invalid token ["+rToken+"] secret is: ", game.WorkerCtx.Secret)
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(403)
				json.NewEncoder(w).Encode(&game.Response{Message: "forbidden", Code: 403})
				return
			}
		}
	}

	router.ServeHTTP(w, r)
}

func setupResponse(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
