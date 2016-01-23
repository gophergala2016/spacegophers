package main

import (
	"flag"
	"os"

	"github.com/apex/log"
	"github.com/apex/log/handlers/json"
	"github.com/apex/log/handlers/multi"
	"github.com/apex/log/handlers/text"
)

var addr = flag.String("addr", ":8080", "http service address")
var verbose = flag.Bool("v", false, "enable verbose logging")

func main() {
	flag.Parse()

	f, err := os.Create("log/spacegophers.json")
	if err != nil {
		log.Fatal(err.Error())
	}
	defer f.Close()

	log.SetHandler(multi.New(text.New(os.Stderr), json.New(f)))
	// log.SetHandler(json.New(os.Stderr))

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
