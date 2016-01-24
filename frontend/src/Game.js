import { EnemyGopher, UserGopher } from './Gophers';
import { Shot } from './Shot';

let createjs = window.createjs;

export class Game extends Object {
  constructor() {
    super();
    this.count = 0;
    this.stage = new createjs.Stage('spaceGophers');
    this.manager = null;
    this.conn = null;
    this.gophersOnStage = [];
    this.shotsOnStage = [];
    this.state = {};
  }

  setUserId(userID) {
    this._userID = userID;
  }

  createShot(shot) {
    let s = new Shot({
      img: this.manager.shot,
      a: shot.a,
      i: shot.i,
      x: shot.p.x,
      y: shot.p.y,
    });

    this.storeProjectile(s);
    this.addProjectileToStage(s);
  }

  updateShots(shots) {
    let shotIDs = [];
    let oldShotIDs = [];
    let s;

    // Only do this if we have shots
    if (shots.length) {
      // Grab all of our shot IDs
      for (s = shots.length - 1; s >= 0; s--) {
        shotIDs.push(shots[s].i);
      };

      // Grab all of our shotsOnStage IDs
      for (s = this.shotsOnStage.length - 1; s >= 0; s--) {
        oldShotIDs.push(this.shotsOnStage[s]._i);
      };

      if (this.shotsOnStage.length > 0) {
        // Find our existing shots that match the new set
        // of IDs, and update their position
        for (s = this.shotsOnStage.length - 1; s >= 0; s--){
          // console.log('ids before exist: ', shotIDs[s], this.shotsOnStage[s]._i);
          if (shotIDs[s] === this.shotsOnStage[s]._i) {
            // Exists in both, so update and remove id
            // from our arrays
            shotIDs.splice(s, 1);
            oldShotIDs.splice(s, 1);
            if (this.count < 100) {
              // console.log('ids after exist: ', shotIDs, oldShotIDs);
            }
            if (this.shotsOnStage[s].update !== undefined) {
              this.shotsOnStage[s].update({
                a: shots[s].a,
                x: shots[s].p.x,
                y: shots[s].p.y
              });
            }
            break;
          }
        }

        // These are new shot IDs
        for (s = shotIDs.length - 1; s >= 0; s--) {
          this.createShot(shots[s])
        };

        // These are expired shot IDs
        for (s = oldShotIDs - 1; s >= 0; s--) {
          this.removeChildFromStage(this.shotsOnStage[s]);
        };

      } else {
        // No shots on stage, so create any we've been pushed
        for (s = shots.length - 1; s >= 0; s--) {
          this.createShot(shots[s])
        }
      }
    } else {
      // Cleanup stage because there's no shots from our
      // updated state
      for (s = this.shotsOnStage.length - 1; s >= 0; s--) {
        this.removeChildFromStage(this.shotsOnStage[s]);
      };
    }



      // // Check if our shot already exists
      // let shotExists = this.shotsOnStage.some(function (el) {
      //   return el._i === shots[s].i;
      // });

      // if (shotExists) {
      //   console.log('exists');
      //   this.shotsOnStage[s].update({
      //     a: shots[s].a,
      //     x: shots[s].p.x,
      //     y: shots[s].p.y
      //   });
      //   shots.splice(s, 1);
      //   break;
      // }

    // for (s = shots.length - 1; s >= 0; s--) {
    //   let exists = null;
    //   if (this.shotsOnStage.length > 0) {
    //     for (sInner = this.shotsOnStage.length - 1; sInner >= 0; sInner--) {
    //       // If our shot exists in data and on stage, update it
    //       if (shots[s].i === this.shotsOnStage[sInner]._i) {
    //         exists = true;
    //         if (this.shotsOnStage[sInner].update !== undefined) {
    //           this.shotsOnStage[sInner].update({
    //             a: shots[s].a,
    //             x: shots[s].p.x,
    //             y: shots[s].p.y
    //           });
    //         }
    //         break;
    //       }
    //     };
    //   } else {
    //     // We don't have any projectiles on the screen, but
    //     // a shot has been fired because shots.length isn't 0
    //     exists = false;
    //   }

      // Doesn't exist, let's add it to the stage and push
      // into our Shots array
      // if (exists === false) {
      //   let shot = new Shot({
      //     img: this.manager.shot,
      //     a: shots[s].a,
      //     i: shots[s].i,
      //     x: shots[s].p.x,
      //     y: shots[s].p.y,
      //   })

      //   this.storeProjectile(shot);
      //   this.addProjectileToStage(shot);
      // }
    // };
  }

  tick(event) {
    let gophers = this.state.gophers;
    let u;
    let g;
    let gInner;
    let s;
    let sInner;

    // Update our User's gopher first
    for (u = gophers.length - 1; u >= 0; u--) {
      if (gophers[u].i === this._userID && this.gophersOnStage[u].update !== undefined) {
        this.gophersOnStage[u].update({
          a: gophers[u].a,
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
        for (gInner = this.gophersOnStage.length - 1; gInner >= 0; gInner--) {
          // If they already exist on the stage
          if (gophers[g].i === this.gophersOnStage[gInner]._i) {
            exists = true;
            if (this.gophersOnStage[gInner].update !== undefined) {
              this.gophersOnStage[gInner].update({
                a: gophers[g].a,
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
          a: gophers[g].a,
          i: gophers[g].i,
          x: gophers[g].p.x,
          y: gophers[g].p.y
        });

        this.storeGopher(enemyGopher);
        this.addGopherToStage(enemyGopher);
      }
    };

    this.updateShots(this.state.shots);

    this.stage.update();
  }

  storeGopher(gopher) {
    this.gophersOnStage.push(gopher);
  }

  addGopherToStage(gopher) {
    this.stage.addChild(gopher);
  }

  storeProjectile(projectile) {
    this.shotsOnStage.push(projectile);
  }

  addProjectileToStage(shot) {
    this.stage.addChild(shot);
  }

  removeChildFromStage(child) {
    this.stage.removeChild(child);
  }

  sendCommand(cmd) {
    this.conn.send(cmd);
  }

  InitStage(Manager, conn) {
    let userGopher = new UserGopher({
      img: Manager.userImg,
      i: this._userID,
      a: 0,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
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

  UpdateStage(data) {
    this.state = data;
  }
}
