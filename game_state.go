package main

import (
	"time"

	"github.com/apex/log"
)

// DefaultStateUpdateLoopInterval describes the default interval for which the
// server should be sending to it's users the current state of the game.
const DefaultStateUpdateLoopInterval = time.Millisecond * 45

func NewGameState(ctx log.Interface) GameState {
	return GameState{
		Users:          make(map[*User]bool),
		Log:            ctx.WithField("module", "GameState"),
		UpdateInterval: DefaultStateUpdateLoopInterval,
		simulate:       make(chan []Command),
		updateState:    make(chan *GameState),
	}
}

// GameState stores the state of the game at any given time.
type GameState struct {
	Users          map[*User]bool
	Log            log.Interface
	UpdateInterval time.Duration

	simulate    chan []Command
	updateState chan *GameState
}

func (gs *GameState) Loop() {
	updateTimer := time.NewTicker(gs.UpdateInterval)

	for {
		select {
		case commands := <-gs.simulate:

			// if there are commands in the first place...
			if commands != nil {
				// then process them
				for _, command := range commands {
					command.User.Gopher.Process(command)
				}
			}

			for user := range gs.Users {
				user.Gopher.Simulate()
			}

		case <-updateTimer.C:
			gs.updateState <- gs
		}
	}

}
