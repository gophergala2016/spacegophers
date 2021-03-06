# Space Gophers

Space Gophers is an experiment in using Go routines and WebSockets to calculate complex physics and character/enemy movement server side. The Frontend is implemented with a basic [CreateJS](http://www.createjs.com/) canvas interface and does absolutely _no_ calculations other than managing objects in the canvas. It is entirely a server-side state object, rendered to the canvas.

Share your url with friends to allow them to join in! WASD to move and SPACE to fire!

## Getting Started
Navigate to the `src` folder within your `GOPATH` and then get the repo:

```bash
go get github.com/gophergala2016/spacegophers
```

Go into the spacegophers folder:
```bash
cd github.com/gophergala2016/spacegophers
```

And then set it up:
```bash
go build
```

Once that's done, you can run it:
```bash
./spacegophers -addr 127.0.0.1:8080
```

SpaceGophers accepts the following options:
```
Usage of ./spacegophers:
  -addr string
    	http service address (default ":8080")
  -v	enable verbose logging
```

## Attributions

Music sourced from http://www.newgrounds.com/audio/listen/106494.

## Bugs
* Need to implement a better system for animating the enemy gophers... updating too often right now so we don't get proper animation, disabled the enemy gophers' animations for now.
