package main

import (
	"math"
	"time"

	"github.com/xtgo/uuid"
)

const (
	// shot speed is the speed of the shot that is fired.
	shotSpeed = thrustAcceleration * timestep * 80

	// defaultShotLifetime is the lifetime (in sec) for each shot
	defaultShotLifetime = 1 * time.Second
	defaultLifeCycles   = defaultShotLifetime / DefaultPhysicsLoopInterval
)

// NewShot returns a new shot from a given Gopher. The location is set to the
// middle of the gopher and is fired at the speed of the gopher plus the shot's
// own speed in the direction of the angle of the Gopher.
func NewShot(u *User, g Gopher) Shot {
	posx := g.Position.X + math.Cos(g.Angle)*halfGopherSize
	posy := g.Position.Y + math.Sin(g.Angle)*halfGopherSize

	velx := g.Velocity.X + math.Cos(g.Angle)*shotSpeed
	vely := g.Velocity.Y + math.Sin(g.Angle)*shotSpeed

	return Shot{
		ID:         uuid.NewRandom().String(),
		Gopher:     g.UserID,
		User:       u,
		Entity:     NewEntity(thrustAcceleration, posx, posy, velx, vely, g.Angle),
		Lifecycles: int64(defaultLifeCycles),
	}
}

// Shot describes a projectile emmitted from a Gopher designed to destroy other
// Gopher's.
type Shot struct {
	ID         string `json:"i"`
	Gopher     string `json:"-"`
	User       *User  `json:"-"`
	Lifecycles int64  `json:"-"`
	Entity
}

// IsAlive will return true if the shot is still active.
func (s *Shot) IsAlive() bool {
	return s.Lifecycles > 0
}
