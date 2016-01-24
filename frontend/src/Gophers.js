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
    });

    g.x = options.x;
    g.y = options.y;
    g._i = options.i;
    g.update = this.update;

    return g;
  }

  update(obj) {
    if (obj.x !== this.x) {
      this.x = obj.x;
    };

    if (obj.y !== this.y) {
      this.y = obj.y;
    };
  }
}

export class EnemyGopher extends BaseGopher {
  constructor(options, sendCommand) {
    return super(options);
  }
}

export class UserGopher extends BaseGopher {
  constructor(options, sendCommand) {
    let g = super(options);

    g.sendCommand = (cmd) => {
      sendCommand(cmd);
    };

    key.bind(['w', 'up'], (e) => {
      e.preventDefault();
      g.sendCommand('up');
    });

    key.bind(['s', 'down'], (e) => {
      e.preventDefault();
      g.sendCommand('down');
    });

    key.bind(['d', 'right'], (e) => {
      g.sendCommand('right');
    });

    key.bind(['a', 'left'], (e) => {
      g.sendCommand('left');
    });

    return g;
  }
}
