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

  //circle vars
  this.circleY1 = undefined;
  this.circleX1 = undefined;
  this.circleY2 = undefined;
  this.circleX2 = undefined;
  this.circleRad = 200;
  this.circleRadMin = -200;
  this.circleRadMax = undefined;
  this.circleAnimVel = 2; // px per update
  this.circleColorCur = undefined;

  this.init = function() {
    this.startX = canvas14.width / 2;
    this.startY = canvas14.height / 2;
    this.waveColor = 'rgba(200,219,30,1)';
    this.circleRadMax = this.circleRadMin + 1;
    this.circleColorCur = randColor('rgba');
  };

  this.draw = function() {
    // axis
    // this.ctx.save();
    // this.ctx.beginPath();
    // this.ctx.translate(this.startX+0.5,this.startY+0.5);
    // this.ctx.lineWidth = 1;
    // this.ctx.strokeStyle = 'rgba(20,20,20,1)';
    // this.ctx.moveTo(-250,0);
    // this.ctx.lineTo(250,0);
    // this.ctx.moveTo(0,-250);
    // this.ctx.lineTo(0,250);
    // this.ctx.stroke();
    // this.ctx.restore();

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

    this.ctx.save();
    this.ctx.translate(this.startX+0.5,this.startY+0.5);
    this.ctx.lineWidth = 2;
    // this.ctx.strokeStyle = 'rgba(250,250,250,1)';
    this.ctx.strokeStyle = this.circleColorCur;

    for (let x1 = this.circleRadMin; x1 < this.circleRadMax; x1 += 1) {
      this.ctx.beginPath();
      // let y = Math.sqrt( (x + xTranslate)^2 - Math.pow(radius,2) ) - yTranslate
      let y1 = Math.sqrt( -Math.pow(x1,2) + Math.pow(this.circleRad,2) );
      let x2 = x1+1;
      let y2 = Math.sqrt( -Math.pow(x2,2) + Math.pow(this.circleRad,2) );
      // main circle
      // this.ctx.moveTo(x1,y1); // bottom arc
      // this.ctx.lineTo(x2,y2); // bottom arc
      // this.ctx.moveTo(x1,-y1); // top arc
      // this.ctx.lineTo(x2,-y2); // top arc

      for (let i = 0; i < 20; i++) {
        let scalar = 1-(i*0.03);
        if ((i % 2) === 0) {
          this.ctx.moveTo(x1*scalar,y1*scalar); // bottom arc
          this.ctx.lineTo(x2*scalar,y2*scalar); // bottom arc
          this.ctx.moveTo(x1*scalar,-y1*scalar); // top arc
          this.ctx.lineTo(x2*scalar,-y2*scalar); // top arc
        } else if ((i % 2) !== 0) {
          this.ctx.moveTo(x1*-1*scalar,y1*scalar); // bottom arc
          this.ctx.lineTo(x2*-1*scalar,y2*scalar); // bottom arc
          this.ctx.moveTo(x1*-1*scalar,-y1*scalar); // top arc
          this.ctx.lineTo(x2*-1*scalar,-y2*scalar); // top arc
        } else {
          // nothin
        }
      }

      this.ctx.stroke();
    }
    this.ctx.restore();

  };

  this.update = function() {
    // if ((performance.now() % 2000) < 18) {
    //   this.circleColorCur = randColor('rgba');
    // }
    if ((this.circleRadMax + this.circleAnimVel) < this.circleRad+this.circleAnimVel) { // grow right bounds
      this.circleRadMax += this.circleAnimVel;
    } else { // start disolve left bounds
      if ((this.circleRadMin + this.circleAnimVel) < this.circleRad+this.circleAnimVel) {
        this.circleRadMin += this.circleAnimVel;
      } else { // reset it all
        this.circleColorCur = randColor('rgba');
        this.circleRadMin = -this.circleRad;
        this.circleRadMax = -this.circleRad + this.circleAnimVel;
      }
    }
  };

}
