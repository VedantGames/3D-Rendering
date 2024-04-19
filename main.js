var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

console.log("sss");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.requestAnimationFrame(update);

let player = new Player();

function room() {
  let wall = new Cube();
  wall.draw(ctx, player, [0, 0, 17], [0, 0, 0], [100, 100, 1], "black");
  wall.draw(ctx, player, [-20, 10, 5], [0, 0, 0], [5, 50, 20], "blue");
  wall.draw(ctx, player, [7, 37, 5], [0, 0, 0], [50, 5, 20], "red");
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect((canvas.width / 2) - 5, (canvas.height / 2) - 5, 10, 10)
  ctx.stroke();

  player.move();
  room();
  window.requestAnimationFrame(update);
}