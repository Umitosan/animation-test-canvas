/*jshint esversion: 6 */

var canvas1 = $('#canvas1')[0], // canvas must be defined here for backend functions
    ctx1, // canvas.getContext('2d')
    aLoop1,
    myGradAnim;
var canvas2 = $('#canvas2')[0],
    ctx2,
    aLoop2,
    myDisco;
var canvas3 = $('#canvas3')[0],
    ctx3,
    aLoop3,
    myArcGroup;
var canvas4 = $('#canvas4')[0],
    ctx4,
    aLoop4,
    myMandala;
var canvas5 = $('#canvas5')[0],
    ctx5,
    aLoop5,
    mySpriteGroup;

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
};

function TxtBox(x,y,font,color) {
  this.x = x;
  this.y = y;
  this.font = font;
  this.color = color;

  this.draw = function() {
    ctx1.font = this.font;
    ctx1.fillStyle = this.color;
    ctx1.fillText("Sorted!",this.x,this.y);
  };
}

// GradBar is two gradients whose edges touch and have the same thickness in a way to make an interesting single bar of color
function GradBar(context,grad1,grad1stopA,grad1stopB,rect1,grad2,grad2stopA,grad2stopB,rect2,speed,center) {
  this.ctx = context;
  this.grad1 = grad1;
  this.grad1stopA = grad1stopA;
  this.grad1stopB = grad1stopB;
  this.rect1 = rect1;
  this.grad2 = grad2;
  this.grad2stopA = grad2stopA;
  this.grad2stopB = grad2stopB;
  this.rect2 = rect2;
  this.speed = speed;   // speed is pixels per second
  this.center = center;

  this.draw = function() {
    let gradient1 = this.ctx.createLinearGradient(this.grad1.x0, this.grad1.y0, this.grad1.x1, this.grad1.y1); // ctx.createLinearGradient(x0, y0, x1, y1);
    gradient1.addColorStop(this.grad1stopA.offset, this.grad1stopA.color);  // void gradient.addColorStop(offset, color);
    gradient1.addColorStop(this.grad1stopB.offset, this.grad1stopB.color);
    this.ctx.fillStyle = gradient1;
    this.ctx.fillRect(this.rect1.x0, this.rect1.y0, this.rect1.x1, this.rect1.y1);
    let gradient2 = this.ctx.createLinearGradient(this.grad2.x0, this.grad2.y0, this.grad2.x1, this.grad2.y1); // ctx.createLinearGradient(x0, y0, x1, y1);
    gradient2.addColorStop(this.grad2stopA.offset, this.grad2stopA.color);  // void gradient.addColorStop(offset, color);
    gradient2.addColorStop(this.grad2stopB.offset, this.grad2stopB.color);
    this.ctx.fillStyle = gradient2;
    this.ctx.fillRect(this.rect2.x0, this.rect2.y0, this.rect2.x1, this.rect2.y1);
  }; // draw
} // GradBar

