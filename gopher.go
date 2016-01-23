package main

import (
	"image"
	"math"

	"github.com/apex/log"
)

const (
	gopherSize     = 30
	halfGopherSize = gopherSize / 2

	// timestep is the time step for a simulation event
	timestep     = 15
	halfTimestep = timestep / 2.0

	// thrustAcceleration is a unit of px/s^2
	thrustAcceleration = 0.001
	thrustStep         = timestep * thrustAcceleration
	angleThrust        = math.Pi / 32.0
	angleStep          = timestep * angleThrust
)

func NewGopher(userID string, startingPosition Coordinates) Gopher {
	return Gopher{
		UserID:   userID,
		Position: startingPosition,
		State:    true,
		// BoundingBox: image.Rect(startingPosition.X-halfGopherSize, startingPosition.Y-halfGopherSize, startingPosition.X+halfGopherSize, startingPosition.Y-halfGopherSize),
	}
}

type Coordinates struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type Gopher struct {
	UserID      string          `json:"i"`
	Position    Coordinates     `json:"p"`
	Velocity    Coordinates     `json:"v"`
	Angle       float64         `json:"a"`
	State       bool            `json:"s"`
	BoundingBox image.Rectangle `json:"-"`
	Updates     struct {
		Forward, Backward, Left, Right bool
	} `json:"-"`
}

func (g *Gopher) Process(command Command) {
	log.Debug(command.Message)
	switch command.Message {
	case "left":
		g.Updates.Left = true
	case "right":
		g.Updates.Right = true
	case "up":
		g.Updates.Forward = true
	case "down":
		g.Updates.Backward = true
	}
}

func (g *Gopher) Simulate() {
	var angleNot = g.Angle
	var velocityNot = g.Velocity

	if g.Updates.Left != g.Updates.Right {
		if g.Updates.Left {
			g.Angle += angleStep
			g.Updates.Left = false
		} else {
			g.Angle -= angleStep
			g.Updates.Right = false
		}
	} else {
		g.Updates.Left = false
		g.Updates.Right = false
	}

	if g.Updates.Forward != g.Updates.Backward {
		if g.Updates.Forward {
			g.Velocity.X += thrustStep * math.Cos(angleNot)
			g.Velocity.Y += thrustStep * math.Sin(angleNot)
			g.Updates.Forward = false
		} else {
			g.Velocity.X -= thrustStep * math.Cos(angleNot)
			g.Velocity.Y -= thrustStep * math.Sin(angleNot)
			g.Updates.Backward = false
		}
	} else {
		g.Updates.Forward = false
		g.Updates.Backward = false
	}

	g.Position.X += halfTimestep * (velocityNot.X + g.Velocity.X)
	g.Position.Y += halfTimestep * (velocityNot.Y + g.Velocity.Y)
}
