/* jshint esversion: 6 */

var canvas11 = document.getElementById('canvas11'), // canvas must be defined here for backend functions
    ctx11, // canvas.getContext('2d')
    aLoop11,
    myMarbleSim;


function MarbleSim(context,total) {
  this.ctx = context;
  this.marbles = undefined;
  this.total = total;
  this.grav = 0.6; // pixels per frame acceleration down

  this.init = function() {
    this.marbles = [];
    for (let i = 0; i < this.total; i++) {
      this.marbles.push(new Marble(this.ctx,this.grav));
    }
    for (let j = 0; j < this.marbles.length; j++) {
      this.marbles[j].init();
    }
  };

  this.draw = function() {
    for (let i = 0; i < this.marbles.length; i++) {
      this.marbles[i].draw();
    }
  };

  this.update = function() {
    for (var i = 0; i < this.marbles.length; i++) {
      this.marbles[i].update();
    }
  };

}

function Marble(c,g) {
  this.ctx = c;
  this.grav = g;
  this.hardnessCoef = 0.95;
  this.frictionCoef = 0.99;
  this.color = undefined;
  this.x = undefined;
  this.y = undefined;
  this.r = undefined;
  this.xVel = undefined;
  this.yVel = undefined;
  this.sAngle = 0;
  this.eAngle = 360;
  this.lineW = 1;

  this.init = function() {
    this.color = randColor('rgba');
    this.x = getRandomIntInclusive(20,480);
    this.y = getRandomIntInclusive(20,300);
    this.r = getRandomIntInclusive(10,30);
    this.xVel = getRandomIntInclusive(-10,10);
    this.yVel = getRandomIntInclusive(-7,7);
  };

  this.draw = function() {
    ctx = this.ctx;
    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // sAngle	The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
    // eAngle	The ending angle, in radians
    // counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = invertRGBAstr(this.color);
    // ctx.strokeStyle = myColors.mossGreen;
    ctx.lineWidth = this.lineW;
    ctx.arc(this.x,this.y,this.r,this.sAngle,this.eAngle);
    ctx.fill();
    ctx.stroke();

    // ctx.beginPath();
    // ctx.fillStyle = invertRGBAstr(this.color);
    // ctx.arc(this.x,this.y,this.r*0.7,this.sAngle,this.eAngle);
    // ctx.fill();
    //
    // ctx.beginPath();
    // ctx.fillStyle = this.color;
    // ctx.arc(this.x,this.y,this.r*0.2,this.sAngle,this.eAngle);
    // ctx.fill();
  }; // draw

  this.update = function() {
    // check if close to the ground and ready to stop
    if ( ((this.y + this.yVel + this.r + this.lineW) > 500) && (this.yVel <= 1) && (this.yVel >= -1) ) {
        // y direction no longer gets updated

        // check X bounds
        if (  ((this.x + this.xVel + this.r + this.lineW) > 500) || ((this.x + this.xVel - this.r - this.lineW) < 0)  ) {
          this.xVel *= -1;
          this.xVel *= this.hardnessCoef; // some vel lost on contact of wall/ground
        }
        // add friction when on ground
        this.xVel *= this.frictionCoef;
    } else {
        // check Y bounds
        if ( ((this.y + this.yVel - this.r) < 0) || ((this.y + this.yVel + this.r) > 500) ) { // ground or sky
          this.yVel *= -1;
          this.yVel *= this.hardnessCoef; // some vel lost on contact of wall/ground
        }
        // check X bounds
        if (  ((this.x + this.xVel + this.r + this.lineW) > 500) || ((this.x + this.xVel - this.r - this.lineW) < 0)  ) {
          this.xVel *= -1;
          this.xVel *= this.hardnessCoef; // some vel lost on contact of wall/ground
        }
        // apply gravity
        this.yVel += this.grav;
        // calc new location of ball
        this.y += this.yVel;
    }
    // calc new location of ball
    this.x += this.xVel;
  };

}