function GradAnim(context, barCount = 20, speed = 20, color1 = 'lightblue', color2 = 'green', rotation = 0) {
  this.ctx = context;
  this.barCount = barCount;
  this.speed = speed; // pixels per second
  this.color1 = color1;
  this.color2 = color2;
  this.rotation = rotation;
  this.bars = [];

  this.init = function() {
    let c1 = this.color1;
    let c2 = this.color2;
    for (let i = 0 ; i < this.barCount ; i++) {
      let randCenter = getRandomIntInclusive(10,canvas1.width-10);
      let sp = getRandomIntInclusive(1,this.speed);
      let topY = (canvas1.height/barCount)*(i);
      let botY = (canvas1.height/barCount)*(1+i);
      // REF: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient
      let bar = new GradBar(  /*context*/    this.ctx,
                              /*grad1*/      { x0: 0, y0: 0, x1: randCenter, y1: 0 },  // ctx.createLinearGradient(x0, y0, x1, y1);
                              /*grad1stopA*/ { offset: 0, color: c1 },  // void gradient.addColorStop(offset, color);
                              /*grad1stopB*/ { offset: 1, color: c2 },
                              /*rect1*/      { x0: 0, y0: topY, x1: randCenter, y1: botY},
                              /*grad2*/      { x0: randCenter, y0: 0, x1: canvas1.width, y1: 0 },
                              /*grad2stopA*/ { offset: 0, color: c2 },
                              /*grad2stopB*/ { offset: 1, color: c1 },
                              /*rect2*/      { x0: randCenter, y0: topY, x1: canvas1.width, y1: botY},
                              /*speed*/      sp,
                              /*center*/     randCenter
                            );
    this.bars.push(bar);
    } // for
  }; // init
  this.draw = function() {
    for (let i = 0 ; i < this.bars.length ; i++) {
      // rotate before drawing
      if (this.rotation !== 0) {
        this.ctx.translate(canvas1.width/2, canvas1.width/2);
        this.ctx.rotate(getRadianAngle(this.rotation));
        this.ctx.translate(-canvas1.width/2, -canvas1.width/2);
      }
      this.bars[i].draw();
      // rotate back for other calculations to perform correctly
      if (this.rotation !== 0) {
        this.ctx.translate(canvas1.width/2, canvas1.width/2);
        this.ctx.rotate(getRadianAngle(this.rotation*-1));
        this.ctx.translate(-canvas1.width/2, -canvas1.width/2);
      }
    } // for
  }; // draw
  this.update = function() {
    for (let i = 0 ; i < this.bars.length ; i++) {  // update postions for each bar
      if (  ((this.bars[i].center+this.bars[i].speed-10) < 0) || ((this.bars[i].center+this.bars[i].speed+10) > canvas1.width) ) {  // test bound collision
        this.bars[i].speed *= -1; // change direction
      } else { // update the new location
        this.bars[i].center += this.bars[i].speed;
        let c = this.bars[i].center;
        this.bars[i].grad1.x1 = c;
        this.bars[i].rect1.x1 = c;
        this.bars[i].grad2.x0 = c;
        this.bars[i].rect2.x0 = c;
      } // if
    } // for
  }; // update
} // gradAnim

function Disco(context, rowSize = 4) {
  this.ctx = context;
  this.rowSize = rowSize;
  this.squareSize = canvas2.width/rowSize;
  this.txtColor = randColor('rgba');
  this.boxColors = [];
  this.boxColorsInner = [];

  this.init = function() {
    for (let q = 0; q < (rowSize*rowSize); q++) {
      let randC = randColor('rgba');
      this.boxColors.push(randC);
      this.boxColorsInner.push(invertRGBAstr(randC));
    }
  };  // init
  this.draw = function() {
    for (let i = 0; i < rowSize; i++) {
      for (let j = 0; j < rowSize; j++) {
        // this.ctx.fillStyle = this.boxColors[i+j]; // diagonal bars
        // this.ctx.fillStyle = this.boxColors[j]; // vertical bars
        // this.ctx.fillStyle = this.boxColors[i]; // horizontal bars
        // this.ctx.fillStyle = this.boxColors[j]; // horizontal bars
        this.ctx.fillStyle = this.boxColors[(i*rowSize)+j]; // all different
        this.ctx.fillRect(j*this.squareSize,i*this.squareSize,this.squareSize,this.squareSize);  // void ctx.fillRect(x, y, width, height);
        // draw inner box
        this.ctx.fillStyle = this.boxColorsInner[(i*rowSize)+j];
        this.ctx.fillRect( (j*this.squareSize)+(this.squareSize/4) , (i*this.squareSize)+(this.squareSize)/4 ,this.squareSize/2,this.squareSize/2);
      }
    }
    this.ctx.fillStyle = this.txtColor;
    this.ctx.font = '60px Georgia';
    this.ctx.textAlign = 'center';
    this.ctx.save();
    for (let i = 0; i < 4; i++) { // rotate 4 times, printing the txt
      this.ctx.translate(canvas2.width/2, canvas2.height/2);  // translate to center
      this.ctx.rotate(Math.PI/2); // rotate 90 deg (but in RAD) about the center point
      this.ctx.translate(-canvas2.width/2, -canvas2.height/2);  // translate back
      this.ctx.textAlign = "center";
      this.ctx.fillText('Disco',canvas2.width/2,50);
    }
    this.ctx.restore();
  };  // draw
  this.update = function() {
    for (let k = 0; k < this.boxColors.length; k++) {
      let randC = randColor('rgba');
      this.boxColors[k] = randC;
      this.boxColorsInner[k] = invertRGBAstr(randC);
    }
    // update txt
    this.txtColor = randColor('rgba');
  };  // update
} // disco

