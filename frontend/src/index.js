import { InitStage } from './Stage';
let wspath = window.wspath;
let conn;
let gameID;

function joinGame(gameID) {

}

document.addEventListener('DOMContentLoaded', function () {
  if (window['WebSocket']) {
    console.log('woo');
  }

  InitStage();
});
