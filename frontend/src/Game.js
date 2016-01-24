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

  tick(event) {
    let gophers = this.state.gophers;
    let shots = this.state.shots;
    let u;
    let g;
    let gInner;
    let s;
    let sInner;

    if (this.count < 5) {
      this.count++;
      console.log(gophers);
    }

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

    for (s = shots.length - 1; s >= 0; s--) {
      let exists = null;

      if (this.shotsOnStage.length > 0) {
        for (sInner = this.shotsOnStage.length - 1; sInner >= 0; sInner--) {
          if (shots[s].i === this.shotsOnStage[sInner]._i) {
            exists = true;
            if (this.shotsOnStage[sInner].update !== undefined) {
              this.shotsOnStage[sInner].update({
                x: shots[s].p.x,
                y: shots[s].p.y
              });
            }
            break;
          } else {
            exists = false;
          }
        };
      } else {
        // We don't have any projectiles on the screen, but
        // a shot has been fired because shots.length isn't 0
        exists = false;
      }

      // Doesn't exist, let's add it to the stage and push
      // into our Shots array
      if (exists === false) {
        let shot = new Shot({
          img: this.manager.shot,
          i: shots[s].i,
          x: shots[s].p.x,
          y: shots[s].p.y,
        })

        this.storeProjectile(shot);
        this.addProjectileToStage(shot);
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

  storeProjectile(projectile) {
    this.shotsOnStage.push(projectile);
  }

  addProjectileToStage(shot) {
    this.stage.addChild(shot);
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
