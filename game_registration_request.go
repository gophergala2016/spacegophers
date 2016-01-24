package main

// GameRegistrationRequest contains the details for registering a User to a
// Game.
type GameRegistrationRequest struct {
	GameID string
	User   *User
}
