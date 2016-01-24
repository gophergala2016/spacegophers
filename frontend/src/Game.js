import { EnemyGopher, UserGopher } from './Gophers';

let createjs = window.createjs;

export class Game extends Object {
  constructor() {
    super();
    this.count = 0;
    this.stage = new createjs.Stage('spaceGophers');
    this.manager = null;
    this.conn = null;
    this.gophersOnStage = [];
    this.state = {};
  }

  setUserId(userID) {
    this._userID = userID;
  }

  tick(event) {
    let gophers = this.state.gophers;
    let shots = this.state.shots;
    let u;
    let g;
    let r;

    // Update our User's gopher first
    for (u = gophers.length - 1; u >= 0; u--) {
      if (gophers[u].i === this._userID && this.gophersOnStage[u].update !== undefined) {
        this.gophersOnStage[u].update({
          x: gophers[u].p.x,
          y: gophers[u].p.y
        });
        break;
      }
    };

    // Loop through all of the gophers
    for (g = gophers.length - 1; g >= 0; g--) {
      let exists = null;

      // As long as they aren't our user gopher
      if (gophers[g].i !== this._userID) {
        // Loop through all the gophers on stage
        for (r = this.gophersOnStage.length - 1; r >= 0; r--) {
          // If they already exist on the stage
          if (gophers[g].i === this.gophersOnStage[r]._i) {
            exists = true;
            if (this.gophersOnStage[r].update !== undefined) {
              this.gophersOnStage[r].update({
                x: gophers[g].p.x,
                y: gophers[g].p.y
              });
            }
            break;

          } else {
            exists = false;
          }
        };
      }

      // Doesn't exist, let's add it to the stage and push
      // into our Gophers array
      if (exists === false) {
        let enemyGopher = new EnemyGopher({
          img: this.manager.enemyImg,
          i: gophers[g].i,
          x: gophers[g].p.x,
          y: gophers[g].p.y,
          radius: 15
        });

        this.storeGopher(enemyGopher);
        this.addGopherToStage(enemyGopher);
      }
    };

    this.stage.update();
  }

  storeGopher(gopher) {
    this.gophersOnStage.push(gopher);
  }

  addGopherToStage(gopher) {
    this.stage.addChild(gopher);
  }

  sendCommand(cmd) {
    this.conn.send(cmd);
  }

  InitStage(Manager, conn) {
    let userGopher = new UserGopher({
      img: Manager.userImg,
      i: this._userID,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: 15
    }, this.sendCommand.bind(this));

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener('tick', this.stage);
    createjs.Ticker.addEventListener('tick', (e) => {
      this.tick(e);
    });

    this.manager = Manager;
    this.conn = conn;
    this.storeGopher(userGopher);
    this.addGopherToStage(userGopher);
  }

  // updateGophers(newGophers) {
  //   let g;
  //   let r;

  //   for (g = newGophers.length - 1; g >= 0; g--) {
  //     let exists = null;

  //     // Only check for gopher existence if their ID doesn't match
  //     // our user's existing ID
  //     if (newGophers[g].i !== this._userID) {
  //       for (r = this.gophers.length - 1; r >= 0; r--) {
  //         // Check if this gopher has already been added to the stage
  //         if (newGophers[g].i === this.gophers[r]._i) {
  //           exists = true;
  //           if (this.gophers[r].update !== undefined) {
  //             this.gophers[r].update({
  //               x: newGophers[g].p.x,
  //               y: newGophers[g].p.y
  //             });
  //           }
  //           break;

  //         } else {
  //           exists = false;
  //         }
  //       };
  //     }

  //     // Doesn't exist, let's add it to the stage and push
  //     // into our Gophers array
  //     if (exists === false) {
  //       let enemyGopher = new EnemyGopher({
  //         img: this.manager.enemyImg,
  //         i: newGophers[g].i,
  //         x: newGophers[g].p.x,
  //         y: newGophers[g].p.y,
  //         radius: 15
  //       });

  //       this.storeGopher(enemyGopher);
  //       this.addGopherToStage(enemyGopher);
  //     } else {
  //       // update position of the user's gopher
  //       // if (this.gophers[g].update !== undefined) {
  //       //   this.gophers[g].update({
  //       //     x: newGophers[g].p.x,
  //       //     y: newGophers[g].p.y
  //       //   });
  //       // }
  //     }
  //   };
  // }

  UpdateStage(data) {
    this.state = data;
    // this.updateGophers(data.gophers);
  }
}
