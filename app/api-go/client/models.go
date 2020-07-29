package client

// Key is the payload fmt send from client when pressing a key
type Key struct {
	Content int  `json:"c,omitempty"`
	Press   bool `json:"p,omitempty"`
}

// KeyMapStruct help convert int to var name
type KeyMapStruct struct {
	KEY_LEFT     int
	KEY_UP       int
	KEY_RIGHT    int
	KEY_DOWN     int
	KEY_SPACEBAR int
}
