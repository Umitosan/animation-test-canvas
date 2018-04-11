/*jshint esversion: 6 */


var canvas8 = $('#canvas8')[0],
    ctx8,
    aLoop8,
    myMouseTrack;

function MouseTrack(context,quantity) {
  this.ctx = context;
  this.quant = quantity;
  this.x = undefined;
  this.y = undefined;
  this.cR = 20;
  this.mouseEventData = undefined;
  this.sparks = [];

  this.init = function() {
    console.log('mouse track init');
      canvas8.addEventListener('mousemove', (evt) => {
        this.mouseEventData = evt;
      }, false);
      canvas8.addEventListener('click', (evt2) => {
        this.initSparks();
      }, false);
  }; // init

  this.getMousePos = function() {
    let rect = canvas8.getBoundingClientRect();
    let msDataX = this.mouseEventData.clientX;
    let msDataY = this.mouseEventData.clientY;
    return {
      x: msDataX - rect.left,
      y: msDataY - rect.top
    };
  };

  this.initSparks = function() {
    console.log('this.initSparks');
    for (var i = 0; i < this.quant; i++) {
      let randX =  this.x;
      let randY =  this.y;
      let randLen =  getRandomIntInclusive(10,30);
      let randAngle = getRandomIntInclusive(1,360);
      let randVel = getRandomIntInclusive(2,5) / 30;
      let color = randColor('rgba');
      this.sparks.push({  x:     randX,
                          y:     randY,
                          angle: randAngle,
                          len:   randLen,
                          vel:   randVel,
                          color: color
                        });
    } // for
    console.log('this.sparks = ', this.sparks);
  }; // initDeathSparkles

  this.nextSpark = function() {
    for (let i = 0; i < this.sparks.length; i++) {
      let angle = this.sparks[i].angle;
      let len = this.sparks[i].len;
      let vel = this.sparks[i].vel;
      this.sparks[i].x += (vel*(len*Math.cos(angle)));
      this.sparks[i].y += (vel*(len*Math.sin(angle)));
      // destroy sparks the exit canvas bounds
      if ( (this.sparks[i].x < 0) || (this.sparks[i].x > canvas8.width) || (this.sparks[i].y < 0) || (this.sparks[i].y > canvas8.height) ) {
        this.sparks.splice(i,1); // remove the spark from array
      }
    }
  };

  this.draw = function() {
    // mouse position TXT
    this.ctx.textAlign = "center";
    this.ctx.font = '14pt Calibri';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText( /* msg */ 'Mouse position(x,y):  ' + (this.x-0.5) + ' , ' + this.y,
                       /*  x  */  canvas8.width/2,
                       /*  y  */  30
                       );
    // circle around mouse
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.arc(this.x,this.y,this.cR,0,360);
    this.ctx.stroke();
    // sparks
    for (var i = 0; i < this.sparks.length; i++) {
      this.ctx.lineWidth = getRandomIntInclusive(1,12);
      this.ctx.strokeStyle = this.sparks[i].color;
      let x = this.sparks[i].x;
      let y = this.sparks[i].y;
      let angle = this.sparks[i].angle;
      let len = this.sparks[i].len;
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
    if (this.sparks !== undefined) {
      if (this.sparks.length > 0) this.nextSpark();
    }
  }; // update


} // MouseTrack


// <canvas id="myCanvas" width="578" height="200"></canvas>
//
//   function writeMessage(canvas, message) {
//     var context = canvas.getContext('2d');
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     context.font = '18pt Calibri';
//     context.fillStyle = 'black';
//     context.fillText(message, 10, 25);
//   }
//   function getMousePos(canvas, evt) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//       x: evt.clientX - rect.left,
//       y: evt.clientY - rect.top
//     };
//   }
//   var canvas = document.getElementById('myCanvas');
//   var context = canvas.getContext('2d');
//
//   canvas.addEventListener('mousemove', function(evt) {
//     var mousePos = getMousePos(canvas, evt);
//     var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
//     writeMessage(canvas, message);
//   }, false);
