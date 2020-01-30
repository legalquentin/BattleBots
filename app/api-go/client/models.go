package client

import "github.com/gorilla/websocket"

// PlayerManager is our Client Manager instance
var PlayerManager = Manager{
	broadcast:  make(chan []byte),
	command:    make(chan Lo, 10000),
	register:   make(chan *Client),
	unregister: make(chan *Client),
	clients:    make(map[*Client]bool),
}

// Manager hold all connected clients and well, manage operations on them
type Manager struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	command    chan Lo
	register   chan *Client
	unregister chan *Client
}

// Client hold client id, his socket and a channel for him to send data
type Client struct {
	id     string
	robot  *websocket.Conn
	socket *websocket.Conn
	close  chan bool
	send   chan []byte
}

type Lo struct {
	Content string `json:"c,omitempty"`
	Press   bool   `json:"p,omitempty"`
}
