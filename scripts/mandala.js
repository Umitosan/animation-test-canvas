/*jshint esversion: 6 */


var canvas4 = $('#canvas4')[0],
    ctx4,
    aLoop4,
    myMandala;

function Mandala(context) {
  this.ctx = context;
  this.color = randColor('rgba');
  this.x1 = 94; this.y1 = 94; this.width1 = 212; this.height1 = 212;
  this.x2 = 180; this.y2 = 180; this.width2 = 94; this.height2 = 94;
  this.x3 = 50; this.y3 = 50; this.width3 = 316; this.height3 = 316;
  this.angleRad = 0;  // angle of rotation in radians, 0.0174533 rad ~ 1 degree
  this.rotV = 0.0174533/6;  // rotational velocity
  this.updateCount = 0;
  this.colorFreq = 80; // update() run / 1 color change
  this.draw = function() {
    for (let i=0; i<10; i++) {
      this.ctx.save();
      this.ctx.strokeStyle = this.color;
      this.ctx.translate(canvas4.width/2, canvas4.height/2);  // translate to center
      this.ctx.rotate(this.angleRad*(i+0.05)); // rotate 90 deg (but in RAD) about the center point
      this.ctx.translate(-canvas4.width/2, -canvas4.height/2);  // translate back
      this.ctx.strokeRect(this.x1,this.y1,this.width1,this.height1);  // void ctx.fillRect(x, y, width, height);
      this.ctx.strokeStyle = invertRGBAstr(this.color);
      this.ctx.strokeRect(this.x2,this.y2,this.width2,this.height2);  // void ctx.fillRect(x, y, width, height);
      this.ctx.strokeRect(this.x3,this.y3,this.width3,this.height3);  // void ctx.fillRect(x, y, width, height);
      this.ctx.restore();
    }
  };
  this.update = function() {
    if (this.updateCount > this.colorFreq) {
      this.color = randColor('rgba');
      this.updateCount = 0;
    }
    this.angleRad += this.rotV;
    this.updateCount += 1;
  };
}
