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
    let text = Math.round((this.numElementsLoaded / this.NUM_ELEMENTS_TO_DOWNLOAD) * 100);

    this.downloadProgress.text = 'Downloading ' + text + ' %';

    // update the stage:
    this.stage.update();
  }
}
