import key from 'keyboardjs';

let Sprite = window.createjs.Sprite;
let SpriteSheet = window.createjs.SpriteSheet;

export class BaseGopher extends Sprite {
  constructor(options) {
    super();
    let g = new Sprite();

    g.spriteSheet = new SpriteSheet({
      images: [options.img],
      frames: {
        width: 50,
        height: 50,
        regX: 25,
        regY: 25
      }
    })

    g.x = options.x;
    g.y = options.y;
    g._i = options.i;
    g.update = this.update;

    return g;
  }

  update(obj) {
    this.x = obj.x;
    this.y = obj.y;
    // console.log('gopher has new position of: ', this.x, this.y);
  }
}

export class UserGopher extends BaseGopher {
  constructor(options, sendCommand) {
    let g = super(options, sendCommand);

    g.sendCommand = (cmd) => {
      sendCommand(cmd);
    }

    key.bind(['w', 'up'], (e) => {
      g.sendCommand('up');
    });

  //   keyboardJS.bind(['a', 'left'], self.sendCommand('left'));
  //   keyboardJS.bind(['d', 'right'], self.sendCommand('right'));
  //   keyboardJS.bind(['w', 'up'], self.sendCommand('up'));
  //   keyboardJS.bind(['s', 'down'], self.sendCommand('down'));
  //   keyboardJS.bind('space', self.sendCommand('fire'));
  // };

  // Game.prototype.sendCommand = function(command) {
  //   var self = this;

  //   return function() {
  //     console.log("Sending: " + command);
  //     self.ws.send(command);
  //   };
  // };

    // key.bind(['s', 'down'], (e) => {
    //   console.log('backward movement');
    //   // this.moveDown();
    // }, (e) => {
    //   console.log('stop backward movement');
    // });

    // key.bind(['a', 'left'], (e) => {
    //   console.log('left movement');
    //   // this.moveLeft();
    // }, (e) => {
    //   console.log('stop left movement');
    // });

    // key.bind(['d', 'right'], (e) => {
    //   console.log('right movement');
    //   // this.moveRight();
    // }, (e) => {
    //   console.log('stop right movement');
    // });

    return g;
  }


  moveUp() {
    this.sendCommand('up');
  }

  moveDown() {
  }

  moveLeft() {
  }

  moveRight() {
  }
}
