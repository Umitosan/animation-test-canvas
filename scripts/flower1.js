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
    for (let i = 0; i < 120; i++) {
      let randomTotal = getRandomIntInclusive(3,8);
      let randomRotateSpeedRaidens = getRadianAngle( getRandomIntInclusive(4,12)/10 /* degrees */ );
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

} // END Flower1




function PetalLayer(context, x, y, total, rs) {
  this.ctx = context;
  this.x = x;
  this.y = y;
  this.baseWidth = getRandomIntInclusive(12,18);
  this.baseHeight = getRandomIntInclusive(3,12);
  this.curWidth = 0;
  this.curHeight = 0;
  this.maxOffsetFromCenter = 240; // pixels away from center before turning back inwards
  this.offsetFromCenter = getRandomIntInclusive(1,20);
  this.offsetFromCenterVel = getRandomIntInclusive(16,40)*0.1; // pixels per frame to expand the petal layer
  this.initOffsetRotation = getDegreeAngle( getRandomIntInclusive(1,45) ); // this randomizes the petal locations so they don't line up between layers
  this.totalPetals = total;
  this.rotateSpeed = rs;
  this.rotationOffset = 0;
  this.angleGap = null;
  // this.color = randColor('rgba');
  this.color = randRedGreen();

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
      this.ctx.ellipse(this.offsetFromCenter, 0, this.curWidth, this.curHeight, 0, 0, 2 * Math.PI);
      // this.ctx.stroke();
      this.ctx.fill();
      this.ctx.restore();
    }
  };

  this.update = function() {
    // if ((performance.now() % 50) < 17) {
    //   this.rotationOffset += this.rotateSpeed;
    // }
    this.curWidth = this.baseWidth * ( this.offsetFromCenter / this.maxOffsetFromCenter) + 1;
    this.curHeight = this.baseHeight * ( this.offsetFromCenter / this.maxOffsetFromCenter) + 1;
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
