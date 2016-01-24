import { BaseGopher, UserGopher } from './Gophers';

let createjs = window.createjs;
let stage = new createjs.Stage('spaceGophers');
let count = 0;
let userID = 'userID';
let gophers = [];

let state = {
  projectiles: [
    {
      id: 'projectile1',
      x: 25,
      y: 50
    }
  ],
  gophers: [
    {
      color: '#f00',
      id: 'gopher1',
      x: 300,
      y: 100
    },
    {
      color: '#0081c9',
      id: 'gopher2',
      x: 50,
      y: 50
    },
    {
      color: '#ff0',
      id: 'userID',
      x: 600,
      y: 600
    }
  ]
};

function tick(event) {
  let i;

  if (count < 10) {
    count++;
    console.log('-------');

    for (i = gophers.length - 1; i >= 0; i--) {
      gophers[i].update({
        x: 5,
        y: 7
      });
    };
  }

  stage.update();
}

export function InitStage() {
  let gopher;
  let i;

  for (i = state.gophers.length - 1; i >= 0; i--) {
    console.log('state: ', state.gophers[i].id);

    if (state.gophers[i].id !== userID) {
      gopher = new BaseGopher({
        color: state.gophers[i].color,
        id: state.gophers[i].id,
        x: state.gophers[i].x,
        y: state.gophers[i].y,
        radius: state.gophers[i].radius
      });
    } else {
      gopher = new UserGopher({
        color: state.gophers[i].color,
        id: state.gophers[i].id,
        x: state.gophers[i].x,
        y: state.gophers[i].y,
        radius: state.gophers[i].radius
      });
    }

    gophers.push(gopher);
    stage.addChild(gopher);
  };

  createjs.Ticker.setFPS(5);
  createjs.Ticker.addEventListener('tick', stage);
  createjs.Ticker.addEventListener('tick', tick);
}
