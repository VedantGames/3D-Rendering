export default class Bird {
  constructor(canvas, x, y, g) {
    this.ctx = canvas;
    this.x = x;
    this.y = y;
    this.g = g;
    this.w = 100;
    this.h = 100;
    this.vx = 0;
    this.vy = 0;
  }

  render() {
    this.vy -= this.vy > -10 ? this.g : 0;
    this.y = this.y - this.vy;
  }

  flap() {
    this.vy = 50;
  }

  draw() {
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}