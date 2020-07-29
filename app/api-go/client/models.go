package client

// Key is the payload fmt send from client when pressing a key
type Key struct {
	Content string `json:"c,omitempty"`
	Press   bool   `json:"p,omitempty"`
}

// KeyMapStruct help convert int to var name
type KeyMapStruct struct {
	KEY_LEFT     int8
	KEY_UP       int8
	KEY_RIGHT    int8
	KEY_DOWN     int8
	KEY_SPACEBAR int8
}
