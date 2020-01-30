package handlers

import (
	"fmt"
	"net/http"

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
	fmt.Printf("Handled %s from [%s]\n", r.RequestURI, r.RemoteAddr)
	setupResponse(&w)
	if (*r).Method == "OPTIONS" {
		return
	}
	router.ServeHTTP(w, r)
}

func setupResponse(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