function Arc(x,y,r,color,context) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.lineW = 2;
  this.color = color;
  this.ctx = context;
  this.sAngle = 0;
  this.eAngle = 2 * Math.PI;
  this.xVel = getRandomIntInclusive(1,2)*randSign(); // rand speed and direction
  this.yVel = getRandomIntInclusive(1,2)*randSign(); // rand speed and direction

  this.draw = function() {
    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // sAngle	The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
    // eAngle	The ending angle, in radians
    // counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.
    ctx3.beginPath();
    ctx3.fillStyle = this.color;
    ctx3.strokeStyle = invertRGBAstr(this.color);
    ctx3.lineWidth = this.lineW;
    ctx3.arc(this.x,this.y,this.r,this.sAngle,this.eAngle);
    ctx3.fill();
    ctx3.stroke();
  }; // draw

  this.update = function() {
    if (  ((this.x + this.xVel + this.r + this.lineW) > canvas3.width) || ((this.x + this.xVel - this.r - this.lineW) < 0)  ) {
      this.xVel *= -1;
    }
    if (  ((this.y + this.yVel + this.r) > canvas3.height) || ((this.y + this.yVel - this.r) < 0)  ) {
      this.yVel *= -1;
    }
    this.x += this.xVel;
    this.y += this.yVel;
  }; // update
} // Arc

function ArcGroup(quantity, context) {
  this.arcs = [];
  this.context = context;

  this.init = function() {
    for (let i = 0; i < quantity; i++) {
      let randRad = getRandomIntInclusive(2, 32);
      //  arc(x,y,radius,startAngle,endAngle,);
      this.arcs.push( new Arc(getRandomIntInclusive(randRad, canvas3.width-randRad),
                              getRandomIntInclusive(randRad, canvas3.height-randRad),
                              randRad,
                              randColor('rgba'),
                              this.context
                     ));
    }
  };

  this.draw = function() {
    for (let i = 0; i < this.arcs.length; i++) {
      this.arcs[i].draw();
    }
  };

  this.update = function() {
    for (let i = 0; i < this.arcs.length; i++) {
      this.arcs[i].update();
    }
  };
} // Circles

function Mandala(context) {
  this.ctx = context;
  this.color = randColor('rgba');
  this.x1 = 94; this.y1 = 94; this.width1 = 212; this.height1 = 212;
  this.x2 = 180; this.y2 = 180; this.width2 = 94; this.height2 = 94;
  this.x3 = 50; this.y3 = 50; this.width3 = 316; this.height3 = 316;
  this.angleRad = 0;  // angle of rotation in radians, 0.0174533 rad ~ 1 degree
  this.rotV = 0.0174533/6;  // rotational velocity
  this.updateCount = 0;
  this.colorFreq = 80; // update() run / 1 color change
  this.draw = function() {
    for (let i=0; i<10; i++) {
      this.ctx.save();
      this.ctx.strokeStyle = this.color;
      this.ctx.translate(canvas4.width/2, canvas4.height/2);  // translate to center
      this.ctx.rotate(this.angleRad*(i+0.05)); // rotate 90 deg (but in RAD) about the center point
      this.ctx.translate(-canvas4.width/2, -canvas4.height/2);  // translate back
      this.ctx.strokeRect(this.x1,this.y1,this.width1,this.height1);  // void ctx.fillRect(x, y, width, height);
      this.ctx.strokeStyle = invertRGBAstr(this.color);
      this.ctx.strokeRect(this.x2,this.y2,this.width2,this.height2);  // void ctx.fillRect(x, y, width, height);
      this.ctx.strokeRect(this.x3,this.y3,this.width3,this.height3);  // void ctx.fillRect(x, y, width, height);
      this.ctx.restore();
    }
  };
  this.update = function() {
    if (this.updateCount > this.colorFreq) {
      this.color = randColor('rgba');
      this.updateCount = 0;
    }
    this.angleRad += this.rotV;
    this.updateCount += 1;
  };
}

