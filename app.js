

var myColors = new Colors();
var canvasWidth = 800,
    canvas = $('#canvas')[0], // canvas must be defined here for backend functions
    maxFPS = 60;

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
    var ctx = canvas.getContext('2d');
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText("Sorted!",this.x,this.y);
  }
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
function animLoop(timestamp) {

    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        myReq = requestAnimationFrame(animLoop);
        return;
    }

    lastFrameTimeMs = timestamp;
    myReq = requestAnimationFrame(animLoop);
}


//////////////////////////////////////////////////////////////////////////////////
// FRONT
//////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
  // canvas is instantiated above to be global
  canvas = $('#canvas')[0];


  $('.init').click(function() {
    console.log('init');
    myReq = requestAnimationFrame(animLoop)
  });

  $('.reset').click(function() {
    console.log('reset');
    requestAnimationFrame(myReq);
  });

});
