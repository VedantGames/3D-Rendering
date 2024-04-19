export default class Player {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
      z: 0
    };
    this.rotation = {
      x: 0,
      y: 0,
      z: 0
    };
    this.movement = {
      x: 0,
      y: 0,
      z: 0
    };
    this.speed = 0.5;
    this.sensitivity = 0.5;
    this.initControls();
  }

  initControls() {
    function toRadians(degrees) {
      return degrees * Math.PI / 180;
    }

    function toDeg(degrees) {
      return degrees * 180 / Math.PI;
    }
    
    const rotateY = (angle) => [
      [Math.cos(angle), 0, -Math.sin(angle)],
      [0, 1, 0],
      [Math.sin(angle), 0, Math.cos(angle)]
    ];
    
    function multiplyMatrixVector(matrix, vector) {
      const result = [];
      for (let i = 0; i < matrix.length; i++) {
        let sum = 0;
        for (let j = 0; j < vector.length; j++) {
          sum += matrix[i][j] * vector[j];
        }
        result.push(toDeg(sum)); 
      }
      return result;
    }

    document.getElementsByTagName('body')[0].addEventListener('keydown', e => {
      if (e.key === 'w') this.movement.y = this.speed;
      if (e.key === 's') this.movement.y = -this.speed;
      if (e.key === 'a') this.movement.x = this.speed;
      if (e.key === 'd') this.movement.x = -this.speed;
      // console.log(this.movement);
    })
    document.getElementsByTagName('body')[0].addEventListener('keyup', e => {
      if (e.key === 'w' || e.key === 's') this.movement.y = 0;
      if (e.key === 'a' || e.key === 'd') this.movement.x = 0;
    })
    document.getElementsByTagName('body')[0].addEventListener('mousemove', e => {
      let angleX = -e.movementX * this.sensitivity;
      let angleY =  e.movementY * this.sensitivity;

      this.rotation.x += angleY * Math.cos(toRadians(this.rotation.y));
      this.rotation.z += angleY * Math.sin(toRadians(this.rotation.y));

      let [x, y, z] = [toRadians(this.rotation.x), toRadians(this.rotation.y), toRadians(this.rotation.z)];
      [this.rotation.x, this.rotation.y, this.rotation.z] = multiplyMatrixVector(rotateY(toRadians(angleX)), [x, y, z])
      this.rotation.y += angleX;
    })
  }

  move() {
    if (this.movement.x != 0) {
      this.position.x += this.movement.x * Math.cos(this.rotation.y * Math.PI / 180);
      this.position.y += this.movement.x * -Math.sin(this.rotation.y * Math.PI / 180);
    }
    if (this.movement.y != 0) {
      this.position.x += this.movement.y * Math.sin(this.rotation.y * Math.PI / 180);
      this.position.y += this.movement.y * Math.cos(this.rotation.y * Math.PI / 180);
    }
    this.position.z += this.movement.z;
  }
}