package main

import (
	"flag"
	"os"

	"github.com/apex/log"
	"github.com/apex/log/handlers/text"
)

var addr = flag.String("addr", ":8080", "http service address")
var verbose = flag.Bool("v", false, "enable verbose logging")

func main() {
	flag.Parse()

	log.SetHandler(text.New(os.Stderr))

	if *verbose {
		log.SetLevel(log.DebugLevel)
	} else {
		log.SetLevel(log.InfoLevel)
	}

	ctx := log.WithFields(log.Fields{
		"app": "spacegophers",
	})

	s := NewServer(ctx, *addr)

	// serve the server
	s.Serve()
}
