let createjs = window.createjs;

export class AssetManager {
  constructor(stage, width, height) {
    this.enemyImg = new Image();
    this.userImg = new Image();
    this.downloadProgress = {};
    this.onDownloadCompleted = null;
    this.stage = stage;
    this.width = width;
    this.height = height;
    this.NUM_ELEMENTS_TO_DOWNLOAD = 2;
    this.numElementsLoaded = 0;
  }

  setDownloadCompleted(cb) {
    this.onDownloadCompleted = cb;
  }

  StartDownload() {
    this.downloadProgress = new createjs.Text('-- %', '14px Arial', '#ff7700');
    this.downloadProgress.x = (this.width / 2) - 50;
    this.downloadProgress.y = (this.height / 2);
    this.stage.addChild(this.downloadProgress);
    this.stage.update();
    this.setDownloadParameters(this.enemyImg, '/static/enemygopher.png');
    this.setDownloadParameters(this.userImg, '/static/usergopher.png');

    createjs.Ticker.addEventListener('tick', (e) => {
      this.tick(e);
    });
  }

  setDownloadParameters(assetElement, url) {
    assetElement.src = url;
    assetElement.onload = this.handleElementLoad.bind(this);
    assetElement.onerror = this.handleElementError.bind(this);
  }

  handleElementLoad(e) {
    this.numElementsLoaded++;

    // If all elements have been downloaded
    if (this.numElementsLoaded === this.NUM_ELEMENTS_TO_DOWNLOAD) {
      this.stage.removeChild(this.downloadProgress);
      createjs.Ticker.removeEventListener('tick');
      this.numElementsLoaded = 0;
      // we're calling back the method set by SetDownloadCompleted
      this.onDownloadCompleted();
    }
  }

  handleElementError(e) {
    console.log('Error Loading Asset : ' + e.target.src);
  }

  tick(event) {
    this.downloadProgress.text = 'Downloading ' + Math.round((this.numElementsLoaded / this.NUM_ELEMENTS_TO_DOWNLOAD) * 100) + ' %';

    // update the stage:
    this.stage.update();
  }
}

// function ContentManager(stage, width, height) {
//     // Method called once all downloads are completed
//     var onDownloadCompleted;

//     var NUM_ELEMENTS_TO_DOWNLOAD = 10;
//     var numElementsLoaded = 0;

//     var downloadProgress;

//     // setting the download completed callback
//     this.setDownloadCompleted = function(cb) {
//         onDownloadCompleted = cb;
//     };

//     this.imgBackground = new Image();
//     this.imgPlayer = new Image();

//     // public method to launch the download process
//     this.StartDownload = function () {
//         // add a text object to output the current donwload progression
//         downloadProgress = new createjs.Text("-- %", "14px Arial", "#ff7700");
//         downloadProgress.x = (width / 2) - 50;
//         downloadProgress.y = height / 2;
//         stage.addChild(downloadProgress);
//         stage.update();

//         setDownloadParameters(this.imgBackground, 'img/background.jpg');
//         setDownloadParameters(this.imgPlayer, 'img/Bman.png');

//         createjs.Ticker.addEventListener("tick", this.tick);
//     };

//     function setDownloadParameters(assetElement, url) {
//         assetElement.src = url;
//         assetElement.onload = handleElementLoad;
//         assetElement.onerror = handleElementError;
//     };

//     // our global handler
//     function handleElementLoad(e) {
//         numElementsLoaded++;

//         // If all elements have been downloaded
//         if (numElementsLoaded === NUM_ELEMENTS_TO_DOWNLOAD) {
//             stage.removeChild(downloadProgress);
//             Ticker.removeAllListeners();
//             numElementsLoaded = 0;
//             // we're calling back the method set by SetDownloadCompleted
//             ondownloadcompleted();
//         }
//     }

//     //called if there is an error loading the image (usually due to a 404)
//     function handleElementError(e) {
//         console.log("Error Loading Asset : " + e.target.src);
//     }

//     // Update method which simply shows the current % of download
//     this.tick = function() {
//         downloadProgress.text = "Downloading " + Math.round((numElementsLoaded / NUM_ELEMENTS_TO_DOWNLOAD) * 100) + " %";

//         // update the stage:
//         stage.update();
//     };
// }
