package main

// NewCommand creates a new command from a user.
func NewCommand(u *User, message string) Command {
	return Command{
		User:    u,
		Message: message,
	}
}

// Command represents the instruction given by a user during game play.
type Command struct {
	User    *User
	Message string
}
