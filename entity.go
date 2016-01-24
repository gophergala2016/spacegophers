package main

import (
	"math"
	"math/rand"
	"time"
)

var r *rand.Rand

func init() {
	r = rand.New(rand.NewSource(time.Now().UnixNano()))
}

// RandomCoordinates returns a set of corrdinates binded by the factor provided.
func RandomCoordinates(factor float64) Coordinates {
	return Coordinates{
		X: r.Float64() * factor,
		Y: r.Float64() * factor,
	}
}

// RandomAngle returns a angle randomly.
func RandomAngle() float64 {
	return r.Float64() * 2 * math.Pi
}

// BoundingBox describes a box that contains a top left and a top right point.
type BoundingBox struct {
	Max, Min Coordinates
}

// Coordinates stores float64 x, y data.
type Coordinates struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

// Inside returns true if the coordinate is within the bounding box.
func (c *Coordinates) Inside(r BoundingBox) bool {
	return c.X >= r.Min.X && c.X <= r.Max.X && c.Y >= r.Min.Y && c.Y <= r.Max.Y
}

// NewEntity creates a new entity that moves with a given thrust.
func NewEntity(thrust, posx, posy, velx, vely, angle float64) Entity {
	return Entity{
		Position: Coordinates{
			X: posx,
			Y: posy,
		},
		Velocity: Coordinates{
			X: velx,
			Y: vely,
		},
		Angle:  angle,
		thrust: thrust,
	}
}

// Entity represents a component that moves around the screen
type Entity struct {
	Position Coordinates `json:"p"`
	Velocity Coordinates `json:"v"`
	Angle    float64     `json:"a"`
	Updates  struct {
		Forward, Backward, Left, Right bool
	} `json:"-"`
	Size   float64 `json:"-"`
	thrust float64
}

// Process takes a command and flips the flag.
func (e *Entity) Process(command Command) {
	switch command.Message {
	case "left":
		e.Updates.Left = true
	case "right":
		e.Updates.Right = true
	case "up":
		e.Updates.Forward = true
	case "down":
		e.Updates.Backward = true
	}
}

// Simulate executes the simulation steps in order to move the entity to it's
// new location and apply any pending updates/changes.
func (e *Entity) Simulate() {
	var angleNot = e.Angle
	var velocityNot = e.Velocity

	// apply YAW
	if e.Updates.Left != e.Updates.Right {
		if e.Updates.Left {
			e.Angle -= angleStep
			e.Updates.Left = false
		} else {
			e.Angle += angleStep
			e.Updates.Right = false
		}
	} else {
		e.Updates.Left = false
		e.Updates.Right = false
	}

	// apply THRUST
	if e.Updates.Forward != e.Updates.Backward {
		if e.Updates.Forward {
			e.Velocity.X += e.thrust * math.Cos(angleNot)
			e.Velocity.Y += e.thrust * math.Sin(angleNot)
			e.Updates.Forward = false
		} else {
			e.Velocity.X -= e.thrust * math.Cos(angleNot)
			e.Velocity.Y -= e.thrust * math.Sin(angleNot)
			e.Updates.Backward = false
		}
	} else {
		e.Updates.Forward = false
		e.Updates.Backward = false
	}

	// update POSITION
	e.Position.X += halfTimestep * (velocityNot.X + e.Velocity.X)
	e.Position.Y += halfTimestep * (velocityNot.Y + e.Velocity.Y)
}
