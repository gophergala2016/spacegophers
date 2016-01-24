import { BaseGopher, UserGopher } from './Gophers';

let createjs = window.createjs;

export class Game extends Object {
  constructor() {
    super();
    this.count = 0;
    this.stage = new createjs.Stage('spaceGophers');
    this.manager = null;
    this.conn = null;
    this.gophers = [];
  }

  setUserId(userID) {
    this._userID = userID;
  }

  getUserId() {
    return this._userID;
  }

  setGophers(gophers) {
    this._gophers = gophers;
  }

  tick(event) {
    this.stage.update();
  }

  storeGopher(gopher) {
    this.gophers.push(gopher);
  }

  addGopherToStage(gopher) {
    this.stage.addChild(gopher);
  }

  sendCommand(cmd) {
    console.log('send: ', cmd, this.conn);
    this.conn.send(cmd);
  }

  CreateUser(img) {
    return
  }

  InitStage(Manager, conn) {
    let userGopher = new UserGopher({
      img: Manager.userImg,
      i: this._userID,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: 15
    }, this.sendCommand.bind(this));

    createjs.Ticker.setFPS(5);
    createjs.Ticker.addEventListener('tick', this.stage);
    createjs.Ticker.addEventListener('tick', (e) => {
      this.tick(e);
    });

    this.manager = Manager;
    this.conn = conn;
    this.storeGopher(userGopher);
    this.addGopherToStage(userGopher);
  }

  updateGophers(newGophers) {
    let g;
    let r;
    for (g = newGophers.length - 1; g >= 0; g--) {
      let exists = null;

      // Only check for gopher existence if their ID doesn't match
      // our user's existing ID
      if (newGophers[g].i !== this._userID) {
        for (r = this.gophers.length - 1; r >= 0; r--) {
          // Check if this gopher has already been added to the stage
          if (newGophers[g].i === this.gophers[r]._i) {
            exists = true;
            this.gophers[r].update({
              x: newGophers[g].p.x,
              y: newGophers[g].p.y
            });
            break;

          } else {
            exists = false;
          }
        };
      }

      // Doesn't exist, let's add it to the stage and push
      // into our Gophers array
      if (exists === false) {
        console.log('ghost, adding gopher to stage', newGophers[g]);

        let enemyGopher = new BaseGopher({
          img: this.manager.enemyImg,
          i: newGophers[g].i,
          x: newGophers[g].p.x,
          y: newGophers[g].p.y,
          radius: 15
        });

        this.storeGopher(enemyGopher);
        this.addGopherToStage(enemyGopher);
      }
    };
  }

  UpdateStage(data) {
    this.updateGophers(data.gophers);
  }
}
