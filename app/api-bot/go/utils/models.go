package utils

// Key represent  the event received in a socket when a player press/release a key
type Key struct {
	Content int  `json:"c,omitempty"`
	Press   bool `json:"p,omitempty"`
}

// FunctionMap define which input correspond to which function
type FunctionMap struct {
	KeyStr string
	Fn     func()
}
