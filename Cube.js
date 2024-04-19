class Cube {
  Cw = 100;
  Ch = 100;
  Vw = 1;
  Vh = 1;
  d = 10;
  offset = [window.innerWidth/2, window.innerHeight/2]

  drawLine(ctx, a, b) {
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  }

  viewportToCanvas(x, y) {
    // console.log([(x * this.Cw/this.Vw) + this.offset[0], (y * this.Ch/this.Vh) + this.offset[1]]);
    // console.log(x, y);
      return [(x * this.Cw/this.Vw) + this.offset[0], (y * this.Ch/this.Vh) + this.offset[1]];
  }

  projectVertex(v) {
    // console.log(v);
    return v[2] > 0 ? this.viewportToCanvas(v[0] * this.d / v[2], v[1] * this.d / v[2]) : [0, 0];
  }

  renderTriangle(ctx, triangle, projected, color) {
    var t = new Triangle();
    t.draw(ctx, projected[triangle[0]], projected[triangle[1]], projected[triangle[2]], color);
  }

  rotateVertices(vertices, rotation) {
    function toRadians(degrees) {
      return degrees * Math.PI / 180;
    }
    function toDeg(degrees) {
      return degrees / Math.PI * 180;
    }
    let rotationRadians = rotation.map(toRadians);

    const rotateX = (angle) => [
      [1, 0, 0],
      [0, Math.cos(angle), -Math.sin(angle)],
      [0, Math.sin(angle), Math.cos(angle)]
    ];
    
    const rotateY = (angle) => [
      [Math.cos(angle), 0, Math.sin(angle)],
      [0, 1, 0],
      [-Math.sin(angle), 0, Math.cos(angle)]
    ];
    
    const rotateZ = (angle) => [
      [Math.cos(angle), -Math.sin(angle), 0],
      [Math.sin(angle), Math.cos(angle), 0],
      [0, 0, 1]
    ];

    const rotatedVertices = vertices.map(vertex => {
      let rotatedVertex = vertex.slice(); // Create a copy of the vertex
    
      // Apply rotation in X axis
      rotatedVertex = multiplyMatrixVector(rotateX(rotationRadians[0]), rotatedVertex);
    
      // Apply rotation in Y axis
      rotatedVertex = multiplyMatrixVector(rotateY(rotationRadians[1]), rotatedVertex);
    
      // Apply rotation in Z axis
      rotatedVertex = multiplyMatrixVector(rotateZ(rotationRadians[2]), rotatedVertex);
    
      // console.log(rotatedVertex);
      // let [x, y, z] = rotation;
      // let [rx, ry, rz] = rotationRadians;
      // rotatedVertex = [x, toDeg(Math.cos(ry) - Math.sin(rz)), toDeg(Math.sin(ry) + Math.cos(rz))];
      // rotatedVertex = 
      return rotatedVertex;
    });

    function multiplyMatrixVector(matrix, vector) {
      const result = [];
      for (let i = 0; i < matrix.length; i++) {
        let sum = 0;
        for (let j = 0; j < vector.length; j++) {
          sum += matrix[i][j] * vector[j];
        }
        result.push(sum);
      }
      return result;
    }

    return rotatedVertices;
  }

  draw(ctx, camera, pos, rotation, scale, color) {
    let [x, z, y] = pos;
    let [rx, ry, rz] = rotation;
    let [sx, sz, sy] = scale;
    let [hsx, hsy, hsz] = [sx/2, sy/2, sz/2];
    let {position:camPos, rotation:camRot} = camera;

    var vertices2 = [[-hsx, -hsy, -hsz], [-hsx, hsy, -hsz],
                    [hsx, hsy, -hsz], [hsx, -hsy, -hsz],
                    [-hsx, -hsy, hsz], [-hsx, hsy, hsz],
                    [hsx, hsy, hsz], [hsx, -hsy, hsz]];

    vertices2 = this.rotateVertices(vertices2, [rotation[0], rotation[1], rotation[2]]);
    let vertices = vertices2.map(v => [x+v[0]+camPos.x, y+v[1]+camPos.z, z+v[2]]);
    vertices = this.rotateVertices(vertices, [0, 0, camRot.z]);
    vertices = vertices.map(v => [v[0], v[1], v[2]-camPos.y]);


    vertices = this.rotateVertices(vertices, [camRot.x, camRot.y, 0]);

    var triangle = [[0, 1, 2], [0, 2, 3], [4, 0, 3],
                    [4, 3, 7], [5, 4, 7], [5, 7, 6],
                    [1, 5, 6], [1, 6, 2], [4, 5, 1],
                    [4, 1, 0], [2, 6, 7], [2, 7, 3]];

    var projected = [];
    vertices.forEach(vertex => {
      projected.push(this.projectVertex(vertex));
    });
    triangle.forEach(t => {
      this.renderTriangle(ctx, t, projected, color);
    });
  }
}
