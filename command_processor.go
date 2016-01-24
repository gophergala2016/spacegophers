package main

import (
	"time"

	"github.com/apex/log"
)

const (
	// DefaultPhysicsLoopInterval is the default interval for which physics
	// computations will occur.
	DefaultPhysicsLoopInterval = DefaultStateUpdateLoopInterval / 10.0

	// DefaultCommandSizeBuffer is the default size of the buffer which holds
	// commands.
	DefaultCommandSizeBuffer = 200
)

// NewCommandProcessor creates a new CommandProcessor with all the defaults set
// up.
func NewCommandProcessor(gs *GameState) CommandProcessor {
	return CommandProcessor{
		Log:         gs.Log.WithField("module", "CommandProcessor"),
		Interval:    DefaultPhysicsLoopInterval,
		BufferSize:  DefaultCommandSizeBuffer,
		State:       gs,
		shutdown:    make(chan struct{}),
		quit:        make(chan struct{}),
		queue:       make(chan Command, DefaultCommandSizeBuffer),
		queueBuffer: make([]Command, 0, DefaultCommandSizeBuffer),
	}
}

// CommandProcessor recieves the commands via the new command channel and sends
// them off to the game state for simulation and transmission.
type CommandProcessor struct {
	Log        log.Interface
	Interval   time.Duration
	BufferSize int
	State      *GameState

	shutdown    chan struct{}
	quit        chan struct{}
	queue       chan Command
	queueBuffer []Command
	queueSize   int
}

// Add inserts a single command directly into the buffer.
func (c *CommandProcessor) Add(command Command) {
	c.Log.Debug("add")

	// capture the command
	c.queueBuffer = append(c.queueBuffer, command)

	// increate the queue size
	c.queueSize++
}

// Flush empties the command processors queue into the game state for simulation
// and then clears out the queue.
func (c *CommandProcessor) Flush() {
	c.Log.Debug("flush")

	// simulate the state
	c.State.simulate <- c.queueBuffer

	// flush out the buffer
	c.queueBuffer = nil

	// set the queue size to zero
	c.queueSize = 0
}

// Loop processes incomming commands and handles them.
func (c *CommandProcessor) Loop() {
	tick := time.NewTicker(c.Interval)

	for {

		select {
		case command := <-c.queue:
			c.Log.Debug("new command")

			// add the command to the buffer
			c.Add(command)

			// if we are at the queue size
			if c.queueSize >= c.BufferSize {
				// flush out the queue
				c.Flush()
			}

		case <-tick.C:
			// if there is state to simulate...
			if c.queueSize > 0 {
				// then flush it!
				c.Flush()
			}

			c.State.simulate <- nil

		case <-c.quit:
			c.Log.Debug("quit")

			// stop the ticker
			tick.Stop()

			// eat through the rest of the channel if there is anything in it...
			for command := range c.queue {
				c.Add(command)
			}

			// if there is state to simulate...
			if c.queueSize > 0 {
				// then flush it!
				c.Flush()
			}

			// send the shutdown signal
			c.shutdown <- struct{}{}

			// leave the Loop
			return
		}

	}

}

// Queue adds the command to the command processors queue.
func (c *CommandProcessor) Queue(command Command) {
	c.Log.Debug("queue")
	c.queue <- command
}

// Close stops the processor's loop.
func (c *CommandProcessor) Close() {
	c.Log.Debug("close")
	c.quit <- struct{}{}
	close(c.queue)
	<-c.shutdown
}
