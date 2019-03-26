/*jshint esversion: 6 */


var canvas16 = document.getElementById('canvas16'),
    ctx16,
    aLoop16,
    myFlower1;


function Flower1(context) {
  this.ctx = context;
  this.layers = null;
  this.x = canvas16.height / 2;
  this.y = canvas16.width / 2;

  this.init = function() {
    this.layers = [];
    for (let i = 0; i < 100; i++) {
      let randomTotal = getRandomIntInclusive(3,8);
      let randomRotateSpeedRaidens = getRadianAngle( getRandomIntInclusive(4,10)/10 /* degrees */ );
      let newPetalLayer = new PetalLayer(this.ctx, this.x, this.y, randomTotal, randomRotateSpeedRaidens);
      this.layers.push(newPetalLayer);
    }
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].init();
    }
  };

  this.draw = function() {
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].draw();
    }
  };

  this.update = function() {
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].update();
    }
  };

}




function PetalLayer(context, x, y, total, rs) {
  this.ctx = context;
  this.x = x;
  this.y = y;
  this.width = getRandomIntInclusive(10,16);
  this.height = getRandomIntInclusive(4,10);
  // this.offsetFromCenter = getRandomIntInclusive(40,300);
  this.offsetFromCenter = 0;
  this.offsetFromCenterVel = getRandomIntInclusive(10,30)*0.1; // pixels per frame to expand the petal layer
  this.initOffsetRotation = getDegreeAngle( getRandomIntInclusive(1,45) ); // this randomizes the petal locations so they don't line up between layers
  this.maxOffsetFromCenter = 260; // pixels away from center before turning back inwards
  this.totalPetals = total;
  this.rotateSpeed = rs;
  this.rotationOffset = 0;
  this.angleGap = null;
  this.color = randColor('rgba');
  // this.color = randBlue();

  this.init = function() {
    this.angleGap = getRadianAngle( 360 / this.totalPetals );
  };

  this.draw = function() {
    for (let i = 0; i < this.totalPetals; i++) {
      this.ctx.save();
      this.ctx.translate(this.x,this.y);
      this.ctx.rotate( (i * this.angleGap) + this.rotationOffset);
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.color;
      this.ctx.fillStyle = this.color;
      // ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle [, anticlockwise]);
      this.ctx.ellipse(this.offsetFromCenter, 0, this.width, this.height, 0, 0, 2 * Math.PI);
      // this.ctx.stroke();
      this.ctx.fill();
      this.ctx.restore();
    }
  };

  this.update = function() {
    // if ((performance.now() % 50) < 17) {
    //   this.rotationOffset += this.rotateSpeed;
    // }
    if (this.offsetFromCenter > this.maxOffsetFromCenter) {
      this.offsetFromCenterVel *= -1;
      this.offsetFromCenter += this.offsetFromCenterVel;
    } else if (this.offsetFromCenter < 0)  {
      this.offsetFromCenterVel *= -1;
      this.offsetFromCenter += this.offsetFromCenterVel;
    } else {
      this.offsetFromCenter += this.offsetFromCenterVel;
    }
    this.rotationOffset += this.rotateSpeed;
  };

}
