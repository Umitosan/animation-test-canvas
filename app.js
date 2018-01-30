

var canvas1 = $('#canvas1')[0], // canvas must be defined here for backend functions
    canvas2 = $('#canvas2')[0], // canvas must be defined here for backend functions
    fps, fpsInterval, startTime, now, then, elapsed,
    ctx1 = undefined, // canvas.getContext('2d')
    ctx2 = undefined,
    myReq1 = undefined, // myReq = requestAnimationFrame()
    myReq2 = undefined,
    myArcGroup = undefined,
    myGradAnim = undefined,
    myGradAnim2 = undefined,
    aLoopPause = true;

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
  lightblueAlpha: 'rgba(173,216,230,0.2)',
  yellowAlpha: 'rgba(255,255,0,0.2)',
  greenAlpha: 'rgba(0,128,0,0.2)',
}

function TxtBox(x,y,font,color) {
  this.x = x;
  this.y = y;
  this.font = font;
  this.color = color;

  this.draw = function() {
    ctx1.font = this.font;
    ctx1.fillStyle = this.color;
    ctx1.fillText("Sorted!",this.x,this.y);
  }
}

// GradBar is two gradients whose edges touch and have the same thickness in a way to make an interesting single bar of color
function GradBar(grad1,grad1stopA,grad1stopB,rect1,grad2,grad2stopA,grad2stopB,rect2,speed,center) {
  this.grad1 = grad1;
  this.grad1stopA = grad1stopA;
  this.grad1stopB = grad1stopB;
  this.rect1 = rect1;
  this.grad2 = grad2;
  this.grad2stopA = grad2stopA;
  this.grad2stopB = grad2stopB;
  this.rect2 = rect2;
  this.speed = speed;
  this.center = center;

  this.draw = function() {
    var gradient1 = ctx1.createLinearGradient(this.grad1.x0, this.grad1.y0, this.grad1.x1, this.grad1.y1); // ctx.createLinearGradient(x0, y0, x1, y1);
    gradient1.addColorStop(this.grad1stopA.offset, this.grad1stopA.color);  // void gradient.addColorStop(offset, color);
    gradient1.addColorStop(this.grad1stopB.offset, this.grad1stopB.color);
    ctx1.fillStyle = gradient1;
    ctx1.fillRect(this.rect1.x0, this.rect1.y0, this.rect1.x1, this.rect1.y1);
    var gradient2 = ctx1.createLinearGradient(this.grad2.x0, this.grad2.y0, this.grad2.x1, this.grad2.y1); // ctx.createLinearGradient(x0, y0, x1, y1);
    gradient2.addColorStop(this.grad2stopA.offset, this.grad2stopA.color);  // void gradient.addColorStop(offset, color);
    gradient2.addColorStop(this.grad2stopB.offset, this.grad2stopB.color);
    ctx1.fillStyle = gradient2;
    ctx1.fillRect(this.rect2.x0, this.rect2.y0, this.rect2.x1, this.rect2.y1);
  } // draw
} // GradBar

function GradAnim(barCount = 20, maxSpeed = 20, color1 = 'lightblue', color2 = 'green', rotation = 0) {
  this.barCount = barCount;
  this.maxSpeed = maxSpeed;
  this.color1 = color1;
  this.color2 = color2;
  this.rotation = rotation;
  this.bars = [];

  this.init = function() {
    console.log('GradAnim init');
    var c1 = this.color1;
    var c2 = this.color2;
    for (var i = 0 ; i < this.barCount ; i++) {
      var randCenter = getRandomIntInclusive(10,canvas1.width-10);
      var sp = getRandomIntInclusive(1,this.maxSpeed);
      var topY = (canvas1.height/barCount)*(i);
      var botY = (canvas1.height/barCount)*(1+i);
      // REF: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient
      var bar = new GradBar(  /*grad1:*/      { x0: 0, y0: 0, x1: randCenter, y1: 0 },  // ctx.createLinearGradient(x0, y0, x1, y1);
                              /*grad1stopA:*/ { offset: 0, color: c1 },  // void gradient.addColorStop(offset, color);
                              /*grad1stopB:*/ { offset: 1, color: c2 },
                              /*rect1:*/      { x0: 0, y0: topY, x1: randCenter, y1: botY},
                              /*grad2*/       { x0: randCenter, y0: 0, x1: canvas1.width, y1: 0 },
                              /*grad2stopA:*/ { offset: 0, color: c2 },
                              /*grad2stopB:*/ { offset: 1, color: c1 },
                              /*rect2:*/      { x0: randCenter, y0: topY, x1: canvas1.width, y1: botY},
                              /*speed:*/      sp,
                              /*center:*/     randCenter,
                            );
    this.bars.push(bar);
    } // for
  } // init
  this.draw = function() {
    for (var i = 0 ; i < this.bars.length ; i++) {
      // rotate before drawing
      if (this.rotation !== 0) {
        ctx1.translate(canvas1.width/2, canvas1.width/2);
        ctx1.rotate(getRadianAngle(this.rotation));
        ctx1.translate(-canvas1.width/2, -canvas1.width/2);
      }
      this.bars[i].draw();
      // rotate back for other calculations to perform correctly
      if (this.rotation !== 0) {
        ctx1.translate(canvas1.width/2, canvas1.width/2);
        ctx1.rotate(getRadianAngle(this.rotation*-1));
        ctx1.translate(-canvas1.width/2, -canvas1.width/2);
      }
    } // for
  } // draw
  this.update = function() {
    for (var i = 0 ; i < this.bars.length ; i++) {  // update postions for each bar
      if (  ((this.bars[i].center+this.bars[i].speed-10) < 0) || ((this.bars[i].center+this.bars[i].speed+10) > canvas1.width) ) {  // test bound collision
        this.bars[i].speed *= -1; // change direction
      } else { // update the new location
        this.bars[i].center += this.bars[i].speed;
        var c = this.bars[i].center;
        this.bars[i].grad1.x1 = c;
        this.bars[i].rect1.x1 = c;
        this.bars[i].grad2.x0 = c;
        this.bars[i].rect2.x0 = c;
      } // if
    } // for
  } // update
}