function Sprite(context,sheet,sWidth,sHeight,dWidth,dHeight,x,y,frameTotal,curFrame,duration) {
  this.ctx = context;
  this.spriteSheet = sheet;
  this.spriteWidth = sWidth;
  this.spriteHeight = sHeight;
  this.displayWidth = dWidth;
  this.displayHeight = dHeight;
  this.destX = x;
  this.destY = y;
  this.frameTotal = frameTotal;
  this.curFrame = curFrame;
  this.frameDuration = duration;
  this.timeCount = 0;

  this.init = function() {
  }; // init
  this.draw = function() {
    // console.log('drawing frame ', this.curFrame);
    // simple draw image:     drawImage(image, x, y)
    // draw slice of image:   drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    this.ctx.drawImage( /*image*/   this.spriteSheet,
                        /* sx */    (this.spriteWidth*this.curFrame), // read sprite shit right to left like this:  (this.spriteWidth*this.frameTotal-this.spriteWidth) - (this.spriteWidth*this.curFrame)
                        /* sy */    0,
                        /*sWidth*/  this.spriteWidth,
                        /*sHeight*/ this.spriteHeight,
                        /* dx */    this.destX,
                        /* dy */    this.destY,
                        /*dWidth*/  this.displayWidth,
                        /*dHidth*/  this.displayHeight );
  }; // draw
  this.update = function() {
    if (this.timeCount >= this.frameDuration) {
      this.timeCount = 0;
      // console.log("frame ending = ", this.curFrame );
      this.curFrame = ( (this.curFrame >= this.frameTotal-1) ? (0) : (this.curFrame + 1) );
      // console.log("frame starting = ", this.curFrame);
    } else {
      this.timeCount += 1;
    }
  }; // update
}

function SpriteGroup(ctx,src,sWidth,sHeight,dWidth,dHeight,frameT,duration) {
  this.ctx = ctx;
  this.spriteSheet = new Image();
  this.spriteSheet.src = src;
  this.spriteWidth = sWidth;
  this.spriteHeight = sHeight;
  this.displayWidth = dWidth;
  this.displayHeight = dHeight;
  this.frameTotal = frameT;
  this.frameDuration = duration;
  this.spriteArr = [];

  this.init = function() {
    let colTotal = Math.floor(canvas5.width / this.displayWidth);
    let rowTotal = Math.floor(canvas5.height / this.displayHeight);
    let xGapOffset = (canvas5.width % this.displayWidth) / 2;
    let yGapOffset = (canvas5.height % this.displayHeight) / 2;
    let frameCounter = 4;
    for (let r=0; r<rowTotal; r++) {
      for (let c=0; c<colTotal; c++) {
        // Sprite(context,sheet,sWidth,sHeight,dWidth,dHeight,x,y,frameTotal,curFrame,duration)
        this.spriteArr.push( new Sprite(  /* context */    this.ctx,
                                          /* sheet */      this.spriteSheet,
                                          /* sWidth */      this.spriteWidth,
                                          /* sHeight */     this.spriteHeight,
                                          /* dWidth */      this.displayWidth,
                                          /* dHeight */     this.displayHeight,
                                          /* x */          (this.displayWidth * c)+xGapOffset,
                                          /* y */          (this.displayHeight * r)+yGapOffset,
                                          /* frameTotal */ this.frameTotal,
                                          /* curFrame */   frameCounter,
                                          /* duration */   this.frameDuration )
                            );
        frameCounter = ( (frameCounter >= this.frameTotal-1) ? (0) : (frameCounter + 1) );  // cycles between 0 and 7 for example, staggering the beginning frame for effect
      }
    }
  }; // init
  this.draw = function() {
    for (let i=0; i<this.spriteArr.length; i++) {
      this.spriteArr[i].draw();
    }
  };
  this.update = function() {
    for (let i=0; i<this.spriteArr.length; i++) {
      this.spriteArr[i].update();
    }
  };
}

