package main

import (
	"time"

	"github.com/apex/log"
)

// DefaultStateUpdateLoopInterval describes the default interval for which the
// server should be sending to it's users the current state of the game.
const DefaultStateUpdateLoopInterval = time.Second / DefaultUpdateFPS

// NewGameState creates a new game state given a logging context.
func NewGameState(ctx log.Interface) GameState {
	return GameState{
		Users:          make(map[*User]bool),
		Shots:          make(map[*Shot]bool),
		Log:            ctx.WithField("module", "GameState"),
		UpdateInterval: DefaultStateUpdateLoopInterval,
		simulate:       make(chan []Command),
		updateState:    make(chan *GameState),
	}
}

// GameState stores the state of the game at any given time.
type GameState struct {
	Users          map[*User]bool
	Shots          map[*Shot]bool
	Log            log.Interface
	UpdateInterval time.Duration

	simulate    chan []Command
	updateState chan *GameState
}

// Loop recieves commands from the CommandProcessor to simulate and also
// triggers the state update channel to update users connected to the game.
func (gs *GameState) Loop() {
	updateTimer := time.NewTicker(gs.UpdateInterval)

	for {
		select {
		case commands := <-gs.simulate:

			// if there are commands in the first place...
			if commands != nil {
				// then process them
				for _, command := range commands {
					if !command.User.Gopher.Alive {
						continue
					}

					if command.Message == "fire" {
						// if i can shoot...
						if !command.User.Gopher.NoShots {
							// shoot!
							shot := NewShot(command.User, command.User.Gopher)

							// add the shot
							gs.Shots[&shot] = true

							// mark that the gopher shot
							command.User.Gopher.Shoot()
						}

					} else {
						command.User.Gopher.Process(command)
					}
				}
			}

			for user := range gs.Users {
				user.Gopher.Simulate()

				if user.Gopher.NoShots {
					user.Gopher.MaybeShootAgain()
				}
			}

			for shot := range gs.Shots {
				if shot.IsAlive() {
					shot.Simulate()
					shot.Lifecycles--
				} else {
					delete(gs.Shots, shot)
				}
			}

			for user := range gs.Users {
				// if the gopher is still alive...
				if user.Gopher.Alive {
					// see if we just killed it
					bb := user.Gopher.BoundingBox()

					for shot := range gs.Shots {

						// we can't shoot ourselves...
						if shot.Gopher == user.ID {
							continue
						}

						// if we are hitting the shot
						if shot.Position.Inside(bb) {

							// kill the gopher
							user.Gopher.Kill()

							// award the points
							shot.User.Gopher.Points += pointsPerKill

							gs.Log.Infof("%d points awarded to Gopher %s", pointsPerKill, shot.User.Gopher.UserID)

							// kill the shot
							delete(gs.Shots, shot)

							// this gopher already died! can't kill it again!
							break
						}

					}

				} else {
					// otherwise, see if we can resurrect it
					user.Gopher.MaybeResurrect()
				}
			}

		case <-updateTimer.C:
			gs.updateState <- gs
		}
	}

}
