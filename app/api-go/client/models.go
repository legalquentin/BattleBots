package client

// Key is the payload fmt send from client when pressing a key
type Key struct {
	Content string `json:"c,omitempty"`
	Press   bool   `json:"p,omitempty"`
}
