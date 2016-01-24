package main

import "time"

const (
	halfGopherSize = DefaultGopherSize / 2

	// timestep is the time step for a simulation event
	timestep     = float64(DefaultPhysicsLoopInterval) / float64(time.Millisecond)
	halfTimestep = timestep / 2.0

	// thrustAcceleration is a unit of px/s^2
	thrustAcceleration = 0.0001
	thrustStep         = timestep * thrustAcceleration
	angleThrust        = 0.015
	angleStep          = timestep * angleThrust

	// a gopher is dead for 5 seconds
	deadTimeout = 5 * time.Second / DefaultPhysicsLoopInterval

	boardSize = 5000
)

// NewGopher creates a Gopher for a new player.
func NewGopher(userID string, pos Coordinates) Gopher {
	angle := RandomAngle()

	return Gopher{
		UserID: userID,
		Alive:  true,
		Entity: NewEntity(thrustStep, pos.X, pos.Y, 0, 0, angle),
	}
}

// Gopher stores the players details.
type Gopher struct {
	UserID string `json:"i"`
	Entity
	Alive   bool   `json:"s"`
	DeadFor uint64 `json:"-"`
}

// Kill marks the gopher as dead, and sets a timeout on it.
func (g *Gopher) Kill() {
	g.Alive = false
	g.DeadFor = uint64(deadTimeout)
}

// MaybeResurrect will decrement the dead lifecycle count and if it is zero, it
// will mark the Gopher as alive.
func (g *Gopher) MaybeResurrect() {
	g.DeadFor--

	if g.DeadFor <= 0 {
		g.Alive = true
	}
}

// BoundingBox returns the BoundingBox of the Gopher.
func (g *Gopher) BoundingBox() BoundingBox {
	return BoundingBox{
		Min: Coordinates{
			X: g.Position.X,
			Y: g.Position.Y,
		},
		Max: Coordinates{
			X: g.Position.X + DefaultGopherSize,
			Y: g.Position.Y + DefaultGopherSize,
		},
	}
}
