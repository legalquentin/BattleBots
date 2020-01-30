package health

import (
	"encoding/json"
	"net/http"
)

// Check handler to check if worker is running
func Check(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(&Health{"hello", 200})
}
