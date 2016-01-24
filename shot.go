package main

import (
	"math"
	"time"

	"github.com/xtgo/uuid"
)

const (
	// shot speed is the speed of the shot that is fired.
	shotSpeed = thrustAcceleration * timestep * 500

	// defaultShotLifetime is the lifetime (in sec) for each shot
	defaultShotLifetime = 1 * time.Second
	defaultLifeCycles   = defaultShotLifetime / DefaultPhysicsLoopInterval
)

func NewShot(g Gopher) Shot {
	posx := g.Position.X + halfGopherSize
	posy := g.Position.Y + halfGopherSize

	velx := g.Velocity.X + math.Cos(g.Angle)*shotSpeed
	vely := g.Velocity.Y + math.Sin(g.Angle)*shotSpeed

	return Shot{
		ID:         uuid.NewRandom().String(),
		Gopher:     g.UserID,
		Entity:     NewEntity(thrustAcceleration, posx, posy, velx, vely, g.Angle),
		Lifecycles: int64(defaultLifeCycles),
	}
}

type Shot struct {
	ID     string `json:"i"`
	Gopher string `json:"g"`
	Entity
	Lifecycles int64 `json:"-"`
}

func (s *Shot) IsAlive() bool {
	return s.Lifecycles > 0
}
