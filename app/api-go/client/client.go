package client

import (
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/websocket"
)

// Start client manager
func (PlayerManager *Manager) Start() {
	println("worker: starting sockets manager...")
	// Start a routine which handle register and unregister messages channel
	for {
		select {
		case conn := <-PlayerManager.register:
			PlayerManager.clients[conn] = true
			if jsonMessage, err := json.Marshal(&Lo{Content: "/A new socket has connected."}); err != nil {
				log.Println("[E]______(Manager)__Start__Marshal->register:", err)
			} else {
				go ConnectToBot(conn)
				PlayerManager.send(jsonMessage, conn)
			}
		case conn := <-PlayerManager.unregister:
			if _, ok := PlayerManager.clients[conn]; ok {
				conn.close <- true
				close(conn.send)
				delete(PlayerManager.clients, conn)
				if jsonMessage, err := json.Marshal(&Lo{Content: "/A socket has disconnected."}); err != nil {
					log.Println("[E]______(Manager)__Start__Marshal->unregister:", err)
				} else {
					PlayerManager.send(jsonMessage, conn)
				}
			}
		case message := <-PlayerManager.broadcast:
			for conn := range PlayerManager.clients {
				select {
				case conn.send <- message:
				default:
					close(conn.send)
					delete(PlayerManager.clients, conn)
				}
			}
		}
	}
}

func (PlayerManager *Manager) send(message []byte, ignore *Client) {
	for conn := range PlayerManager.clients {
		if conn != ignore {
			conn.send <- message
		}
	}
}

func (c *Client) read() {
	defer func() {
		PlayerManager.unregister <- c
		c.socket.Close()
	}()
	for {
		_, message, err := c.socket.ReadMessage()
		if err != nil {
			PlayerManager.unregister <- c
			c.socket.Close()
			break
		}

		dat := Lo{}
		if err := json.Unmarshal(message, &dat); err != nil {
			panic(err)
		}

		// if jsonMessage, err := json.Marshal(dat); err != nil {
		// 	log.Println("(client)____Marshal__err:", err)
		// 	log.Println(string(message))
		// } else {
		// log.Println("read___(client)->message:", string(message))
		// PlayerManager.broadcast <- jsonMessage
		// PlayerManager.broadcast <- jsonMessage
		PlayerManager.command <- dat
		// }
	}
}

func (c *Client) write() {
	defer func() {
		c.socket.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				c.socket.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			c.socket.WriteMessage(websocket.TextMessage, message)
		}
	}
}

// WsHandler :	connect to the socket page
func WsHandler(res http.ResponseWriter, req *http.Request) {
	conn, err := (&websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}).Upgrade(res, req, nil)
	if err != nil {
		log.Println("[E]_______WsHandler____Upgrader:", err)
		http.NotFound(res, req)
		return
	}
	// id, _ :=  uuid.NewV4()
	client := &Client{id: "1", socket: conn, send: make(chan []byte, 10000)}

	PlayerManager.register <- client

	go client.read()
	go client.write()
}

var addr = flag.String("addr", "192.168.1.66:8080", "http service address")

func ConnectToBot(ch *Client) {
	flag.Parse()
	log.SetFlags(0)

	// kill on os ctrl + c
	interrupt := make(chan os.Signal, 1)
	close := make(chan bool)
	// kill on close

	signal.Notify(interrupt, os.Interrupt)

	u := url.URL{Scheme: "ws", Host: *addr, Path: "/ctrl"}
	log.Println("ConnectToBot URL:", u.String())

	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("[E]______ConnectToBot__Dial:", err)
	}

	ch.robot = c
	ch.close = close
	defer c.Close()

	for {
		select {
		case message := <-PlayerManager.command:
			if jsonMessage, err := json.Marshal(&message); err != nil {
				log.Println("[E]______(Manager)__Start__Marshal->register:", err)
			} else {
				err := c.WriteMessage(websocket.TextMessage, []byte(jsonMessage))
				ch.send <- jsonMessage
				if err != nil {
					log.Println("[E]______ConnectToBot__WriteMessage:", err)
					return
				}
			}
		case <-interrupt:
			shutdownSocket(c)
			return
		case <-close:
			shutdownSocket(c)
			return
		}
	}
}

func shutdownSocket(c *websocket.Conn) {
	log.Println("interrupt")
	// Cleanly close the connection by sending a close message and then
	// waiting (with timeout) for the server to close the connection.
	err := c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
	if err != nil {
		log.Println("write close:", err)
		return
	}
	select {
	case <-time.After(time.Second):
	}
	return
}
