import { Game } from './Game';
import { AssetManager } from './AssetManager';

let $ = window.jQuery;
// let GameState = new State();
let SpaceGophers = new Game();
let Manager = new AssetManager(SpaceGophers.stage, SpaceGophers.stage.canvas.width, SpaceGophers.stage.canvas.height);
let count = 0;

export function WSClose(e) {
  console.log('Connection closed');
}

export function WSMessage(e) {
  // console.log(e.data);
  let data = JSON.parse(e.data);
  if (data.type === 'init') {
    // Store the user's ID so we know which
    // Gopher belongs to this socket
    SpaceGophers.setUserId(data.i);
  }

  if (data.type === 'state') {
    // GameState.setGophers(data.gophers);
    // if (count < 20) {
    //   count++;
    //   GameStage.UpdateStage(GameState);
    // }
  }
}

export function WSOpen(e) {
  console.log('Connection opened to game: ');
  Manager.setDownloadCompleted(function() {
    SpaceGophers.InitStage(Manager);
  });

  Manager.StartDownload();
}

function joinGame(gameID) {
  let conn = new WebSocket(window.wspath + gameID + '/ws');

  conn.onclose = WSClose;
  conn.onmessage = WSMessage;
  conn.onopen = WSOpen;
}


document.addEventListener('DOMContentLoaded', function () {
  if (window['WebSocket']) {

    if (window.location.hash && window.location.hash.length > 0) {
      let gameID = window.location.hash.substring(1);

      joinGame(gameID);

    } else {

      $.ajax({
        method: 'POST',
        url: '/',
        dataType: 'json'
      })
      .done(function (data) {
        window.location.hash = '#' + data.id;
        joinGame(data.id);
      });

    }
  } else {
    console.log('Your browser does not support WebSockets');
  }
});
