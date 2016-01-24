package main

import (
	"math"
	"math/rand"
	"time"
)

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

var r *rand.Rand

func init() {
	r = rand.New(rand.NewSource(time.Now().UnixNano()))
}

func RandomCoordinates(factor float64) Coordinates {
	return Coordinates{
		X: r.Float64() * factor,
		Y: r.Float64() * factor,
	}
}

func RandomAngle() float64 {
	return r.Float64() * 2 * math.Pi
}

// NewGopher creates a Gopher for a new player.
func NewGopher(userID string, startingPosition Coordinates) Gopher {
	pos := RandomCoordinates(boardSize)
	angle := RandomAngle()

	return Gopher{
		UserID: userID,
		Alive:  true,
		Entity: NewEntity(thrustStep, pos.X, pos.Y, 0, 0, angle),
	}
}

// ByUserID implements sort.Interface for []Gopher based on
// the ID field.
type ByUserID []Gopher

func (a ByUserID) Len() int           { return len(a) }
func (a ByUserID) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByUserID) Less(i, j int) bool { return a[i].UserID < a[j].UserID }

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

func (g *Gopher) MaybeResurrect() {
	g.DeadFor--

	if g.DeadFor <= 0 {
		g.Alive = true
	}
}

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
