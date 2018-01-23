

var myColors = new Colors();
var canvasWidth = 400,
    canvas = $('#canvas')[0], // canvas must be defined here for backend functions
    maxFPS = 30,
    lastFrameTimeMs = 0,
    ctx = undefined,
    myReq = undefined, // canvas.getContext('2d')
    myArcGroup = undefined;

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
  this.blue = 'rgba(0, 0, 230, 1)';
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

function drawDisco(rowSize = 4) {
  var tx = 0;
  var ty = 0;
  var squareSize = canvas.width/rowSize;
  for (var i = 0; i < rowSize; i++) {
    for (var j = 0; j < rowSize; j++) {
      ctx.fillStyle = randColor('rgba');
      ctx.fillRect(tx+j*squareSize,ty+i*squareSize,squareSize,squareSize);
    }
  }
  ctx.fillStyle = myColors.black;
  ctx.font = '60px Georgia';
  ctx.textAlign = 'center';
  ctx.fillText('Disco',canvas.width/2,50);
}

function Arc(x,y,r,color) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.sAngle = 0;
  this.eAngle = 2 * Math.PI;
  this.xVel = getRandomIntInclusive(1,8)*randSign(); // rand speed and direction
  this.yVel = getRandomIntInclusive(1,8)*randSign(); // rand speed and direction
  this.color = color;

  this.draw = function() {
    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // sAngle	The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
    // eAngle	The ending angle, in radians
    // counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.arc(this.x,this.y,this.r,this.sAngle,this.eAngle);
    ctx.fill();
    ctx.stroke();
  } // draw

  // this.drawErase = function() {
  //   ctx.beginPath();
  //   ctx.fillStyle = 'lightblue';
  //   ctx.strokeStyle = 'lightblue';
  //   ctx.lineWidth = 3;
  //   ctx.arc(this.x - this.xVel,this.y,this.r,this.sAngle,this.eAngle);
  //   ctx.fill();
  //   ctx.stroke();
  // }

  this.update = function() {
    if (  ((this.x + this.xVel + this.r) > canvas.width) || ((this.x + this.xVel - this.r) < 0)  ) {
      this.xVel *= -1;
    }
    if (  ((this.y + this.yVel + this.r) > canvas.height) || ((this.y + this.yVel - this.r) < 0)  ) {
      this.yVel *= -1;
    }
    this.x += this.xVel;
    this.y += this.yVel;
  } // update
} // Arc

function ArcGroup(quantity) {
  this.arcs = [];

  this.init = function() {
    for (var i = 0; i < quantity; i++) {
      //  arc(x,y,radius,startAngle,endAngle);
      var randRad = getRandomIntInclusive(4, 26);
      this.arcs.push( new Arc(getRandomIntInclusive(100+randRad, 400-randRad), getRandomIntInclusive(100+randRad, 400-randRad), randRad, randColor('hex')) );
    }
  }

  this.draw = function() {
    for (var i = 0; i < this.arcs.length; i++) {
      // this.arcs[i].drawErase();
      this.arcs[i].draw();
    }
  }

  this.update = function() {
    for (var i = 0; i < this.arcs.length; i++) {
      this.arcs[i].update();
    }
  }
} // Circles

function randSign() {
  var num = getRandomIntInclusive(1,2)
  if (num === 1) {
    return 1
  } else {
    return -1;
  }
}

function randColor(type) {
  // more muted colors example
  // return ( "#" + Math.round((getRandomIntInclusive(0,99999999) + 0x77000000)).toString(16) );
  // full spectum
  if (type === 'hex') {
    return ( "#" + Math.round((getRandomIntInclusive(0,0xffffff))).toString(16) );
  }
  if (type === 'rgba') {
    return ( 'rgba('+ getRandomIntInclusive(0,255) +','+ getRandomIntInclusive(0,255) +','+ getRandomIntInclusive(0,255) +','+1+')' );
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
function aLoop(timestamp) {

    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        myReq = requestAnimationFrame(aLoop);
        return;
    }

    //draw stuff
    myArcGroup.update();
    clearCanvas();
    // drawDisco(20);
    myArcGroup.draw();

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
    myArcGroup = new ArcGroup(40);
    myArcGroup.init();
    console.log('arc created = ', myArcGroup);
    if (myReq !== undefined) {
      cancelAnimationFrame(myReq);
    }
    myReq = requestAnimationFrame(aLoop);
  });

  $('#pause').click(function() {
    console.log('loop paused');
  });

  $('#reset').click(function() {
    console.log('loop reset');
    cancelAnimationFrame(myReq);
    clearCanvas();
  });

});