///////////////////
// HELPER FUNCTIONS
///////////////////
function getRadianAngle(degreeValue) {
  return degreeValue * Math.PI / 180;
}

function randSign() {
  let num = getRandomIntInclusive(1,2);
  if (num === 1) {
    return 1;
  } else {
    return -1;
  }
}

function randColor(type) {
  // more muted colors example
      // return ( "#" + Math.round((getRandomIntInclusive(0,99999999) + 0x77000000)).toString(16) );
  // full spectum below
  if (type === 'hex') {
    return ( "#" + Math.round((getRandomIntInclusive(0,0xffffff))).toString(16) );
  } else if (type === 'rgba') {
    return ( 'rgba('+ getRandomIntInclusive(0,255) +','+ getRandomIntInclusive(0,255) +','+ getRandomIntInclusive(0,255) +','+1+')' );
  } else {
    console.log("Not valid option for randColor()");
    return undefined;
  }
}

function invertRGBAstr(str) {
  let arr1 = str.slice(5,-1); // arr1 = "173,216,230,0.2"
  let arr2 = arr1.split(','); // arr2 = ["173","216","230","0.2"]
  let r = -1 * arr2[0] + 255;
  let g = -1 * arr2[1] + 255;
  let b = -1 * arr2[2] + 255;
  let a = arr2[3];
  return 'rgba('+r+','+g+','+b+','+a+')';
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function clearCanvas(context) {
  if (context) {
    context.clearRect(0, 0, canvas1.width, canvas1.height);
  } else {
    console.log('opps that\'s not a canvas context');
  }
}

//////////////////////////////////////////////////////////////////////////////////
// GAME LOOP 3.0
//////////////////////////////////////////////////////////////////////////////////
function AnimLoop(context, animObj) {
  this.ctx = context;
  this.index = undefined;
  this.paused = true;
  this.now = undefined;
  this.startTime = undefined;
  this.elapsed = undefined;
  this.fps = undefined;
  this.fpsInterval = undefined;
  this.reqAnimFrame = undefined;
  this.animObj = animObj;

  // prepare the loop to start based on current state
  this.init = function(fps,someIndex) {
    this.fps = fps;
    this.index = someIndex;
    this.fpsInterval = (1000 / fps);
    this.then = window.performance.now();
    this.startTime = this.then;
    this.paused = false;
    if (this.reqAnimFrame !== undefined) {
      cancelAnimationFrame(this.reqAnimFrame);
    }
    // this.reqAnimFrame = requestAnimationFrame(this.animate);
  };

  this.startAn = function() {
    this.reqAnimFrame = requestAnimationFrame(this.animate);
  };

  this.animate = (newtime) => { // MUST USE arrow function here or the context of 'this' will be 'window' instead of AnimLoop
    if (this.paused) {
      this.reqAnimFrame = requestAnimationFrame(this.animate);
      return;
    }
    // calc elapsed time since last loop
    this.now = newtime;
    this.elapsed = this.now - this.then;
    // if enough time has elapsed, draw the next frame
    if (this.elapsed > this.fpsInterval) {
        // console.log('AnimLoop update');
        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        this.then = this.now - (this.elapsed % this.fpsInterval);
        clearCanvas(this.ctx);
        this.animObj.update();
    }
    this.animObj.draw();
    this.reqAnimFrame = requestAnimationFrame(this.animate);
  }; // this.animate
} // AnimLoop

//////////////////////////////////////////////////////////////////////////////////
// FRONT
//////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
  // instanciate any number of canvas' properly and set the context for looop instanciation
  // assumes that canvas' are in order from top to bottom
  // AKA
  // var canvas1 = $('#canvas1')[0];
  // var ctx1 = window.canvas1.getContext('2d');
  $("canvas").each(function(index,el) {
    let canvasVar = 'canvas'+(index+1);
    let ctxVar = 'ctx'+(index+1);
    window[canvasVar] = el;
    window[ctxVar] = window[canvasVar].getContext('2d');
  });

  /////
  //// Group 1
  ////
  $('#start1').click(function() {
    if (!aLoop1) {
      console.log('loop1 started');
      clearCanvas(ctx1);
      // GradAnim(barCount = 20, speed = 20, color1 = 'lightblue', color2 = 'green', rotation = 0)
      // myGradAnim = new GradAnim(20,10,'lightblue','yellow', 0);
      myGradAnim = new GradAnim(ctx1,20,10,randColor('rgba'),randColor('rgba'), 0);
      myGradAnim.init();
      console.log('current color1 = ', myGradAnim.color1);
      console.log('current color2 = ', myGradAnim.color2);
      aLoop1 = new AnimLoop(ctx1,myGradAnim);   // AnimLoop(context, animObj)
      aLoop1.init(50,1);    // this.init = function(fps,someIndex)
      aLoop1.startAn();
    }
  });
  $('#pause1').click(function() {
    if (aLoop1) {
      console.log('loop1 pause toggle');
      aLoop1.paused = (!aLoop1.paused ? true : false);
    }
  });
  $('#reset1').click(function() {
    console.log('loop1 reset');
    if (aLoop1) {
      console.log('loop1 reset');
      cancelAnimationFrame(aLoop1.reqAnimFrame);
      aLoop1 = undefined;
      clearCanvas(ctx1);
    }
  });

  /////
  //// Group 2
  ////
  $('#start2').click(function() {
    if (!aLoop2) {
      console.log('loop2 started');
      clearCanvas(ctx2);
      myDisco = new Disco(ctx2,5);
      myDisco.init();
      aLoop2 = new AnimLoop(ctx2,myDisco);   // AnimLoop(context, animObj)
      aLoop2.init(6,2);    // this.init = function(fps,someIndex)
      aLoop2.startAn();
    }
  });
  $('#pause2').click(function() {
    if (aLoop2) {
      console.log('loop2 pause toggle');
      aLoop2.paused = (!aLoop2.paused ? true : false);
    }
  });
  $('#reset2').click(function() {
    if (aLoop2) {
      console.log('loop2 reset');
      cancelAnimationFrame(aLoop2.reqAnimFrame);
      aLoop2 = undefined;
      clearCanvas(ctx2);
    }
  });

  /////
  //// Group 3
  ////
  $('#start3').click(function() {
    if (!aLoop3) {
      console.log('loop3 started');
      clearCanvas(ctx3);
      myArcGroup = new ArcGroup(20,ctx3);  // ArcGroup(quantity)
      myArcGroup.init();
      aLoop3 = new AnimLoop(ctx3, myArcGroup);  // AnimLoop(context, animObj)
      aLoop3.init(60,3);   // this.init = function(fps,someIndex)
      aLoop3.startAn();
    }
  });
  $('#pause3').click(function() {
    if (aLoop3) {
      console.log('loop3 pause toggle');
      aLoop3.paused = (!aLoop3.paused ? true : false);
    }
  });
  $('#reset3').click(function() {
    if (aLoop3) {
      console.log('loop3 reset');
      cancelAnimationFrame(aLoop3.reqAnimFrame);
      aLoop3 = undefined;
      clearCanvas(ctx3);
    }
  });

  /////
  //// Group 4
  ////
  $('#start4').click(function() {
    if (!aLoop4) {
      console.log('loop4 started');
      clearCanvas(ctx4);
      myMandala = new Mandala(ctx4);
      aLoop4 = new AnimLoop(ctx4,myMandala);   // AnimLoop(context, animObj)
      aLoop4.init(60,4);    // this.init = function(fps,someIndex)
      aLoop4.startAn();
    }
  });
  $('#pause4').click(function() {
    if (aLoop4) {
      console.log('loop4 pause toggle');
      aLoop4.paused = (!aLoop4.paused ? true : false);
    }
  });
  $('#reset4').click(function() {
    if (aLoop4) {
      console.log('loop4 reset');
      cancelAnimationFrame(aLoop4.reqAnimFrame);
      aLoop4 = undefined;
      clearCanvas(ctx4);
    }
  });

  /////
  //// Group 4
  ////
  $('#start5').click(function() {
    if (!aLoop5) {
      console.log('loop5 started');
      clearCanvas(ctx5);
      // SpriteGroup(ctx,src,sWidth,sHeight,dWidth,dHeight,frameT,duration)
      mySpriteGroup = new SpriteGroup(ctx5,'img/blue1anim.png',64,64,40,40,8,2);
      mySpriteGroup.init();  //
      aLoop5 = new AnimLoop(ctx5,mySpriteGroup);   // AnimLoop(context, animObj)
      aLoop5.init(60,5);    // this.init = function(fps,someIndex)
      aLoop5.startAn();
    }
  });
  $('#pause5').click(function() {
    if (aLoop5) {
      console.log('loop5 pause toggle');
      aLoop5.paused = (!aLoop5.paused ? true : false);
    }
  });
  $('#reset5').click(function() {
    if (aLoop5) {
      console.log('loop5 reset');
      cancelAnimationFrame(aLoop5.reqAnimFrame);
      aLoop5 = undefined;
      clearCanvas(ctx5);
    }
  });

});

