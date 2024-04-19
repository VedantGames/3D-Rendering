class Triangle {
  draw(ctx, a, b, c, color) {
    // console.log(a, b, c)
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(c[0], c[1]);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
}