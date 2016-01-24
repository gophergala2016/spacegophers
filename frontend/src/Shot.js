import key from 'keyboardjs';

let Sprite = window.createjs.Sprite;
let SpriteSheet = window.createjs.SpriteSheet;

export class Shot extends Sprite {
  constructor(options) {
    super();
    let s = new Sprite();

    s.spriteSheet = new SpriteSheet({
      images: [options.img],
      frames: {
        width: 10,
        height: 20,
        regX: 5,
        regY: 10
      }
    });

    s.x = options.x;
    s.y = options.y;
    s._i = options.i;
    s.update = this.update;

    return s;
  }

  update(obj) {
    if (obj.x !== this.x) {
      this.x = obj.x;
    }

    if (obj.y !== this.y) {
      this.y = obj.y;
    }
  }
}