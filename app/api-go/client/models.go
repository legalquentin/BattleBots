package client

// Key is the payload fmt send from client when pressing a key
type Key struct {
	Content string `json:"c,omitempty"`
	Press   bool   `json:"p,omitempty"`
}

// Data hold info about game you can have things such as:
// energy charge at 20 ex: (dt:'e', dv:'20')
// overheat at 50 (dt:'e', dv:'ov')
type Data struct {
	Content int16 `json:"dt,omitempty"`
	Type    int16 `json:"dv,omitempty"`
}
