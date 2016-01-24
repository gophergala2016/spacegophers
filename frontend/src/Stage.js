import { BaseGopher, UserGopher } from './Gophers';

let createjs = window.createjs;

export class Stage extends Object {
  constructor() {
    super();
    this.count = 0;
    this.stage = new createjs.Stage('spaceGophers');
    this.gophers = [];
  }

  tick(event) {
    // if (this.count < 10) {
    //   this.count++;
    //   console.log('tick')
    // }
    // for (i = gophers.length - 1; i >= 0; i--) {
    //   gophers[i].update({
    //     x: 5,
    //     y: 7
    //   });
    // };

    this.stage.update();
  }

  storeGopher(gopher) {
    this.gophers.push(gopher);
  }

  addGopherToStage(gopher) {
    this.stage.addChild(gopher);
  }

  CreateUser(id) {
    let gopher = new UserGopher({
      color: '#ff0',
      i: id,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: 15
    });

    this.storeGopher(gopher);
    this.addGopherToStage(gopher);
  }

  InitStage() {
    createjs.Ticker.setFPS(5);
    createjs.Ticker.addEventListener('tick', this.stage);
    createjs.Ticker.addEventListener('tick', (e) => {
      this.tick(e);
    });
  }

  UpdateStage(GameState) {
    let s;
    let r;
    console.log('------------------ Updating Stage ---------------');
    console.log(this.gophers);
    for (s = GameState._gophers.length - 1; s >= 0; s--) {
      let exists = null;

      // Only check for gopher existence if their ID doesn't match
      // our user's existing ID
      if (GameState._gophers[s].i !== GameState._userID) {
        console.log('dealing with a non-user gopher');
        for (r = this.gophers.length - 1; r >= 0; r--) {
          // Check if this gopher has already been added to the stage
          if (GameState._gophers[s].i === this.gophers[r]._i) {
            console.log('exists');
            exists = true;
            break;
          } else {
            exists = false;
          }
        };
      }

      // Doesn't exist, let's add it to the stage and push
      // into our Gophers array
      if (exists === false) {
        console.log('ghost, adding gopher to stage');
        let gopher = new BaseGopher({
          color: '#f00',
          i: GameState._gophers[s].i,
          x: GameState._gophers[s].x,
          y: GameState._gophers[s].y,
          radius: 15
        });

        this.storeGopher(gopher);
        this.addGopherToStage(gopher);
      }
    };
    if (this.count < 10) {
      this.count++;
      console.log('tick', GameState);
    }
  }
}
