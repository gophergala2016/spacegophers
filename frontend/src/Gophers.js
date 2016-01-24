import key from 'keyboardjs';

let Shape = window.createjs.Shape;

export class BaseGopher extends Shape {
  constructor(options) {
    super();
    let g = new Shape();

    // Custom properties and methods
    g._i = options.i;
    g._name = options.name;
    g._color = options.color;
    g.update = this.update;
    g.getName = this.getName;
    g.convertDegrees = this.convertDegrees;

    // EaselJS properties/methods
    g.graphics
      .beginFill(options.color)
      .drawCircle(0, 0, 20);
    g.x = options.x;
    g.y = options.y;
    g.pixelsPerSecond = 100;
    return g;
  }

  getName() {
    return this._name;
  }

  convertDegrees(angle) {
    return (Math.sin(angle) * 360);
  }

  update(obj) {
    this.x = obj.x;
    this.y = obj.y;
    console.log(this._name, ' has new position of: ', obj, this.x, this.y);
  }
}

export class UserGopher extends BaseGopher {
  constructor(options) {
    let g = super(options);

    // key.bind(['w', 'up'], (e) => {
    //   console.log('upward movement');
    //   this.moveUp();
    // }, (e) => {
    //   console.log('stop upward movement');
    // });

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

  postAction(action) {

  }

  moveUp() {
    console.log('test: ', this.movementCalculation());
  }

  moveDown() {
    this.y += this.movementCalculation();
  }

  moveLeft() {
    this.x -= this.movementCalculation();
  }

  moveRight() {
    this.x += this.movementCalculation();
  }
}
