/*jshint esversion: 6 */


var canvas12 = document.getElementById('canvas12'),
    ctx12,
    aLoop12,
    myWarp;

function Warp(context,quantity) {
  this.ctx = context;
  this.quant = quantity;
  this.x = undefined;
  this.y = undefined;
  this.cR = 20;
  this.mouseEventData = undefined;
  this.stars = [];

  this.init = function() {
    console.log('warp init');
      canvas12.addEventListener('mousemove', (evt) => {
        this.mouseEventData = evt;
      }, false);
      // canvas12.addEventListener('click', (evt2) => {
      //   this.initSparks();
      // }, false);
  }; // init

  this.getMousePos = function() {
    let rect = canvas12.getBoundingClientRect();
    let msDataX = this.mouseEventData.clientX;
    let msDataY = this.mouseEventData.clientY;
    return {
      x: msDataX - rect.left,
      y: msDataY - rect.top
    };
  };

  this.initStars = function() {
    console.log('this.initStars');
    for (var i = 0; i < this.quant; i++) {
      let randX =  this.x;
      let randY =  this.y;
      let randLen =  getRandomIntInclusive(10,30);
      let randAngle = getRandomIntInclusive(1,360);
      let randVel = getRandomIntInclusive(2,5) / 30;
      let color = randColor('rgba');
      this.stars.push({   x:     randX,
                          y:     randY,
                          angle: randAngle,
                          len:   randLen,
                          vel:   randVel,
                          color: color
                        });
    } // for
    console.log('this.stars = ', this.stars);
  }; // initDeathSparkles

  this.nextStar = function() {
    for (let i = 0; i < this.stars.length; i++) {
      let angle = this.stars[i].angle;
      let len = this.stars[i].len;
      let vel = this.stars[i].vel;
      this.stars[i].x += (vel*(len*Math.cos(angle)));
      this.stars[i].y += (vel*(len*Math.sin(angle)));
      // destroy stars the exit canvas bounds
      if ( (this.stars[i].x < 0) || (this.stars[i].x > canvas12.width) || (this.stars[i].y < 0) || (this.stars[i].y > canvas12.height) ) {
        this.stars.splice(i,1); // remove the spark from array
      }
    }
  };

  this.draw = function() {
    // mouse position TXT
    this.ctx.textAlign = "center";
    this.ctx.font = '14pt Calibri';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText( /* msg */ 'Mouse position(x,y):  ' + (this.x-0.5) + ' , ' + this.y,
                       /*  x  */  canvas12.width/2,
                       /*  y  */  30
                       );
    // circle around mouse
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.arc(this.x,this.y,this.cR,0,360);
    this.ctx.stroke();
    // stars
    for (var i = 0; i < this.stars.length; i++) {
      this.ctx.lineWidth = getRandomIntInclusive(1,12);
      this.ctx.strokeStyle = this.stars[i].color;
      let x = this.stars[i].x;
      let y = this.stars[i].y;
      let angle = this.stars[i].angle;
      let len = this.stars[i].len;
      // single ray
      this.ctx.beginPath();
      this.ctx.moveTo( x , y );
      this.ctx.lineTo( x+(len*Math.cos(angle)) , y+(len*Math.sin(angle)) );
      this.ctx.stroke();
    }

  }; // draw

  this.update = function() {
    if (this.mouseEventData !== undefined) {
      let mouseData = this.getMousePos();
      this.x = mouseData.x;
      this.y = mouseData.y;
    }
    if (this.stars !== undefined) {
      if (this.stars.length > 0) this.nextSpark();
    }
  }; // update


} // Warp
