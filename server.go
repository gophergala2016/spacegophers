package main

import (
	"encoding/json"
	"html/template"
	"net/http"

	"github.com/apex/log"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// NewServer sets up a new server instance.
func NewServer(ctx log.Interface, address, templateFilename string) Server {
	return Server{
		Log: ctx.WithFields(log.Fields{
			"module":  "Server",
			"address": address,
		}),
		IndexTemplate: template.Must(template.ParseFiles(templateFilename)),
		Address:       address,
		Hub:           NewGameHub(ctx),
	}
}

// Server contains the entire application bundle and will start the necessary
// components to serve up resources needed to execute the game.
type Server struct {
	Address       string
	IndexTemplate *template.Template
	Log           log.Interface
	Hub           GameHub
}

// HandleWS handles the ws server upgrading.
func (s *Server) HandleWS(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	gameID := vars["gameID"]

	ctx := s.Log.WithFields(log.Fields{
		"path":    r.URL.Path,
		"method":  r.Method,
		"handler": "HandleWS",
		"gameID":  gameID,
	})

	ctx.Info("request")

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		ctx.Error(err.Error())
		return
	}

	ctx.Debug("upgraded")

	user := NewUser(log.WithField("gameID", gameID), ws)

	// pass off the new user to the game hub
	s.Hub.register <- GameRegistrationRequest{
		GameID: gameID,
		User:   &user,
	}

	ctx.Debug("registered")
}

// HandleHTTP handles the http calls at the root for anything really.
func (s *Server) HandleHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := s.Log.WithFields(log.Fields{
		"path":    r.URL.Path,
		"method":  r.Method,
		"handler": "HandleHTTP",
	})

	ctx.Info("request")

	if r.URL.Path == "/" {

		if r.Method == "GET" {

			// serve the index file here..
			w.Header().Set("Content-Type", "text/html")
			s.IndexTemplate.Execute(w, r.Host)
			return

		} else if r.Method == "POST" {

			payload := map[string]string{
				"id": NewGameID(),
			}

			w.Header().Set("Content-Type", "application/json")
			if err := json.NewEncoder(w).Encode(payload); err != nil {
				ctx.Error(err.Error())
			}
			return
		}

		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	http.Error(w, "not found", http.StatusNotFound)
	return
}

// Serve sets up the components necessary to run games.
func (s *Server) Serve() {
	r := mux.NewRouter()

	// handle the http + ws servers
	r.HandleFunc("/", s.HandleHTTP)
	r.HandleFunc("/{gameID}/ws", s.HandleWS)

	// handle all other static files
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	// bind the router to the default http handler
	http.Handle("/", r)

	s.Log.Info("listening")

	// start up the hub
	go s.Hub.run()

	if err := http.ListenAndServe(s.Address, nil); err != nil {
		s.Log.Fatalf("ListenAndServe: %s", err.Error())
	}
}
