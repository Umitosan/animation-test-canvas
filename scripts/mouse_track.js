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

  this.init = function() {
    console.log('mouse track init');
      canvas8.addEventListener('mousemove', (evt) => {
        this.mouseEventData = evt;
      }, false);
  }; // init

  this.writeMessage = function(msg) {
    this.ctx.font = '18pt Calibri';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(msg, 10, 25);
  };

  this.getMousePos = function() {
    let rect = canvas8.getBoundingClientRect();
    let msDataX = this.mouseEventData.clientX;
    let msDataY = this.mouseEventData.clientY;
    return {
      x: msDataX - rect.left,
      y: msDataY - rect.top
    };
  };

  this.draw = function() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.arc(this.x,this.y,this.cR,0,360);
    this.ctx.stroke();

    this.writeMessage('Mouse position: ' + this.x + ',' + this.y);
  }; // draw

  this.update = function() {
    if (this.mouseEventData !== undefined) {
      let mouseData = this.getMousePos();
      this.x = mouseData.x;
      this.y = mouseData.y;
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