function drawDisco(rowSize = 4) {
  var tx = 0;
  var ty = 0;
  var squareSize = canvas2.width/rowSize;
  for (var i = 0; i < rowSize; i++) {
    for (var j = 0; j < rowSize; j++) {
      ctx2.fillRect(tx+j*squareSize,ty+i*squareSize,squareSize,squareSize);
      ctx2.fillStyle = randColor('rgba');
    }
  }
  ctx2.fillStyle = myColors.black;
  ctx2.font = '60px Georgia';
  ctx2.textAlign = 'center';
  ctx2.fillText('Disco',canvas1.width/2,50);
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

    ctx2.beginPath();
    ctx2.fillStyle = this.color;
    ctx2.strokeStyle = this.color;
    ctx2.lineWidth = 1;
    ctx2.arc(this.x,this.y,this.r,this.sAngle,this.eAngle);
    ctx2.fill();
    ctx2.stroke();
  } // draw

  this.update = function() {
    if (  ((this.x + this.xVel + this.r) > canvas3.width) || ((this.x + this.xVel - this.r) < 0)  ) {
      this.xVel *= -1;
    }
    if (  ((this.y + this.yVel + this.r) > canvas3.height) || ((this.y + this.yVel - this.r) < 0)  ) {
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
      this.arcs.push( new Arc(getRandomIntInclusive(randRad, canvas3.width-randRad), getRandomIntInclusive(randRad, canvas1.height-randRad), randRad, randColor('hex')) );
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

///////////////////
// HELPER FUNCTIONS
///////////////////
function getRadianAngle(degreeValue) {
  return degreeValue * Math.PI / 180;
}

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

function clearCanvas(num) {
  switch(num) {
    case 1:
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
        break;
    case 2:
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        break;
    case 3:
        ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
        break;
    default:
        console.log('opps that\'s not a canvas identifier');
}

}

//////////////////////////////////////////////////////////////////////////////////
// GAME LOOP 2.0
//////////////////////////////////////////////////////////////////////////////////
function aLoop(newtime) {

  // pause
  if (aLoopPause) {
    myReq1 = requestAnimationFrame(aLoop);
    return;
  }

  // calc elapsed time since last loop
  now = newtime;
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
      // Get ready for next frame by setting then=now, but...
      // Also, adjust for fpsInterval not being multiple of 16.67
      then = now - (elapsed % fpsInterval);

      clearCanvas(1);
      myGradAnim.update();
  }
  myGradAnim.draw();
  myReq1 = requestAnimationFrame(aLoop);
}


// prepare the loop to start based on current state
function aLoopInit(fps) {
  fpsInterval = (1000 / fps);  // number of milliseconds per frame
  then = window.performance.now();
  startTime = then;
  console.log(startTime);
  aLoopPause = false;
  if (myReq1 !== undefined) {
    cancelAnimationFrame(myReq1);
  }
  myReq1 = requestAnimationFrame(aLoop);
}

//////////////////////////////////////////////////////////////////////////////////
// FRONT
//////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

  canvas1 = $('#canvas1')[0];
  canvas2 = $('#canvas2')[0];
  ctx1 = canvas1.getContext('2d');
  ctx2 = canvas2.getContext('2d');

  $('#start1').click(function() {
    console.log('loop started');
    // GradAnim(barCount = 20, maxSpeed = 20, color1 = 'lightblue', color2 = 'green', rotation = 0)
    // myGradAnim = new GradAnim(20,10,'lightblue','yellow', 0);
    myGradAnim = new GradAnim(20,10,randColor('rgba'),randColor('rgba'), 0);
    myGradAnim.init();
    console.log('current color1 = ', myGradAnim.color1);
    console.log('current color2 = ', myGradAnim.color2);
    aLoopInit(60);
  });

  $('#pause1').click(function() {
    console.log('loop paused');
    if (!aLoopPause) {
      aLoopPause = true;
    } else {
      aLoopPause = false;
    }
  });

  $('#reset1').click(function() {
    console.log('loop reset');
    cancelAnimationFrame(myReq1);
    clearCanvas(1);
  });

});

//// Game Loop 1.0
// function aLoop(newtime) {
//     // chill, if it hasn't been long enough
//     if (newtime < lastFrameTimeMs + (1000 / fps)) {
//         myReq = requestAnimationFrame(aLoop);
//         return;
//     }
//     // draw stuff if not paused
//     if (!aLoopPause) {
//       clearCanvas();
//       // drawDisco(4);
//       myGradAnim.update();
//       myGradAnim.draw();
//     }
//     lastFrameTimeMs = newtime;
//     myReq = requestAnimationFrame(aLoop);
//     return;
// }


// really cool color pairs

// current color1 =  rgba(17,248,200,1)
// current color2 =  rgba(176,83,227,1)

// current color1 =  rgba(251,45,211,1)
// current color2 =  rgba(18,199,2,1)

// current color1 =  rgba(52,195,224,1)
// current color2 =  rgba(246,72,16,1)

// current color1 =  rgba(163,214,159,1)
// current color2 =  rgba(228,248,154,1)

// current color1 =  rgba(132,175,224,1)
// current color2 =  rgba(251,200,166,1)