//// Game Loop 2.0  (init + loop)
// function aLoop1(newtime1) {
//   // pause
//   if (aLoop1Pause) {
//     myReq1 = requestAnimationFrame(aLoop1);
//     return;
//   }
//   // calc elapsed time since last loop
//   now1 = newtime1;
//   elapsed1 = now1 - then1;
//
//   // if enough time has elapsed, draw the next frame
//   if (elapsed1 > fpsInterval1) {
//       // Get ready for next frame by setting then=now, but...
//       // Also, adjust for fpsInterval not being multiple of 16.67
//       then1 = now1 - (elapsed1 % fpsInterval1);
//       clearCanvas(ctx1);
//       myGradAnim.update();
//   }
//   myGradAnim.draw();
//   myReq1 = requestAnimationFrame(aLoop1);
// }

// prepare the loop to start based on current state
// function aLoop1Init(fps1) {
//   fpsInterval1 = (1000 / fps1);  // number of milliseconds per frame
//   then1 = window.performance.now();
//   startTime1 = then1;
//   aLoop1Pause = false;
//   if (myReq1 !== undefined) {
//     cancelAnimationFrame(myReq1);
//   }
//   myReq1 = requestAnimationFrame(aLoop1);
// }


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

/*
cool color bar pairs

current color1 =  rgba(17,248,200,1)
current color2 =  rgba(176,83,227,1)

current color1 =  rgba(251,45,211,1)
current color2 =  rgba(18,199,2,1)

current color1 =  rgba(52,195,224,1)
current color2 =  rgba(246,72,16,1)

 current color2 =  rgba(228,248,154,1)
 current color1 =  rgba(163,214,159,1)

 current color1 =  rgba(132,175,224,1)
 current color2 =  rgba(251,200,166,1)

 tangerine
 current color1 =  rgba(215,177,187,1)
 current color2 =  rgba(165,253,50,1)

 soft retro
 current color1 =  rgba(74,162,188,1)
 current color2 =  rgba(201,149,204,1)

 blue brown
 current color1 =  rgba(10,194,222,1)
 current color2 =  rgba(132,80,24,1)

another blue brown
current color1 =  rgba(25,151,254,1)
current color2 =  rgba(85,71,3,1)

 */
