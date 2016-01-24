import { Game } from './Game';
import { AssetManager } from './AssetManager';

let $ = window.jQuery;
let SpaceGophers = new Game();
let Manager = new AssetManager(SpaceGophers.stage, SpaceGophers.stage.canvas.width, SpaceGophers.stage.canvas.height);
let conn;
let initialized = false;

function WSClose(e) {
  console.log('Connection closed');
}

function WSMessage(e) {
  let data = JSON.parse(e.data);

  if (data.type === 'init') {
    // Store the user's ID so we know which
    // Gopher belongs to this socket
    SpaceGophers.setUserId(data.i);
  }

  if (data.type === 'state' && initialized === true) {
    SpaceGophers.UpdateStage(data);
  }
}

function WSOpen(e) {
  // console.log('Connection opened to game: ');
  Manager.setDownloadCompleted(function () {
    initialized = true;
    window.onkeydown = function(e) {
      return !(e.keyCode == 32);
    };
    SpaceGophers.InitStage(Manager, conn);
  });

  Manager.StartDownload();
}

function joinGame(gameID) {
  conn = new WebSocket(window.wspath + gameID + '/ws');

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
