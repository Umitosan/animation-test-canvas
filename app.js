

var myColors = new Colors();
var canvasWidth = 400,
    canvas = $('#canvas')[0], // canvas must be defined here for backend functions
    maxFPS = 5,
    lastFrameTimeMs = 0,
    ctx = undefined,
    myReq = undefined; // canvas.getContext('2d')

// see this for html names colors
// https://www.w3schools.com/colors/colors_shades.asp
function Colors() {
  this.black = 'rgba(0, 0, 0, 1)';
  this.darkGrey = 'rgba(50, 50, 50, 1)';
  this.lightGreyTrans = 'rgba(50, 50, 50, 0.3)';
  this.greyReset = 'rgb(211,211,211)';
  this.lighterGreyReset = 'rgb(240,240,240)';
  this.white = 'rgba(250, 250, 250, 1)';
  this.red = 'rgba(230, 0, 0, 1)';
  this.green = 'rgba(0, 230, 0, 1)';
  this.blue = 'rgba(0, 0, 230, 0.7)';
}

function TxtBox(x,y,font,color) {
  this.x = x;
  this.y = y;
  this.font = font;
  this.color = color;

  this.draw = function() {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText("Sorted!",this.x,this.y);
  }
}

function drawDisco(rowSize) {
  var tx = 0;
  var ty = 0;
  var squareSize = canvas.width/rowSize;
  for (var i = 0; i < rowSize; i++) {
    for (var j = 0; j < rowSize; j++) {
      ctx.fillStyle = randHexColor();
      ctx.fillRect(tx+j*squareSize,ty+i*squareSize,squareSize,squareSize);
    }
  }
}

function randHexColor() {
  // more muted colors
  // return ( "#" + Math.round((getRandomIntInclusive(0,99999999) + 0x77000000)).toString(16) );
  // full spectum
  return ( "#" + Math.round((getRandomIntInclusive(0,0xffffff) )).toString(16) );
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function clearCanvas() {
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}


//////////////////////////////////////////////////////////////////////////////////
// GAME LOOP
//////////////////////////////////////////////////////////////////////////////////
function aLoop(timestamp) {

    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        myReq = requestAnimationFrame(aLoop);
        return;
    }

    //draw stuff
    drawDisco(20);

    lastFrameTimeMs = timestamp;
    myReq = requestAnimationFrame(aLoop);
}


//////////////////////////////////////////////////////////////////////////////////
// FRONT
//////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
  // canvas is instantiated above to be global
  canvas = $('#canvas')[0];


  $('#start').click(function() {
    console.log('loop started');
    ctx = canvas.getContext('2d');
    if (myReq !== undefined) {
      cancelAnimationFrame(myReq);
    }
    myReq = requestAnimationFrame(aLoop);
  });

  $('#pause').click(function() {
    console.log('loop paused');
    console.log('random hex color = ', randHexColor() );
  });

  $('#reset').click(function() {
    console.log('loop reset');
    cancelAnimationFrame(myReq);
    clearCanvas();
  });

});
