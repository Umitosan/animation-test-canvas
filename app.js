

var canvasWidth = 400,
    canvasHeight = 400,
    canvas = $('#canvas')[0], // canvas must be defined here for backend functions
    maxFPS = 30,
    lastFrameTimeMs = 0,
    ctx = undefined,
    myReq = undefined, // canvas.getContext('2d')
    myArcGroup = undefined,
    myGradAnim = undefined;

// see this for html names colors
// https://www.w3schools.com/colors/colors_shades.asp
var myColors = {
  black: 'rgba(0, 0, 0, 1)',
  darkGrey: 'rgba(50, 50, 50, 1)',
  lightGreyTrans: 'rgba(50, 50, 50, 0.3)',
  greyReset: 'rgb(211,211,211)',
  lighterGreyReset: 'rgb(240,240,240)',
  white: 'rgba(250, 250, 250, 1)',
  red: 'rgba(230, 0, 0, 1)',
  green: 'rgba(0, 230, 0, 1)',
  blue: 'rgba(0, 0, 230, 1)',
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

function GradAnim(barCount = 1, direction = 'right', speed = 1) {
  this.barCount = barCount;
  this.direction = direction;
  this.speed = speed;
  this.bars = [];

  this.init = function() {
    var dir = this.direction;
    var sp = this.speed;
    console.log('GradAnim init');
    for (var i = 0 ; i < this.barCount ; i++) {
      this.bars.push({  grad1: { x0: 0, y0: 0, x1: canvasWidth/2, y1: 0 },
                        grad1stopA: { offset: 0, color: 'white' },
                        grad1stopB: { offset: 0.9, color: 'green' },
                        rect1: { x0: 0, y0: 0, x1: canvasWidth/2, y1: canvasHeight},
                        grad2: { x0: canvasWidth/2, y0: 0, x1: canvasWidth, y1: 0 },
                        grad2stopA: { offset: 0.1, color: 'green' },
                        grad2stopB: { offset: 1, color: 'white' },
                        rect2: { x0: canvasWidth/2, y0: 0, x1: canvasWidth, y1: canvasHeight},
                        direction: dir,
                        speed: sp,
                    });
    } // for
    console.log('this.bars = ', this.bars);
  }
  this.draw = function() {
    // left gradient
    var gradient1 = ctx.createLinearGradient(this.bars[0].grad1.x0, this.bars[0].grad1.y0, this.bars[0].grad1.x1, this.bars[0].grad1.y1); // ctx.createLinearGradient(x0, y0, x1, y1);
    gradient1.addColorStop(this.bars[0].grad1stopA.offset, this.bars[0].grad1stopA.color);  // void gradient.addColorStop(offset, color);
    gradient1.addColorStop(this.bars[0].grad1stopB.offset, this.bars[0].grad1stopB.color);
    ctx.fillStyle = gradient1;
    ctx.fillRect(this.bars[0].rect1.x0, this.bars[0].rect1.y0, this.bars[0].rect1.x1, this.bars[0].rect1.y1);
    // right gradient
    var gradient2 = ctx.createLinearGradient(this.bars[0].grad2.x0, this.bars[0].grad2.y0, this.bars[0].grad2.x1, this.bars[0].grad2.y1); // ctx.createLinearGradient(x0, y0, x1, y1);
    gradient2.addColorStop(this.bars[0].grad2stopA.offset, this.bars[0].grad2stopA.color);  // void gradient.addColorStop(offset, color);
    gradient2.addColorStop(this.bars[0].grad2stopB.offset, this.bars[0].grad2stopB.color);
    ctx.fillStyle = gradient2;
    ctx.fillRect(this.bars[0].rect2.x0, this.bars[0].rect2.y0, this.bars[0].rect2.x1, this.bars[0].rect2.y1);
  }
  this.update = function() {

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
      var randRad = getRandomIntInclusive(4, 26);
      //  arc(x,y,radius,startAngle,endAngle);
      this.arcs.push( new Arc(getRandomIntInclusive(randRad, canvas.width-randRad), getRandomIntInclusive(randRad, canvas.height-randRad), randRad, randColor('hex')) );
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    clearCanvas();
    // drawDisco(4);
    myGradAnim.draw();

    lastFrameTimeMs = timestamp;
    myReq = requestAnimationFrame(aLoop);
}

//////////////////////////////////////////////////////////////////////////////////
// FRONT
//////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

  canvas = $('#canvas')[0];
  ctx = canvas.getContext('2d');

  $('#start').click(function() {
    console.log('loop started');
    myGradAnim = new GradAnim();
    myGradAnim.init();
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
