package main

import "time"

const (
	halfGopherSize = DefaultGopherSize / 2

	// timestep is the time step for a simulation event
	timestep     = float64(DefaultPhysicsLoopInterval) / float64(time.Millisecond)
	halfTimestep = timestep / 2.0

	// thrustAcceleration is a unit of px/s^2
	thrustAcceleration = 0.001
	thrustStep         = timestep * thrustAcceleration
	angleThrust        = 0.03
	angleStep          = timestep * angleThrust

	// a gopher is dead for 5 seconds
	deadTimeout = 5 * time.Second / DefaultPhysicsLoopInterval

	shotTimeout = 200 * time.Millisecond / DefaultPhysicsLoopInterval

	pointsPerKill = 100
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

// ByScore implements sort.Interface for []Gopher based on
// the ID field.
type ByScore []Gopher

func (a ByScore) Len() int      { return len(a) }
func (a ByScore) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a ByScore) Less(i, j int) bool {
	if a[i].Points == a[j].Points {
		return a[i].UserID < a[j].UserID
	}

	return a[i].Points > a[j].Points
}

// Gopher stores the players details.
type Gopher struct {
	UserID string `json:"i"`
	Entity
	Alive   bool   `json:"s"`
	Points  uint64 `json:"t"`
	DeadFor uint64 `json:"-"`

	NoShots    bool   `json:"ns"`
	NoShotsFor uint64 `json:"-"`
}

// Shoot starts a timer for the the shots, and ensures that no shots can be sent
// until the timeout is reached again.
func (g *Gopher) Shoot() {
	g.NoShots = true
	g.NoShotsFor = uint64(shotTimeout)
}

// MaybeShootAgain decrements the timer for the no shoot timeout and if it's 0,
// sets it to false.
func (g *Gopher) MaybeShootAgain() {
	g.NoShotsFor--

	if g.NoShotsFor <= 0 {
		g.NoShots = false
	}
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
			X: g.Position.X - halfGopherSize,
			Y: g.Position.Y - halfGopherSize,
		},
		Max: Coordinates{
			X: g.Position.X + halfGopherSize,
			Y: g.Position.Y + halfGopherSize,
		},
	}
}
