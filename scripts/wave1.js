/*jshint esversion: 6 */


var canvas14 = document.getElementById('canvas14'),
    ctx14,
    aLoop14,
    myWave1;


function Wave1(context) {
  this.startX = undefined;
  this.startY = undefined;
  this.ctx = context;
  this.quantity = 1; // number of total waves
  this.offset = undefined;
  this.counter = -10;
  this.squish = 0;
  this.squishCoef = 0.020;
  this.xOffset = 0;
  this.xVel = 1;
  this.waveColor = undefined;
  this.waveCTimer = 500;
  this.waveXlength = 360;

  this.init = function() {
    this.startX = canvas14.width / 2;
    this.startY = canvas14.height / 2;
    this.waveColor = 'rgba(200,219,30,1)';
  };

  this.draw = function() {
    // axis
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.translate(this.startX+0.5,this.startY+0.5);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'rgba(20,20,20,1)';
    this.ctx.moveTo(-250,0);
    this.ctx.lineTo(250,0);
    this.ctx.moveTo(0,-250);
    this.ctx.lineTo(0,250);
    this.ctx.stroke();
    this.ctx.restore();

    // let curX = -this.waveXlength/2;
    // let curY = 0;
    // // let increase = Math.PI / 360; // larger = less freq
    // let squishOffset = this.squish;
    // // let squishCoef = 1 - squishOffset; // this makes the wave overall squish to the right
    // let squishCoef = 20;
    // this.ctx.save();
    // this.ctx.translate(this.startX+0.5,this.startY+0.5);
    // this.ctx.lineWidth = 1;
    // this.ctx.strokeStyle = this.waveColor;
    // let ct = 0;
    // for (let x = (-this.waveXlength/2); x <= this.waveXlength/2; x+=1) { // left bound, right bound
    //   this.ctx.rotate(getRadianAngle(ct));
    //   this.ctx.beginPath();
    //   this.ctx.moveTo(curX,curY*squishCoef);
    //   // this.ctx.moveTo(curX,curY*squishCoef);
    //   curX = x;
    //   curY = Math.sin(x); //
    //   // this.ctx.lineTo(curX,curY*squishCoef);
    //   this.ctx.lineTo(curX,curY*squishCoef);
    //   this.ctx.stroke();
    //   this.ctx.rotate(getRadianAngle(-ct));
    //   ct += 1;
    // }
    // this.ctx.restore();

    // circle
    // 50 = (y + b)^2 + (x + a)^2
    // 50 - (y + b)^2 = (x + a)^2
    // (y + b)^2 = (x + a)^2 - 50
    // y = +and- Math.sqrt( (x + xTranslate)^2 - Math.pow(radius,2) ) - yTranslate
    let rad = 200;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.translate(this.startX+0.5,this.startY+0.5);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'rgba(250,250,250,1)';

    for (let x1 = -rad; x1 < rad+1; x1++) {
      // let y = Math.sqrt( (x + xTranslate)^2 - Math.pow(radius,2) ) - yTranslate
      let y1 = Math.sqrt( -Math.pow(x1,2) + Math.pow(rad,2) );
      let x2 = x1+1;
      let y2 = Math.sqrt( -Math.pow(x2,2) + Math.pow(rad,2) );
      // bottom arc
      this.ctx.moveTo(x1,y1);
      this.ctx.lineTo(x2,y2);
      // top arc
      this.ctx.moveTo(x1,-y1);
      this.ctx.lineTo(x2,-y2);
      this.ctx.stroke();
    }


    this.ctx.restore();

  };

  this.update = function() {

  };

}
