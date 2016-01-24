# Space Gophers

Space Gophers is an experiment in using Go routines to calculate complex physics and character/enemy movement server side which then pushes that state through WebSockets to the interface. The Frontend is implemented with a basic CreateJS canvas interface and does absolutely _no_ calculations other than adding/removing/updating objects in the canvas. It is entirely a server-side state object rendered to the canvas.

## Getting Started
```bash
go build
spacegophers -addr 127.0.0.1:8080
```

```
Usage of ./spacegophers:
  -addr string
    	http service address (default ":8080")
  -template string
    	template to serve for the game (default "index.html")
  -v	enable verbose logging
```
