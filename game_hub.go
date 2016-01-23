package main

import "github.com/apex/log"

// NewGameHub creates a new GameHub for a given log contenxt.
func NewGameHub(ctx log.Interface) GameHub {
	return GameHub{
		Log:      ctx.WithField("module", "GameHub"),
		games:    make(map[string]Game),
		register: make(chan GameRegistrationRequest),
	}
}

// GameHub manages all games and users websocket connections.
type GameHub struct {
	// logging interface
	Log log.Interface

	// games stored based on the game id
	games map[string]Game

	// Register requests from the users.
	register chan GameRegistrationRequest
}

func (gh *GameHub) run() {
	gh.Log.Debug("running")

	for {
		select {
		case grr := <-gh.register:

			ctx := gh.Log.WithFields(log.Fields{
				"gameID": grr.GameID,
			})

			ctx.Debug("register")

			game, ok := gh.games[grr.GameID]

			// game not found, create it!
			if !ok {
				ctx.Debug("new game")

				game = NewGame(gh.Log, grr.GameID)

				// start the game!
				go game.Run()

				gh.games[grr.GameID] = game
			} else {
				ctx.Debug("existing game")
			}

			// register the user to the game
			game.register <- grr.User
		}
	}
}
