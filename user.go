package main

import (
	"time"

	"github.com/apex/log"
	"github.com/gorilla/websocket"
	"github.com/xtgo/uuid"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 5 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 1 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

// NewUser creates a new user with a new Gopher to manage the user's new ws
// connection.
func NewUser(ctx log.Interface, ws *websocket.Conn) User {
	id := uuid.NewRandom().String()

	return User{
		ID:     id,
		Gopher: NewGopher(id, RandomCoordinates(boardSize)),
		Log:    ctx.WithField("module", "User"),
		send:   make(chan []byte, 256),
		ws:     ws,
	}
}

// User contains all the details that a user needs to play!
type User struct {
	ID     string
	Log    log.Interface
	Gopher Gopher
	g      *Game
	ws     *websocket.Conn
	send   chan []byte // Buffered channel of outbound messages.
}

// readPump pumps messages from the websocket connection to the hub.
func (u *User) readPump() {
	defer func() {
		u.g.unregister <- u
		u.ws.Close()
	}()

	u.ws.SetReadLimit(maxMessageSize)
	u.ws.SetReadDeadline(time.Now().Add(pongWait))
	u.ws.SetPongHandler(func(string) error {
		u.ws.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, message, err := u.ws.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				// TODO: do something??
			}

			u.Log.Error(err.Error())

			return
		}

		u.Log.WithField("content", string(message)).Debug("new message")

		c := NewCommand(u, string(message))

		u.g.commands <- c
	}
}

// write writes a message with the given message type and payload.
func (u *User) write(mt int, payload []byte) error {
	u.ws.SetWriteDeadline(time.Now().Add(writeWait))
	return u.ws.WriteMessage(mt, payload)
}

// writePump pumps messages from the hub to the websocket connection.
func (u *User) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		u.ws.Close()
	}()

	for {
		select {
		case message, ok := <-u.send:
			if !ok {
				u.Log.Debug("send channel closed")
				u.write(websocket.CloseMessage, []byte{})
				return
			}

			if err := u.write(websocket.TextMessage, message); err != nil {
				u.Log.WithError(err).Debug("can't write message to ws")
				return
			}
		case <-ticker.C:
			if err := u.write(websocket.PingMessage, []byte{}); err != nil {
				u.Log.WithError(err).Debug("can't write ping to ws")
				return
			}
		}
	}
}

func (u *User) run() {
	go u.writePump()
	u.readPump()
}
