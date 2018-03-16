/*jshint esversion: 6 */


var canvas5 = $('#canvas5')[0],
    ctx5,
    aLoop5,
    mySpriteGroup;
var canvas6 = $('#canvas6')[0],
    ctx6,
    aLoop6,
    marioWalk;

// function Sprite(x,y,frameTotal,frame0,curFrame,duration) {
//   this.destX = x;
//   this.destY = y;
//   this.frameTotal = frameTotal;
//   this.frame0 = frame0;
//   this.curFrame = curFrame;
//   this.frameDuration = duration;
//   this.timeCount = 0;
//
//   this.draw = function() {
//     this.ctx.imageSmoothingEnabled = false;  // turns off AntiAliasing
//     // console.log('drawing frame ', this.curFrame);
//     // simple draw image:     drawImage(image, x, y)
//     // draw slice of image:   drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
//     this.ctx.drawImage( /*image*/   this.spriteSheet,
//                         /* sx */    (this.spriteWidth*this.curFrame), // read sprite shit right to left like this:  (this.spriteWidth*this.frameTotal-this.spriteWidth) - (this.spriteWidth*this.curFrame)
//                         /* sy */    0,
//                         /*sWidth*/  this.spriteWidth,
//                         /*sHeight*/ this.spriteHeight,
//                         /* dx */    this.destX,
//                         /* dy */    this.destY,
//                         /*dWidth*/  this.displayWidth,
//                         /*dHidth*/  this.displayHeight );
//   }; // draw
// }

function SpriteGroup(ctx,canvW,canvH,src,sWidth,sHeight,dWidth,dHeight,frameT,frame0,duration,tiled) {
  this.ctx = ctx;
  this.canvW = canvW;
  this.canvH = canvH;
  this.spriteSheet = new Image();
  this.spriteSheet.src = src;
  this.spriteWidth = sWidth;
  this.spriteHeight = sHeight;
  this.displayWidth = dWidth;
  this.displayHeight = dHeight;
  this.frameTotal = frameT;
  this.frame0 = frame0;
  this.curFrameIndex = 0;
  this.frameDuration = duration;
  this.tiled = tiled;
  this.startTime = null;
  this.curTime = null;
  this.timeCount = 0;
  this.spriteArr = [];

  this.init = function() {  // init slices up the sprite sheet into interatable frames of animation
    this.startTime = performance.now();
    if (this.tiled) {  // tiled option will fill canvas according to canvW by canvH
      let tiledCounter = this.frame0;
      var colTotal = Math.floor(this.canvW / this.displayWidth);
      var rowTotal = Math.floor(this.canvH / this.displayHeight);
      console.log('colTotal = ', colTotal);
      console.log('rowTotal = ', rowTotal);
      for (let r=0; r<rowTotal; r++) {
        for (let c=0; c<colTotal; c++) {
          this.spriteArr.push({ sx: (this.frame0*this.spriteWidth) + (tiledCounter*this.spriteWidth),
                                sy: 0,
                                dx: this.frame0 + (this.displayWidth * c),
                                dy: this.frame0 + (this.displayHeight * r),
                              });
          // cycles between 0 and 7 for example, staggering the beginning frame for effect
          tiledCounter = ( (tiledCounter >= this.frameTotal-1) ? (this.frame0) : (tiledCounter + 1) );
        }
      }
    } else { // not tiled
      let xGapOffset = (this.canvW - this.displayWidth) / 2;
      let yGapOffset = (this.canvH - this.displayHeight) / 2;
      for (let i=0; i < this.frameTotal; i++) {
        this.spriteArr.push({ sx: (this.frame0 * this.canvW) + (i * this.spriteWidth),
                              sy: 0,
                              dx: xGapOffset,
                              dy: yGapOffset,
                            });
      } // for
    } // if
  }; // init

  this.draw = function() {
    // console.log('this.spriteArr = ', this.spriteArr);
    // console.log('this.curFrameIndex ', this.curFrameIndex );
    this.ctx.imageSmoothingEnabled = false;  // turns off AntiAliasing
    // simple draw image:     drawImage(image, x, y)
    // draw slice of image:   drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    if (this.tiled) {
      for (let i=0; i<this.spriteArr.length; i++) {
        this.ctx.drawImage( /*image*/   this.spriteSheet,
                            /* sx */    this.spriteArr[i].sx,
                            /* sy */    this.spriteArr[i].sy,
                            /*sWidth*/  this.spriteWidth,
                            /*sHeight*/ this.spriteHeight,
                            /* dx */    this.spriteArr[i].dx,
                            /* dy */    this.spriteArr[i].dy,
                            /*dWidth*/  this.displayWidth,
                            /*dHidth*/  this.displayHeight );
      } // for
    } else {
      this.ctx.drawImage( /*image*/   this.spriteSheet,
                          /* sx */    this.spriteArr[this.curFrameIndex].sx, // read sprite shit right to left like this:  (this.spriteWidth*this.frameTotal-this.spriteWidth) - (this.spriteWidth*this.curFrameIndex)
                          /* sy */    this.spriteArr[this.curFrameIndex].sy,
                          /*sWidth*/  this.spriteWidth,
                          /*sHeight*/ this.spriteHeight,
                          /* dx */    this.spriteArr[this.curFrameIndex].dx,
                          /* dy */    this.spriteArr[this.curFrameIndex].dy,
                          /*dWidth*/  this.displayWidth,
                          /*dHidth*/  this.displayHeight );
    }
  };

  this.update = function() {
    this.curTime = performance.now();
    if ( (this.curTime % this.frameDuration) < 17) {
          if (this.tiled) { // advance the frame of each sprite (sx property)
            for (let i=0; i<this.spriteArr.length; i++) {
              let newSX;
              if ( (this.spriteArr[i].sx + this.spriteWidth) > (this.spriteWidth * this.frameTotal-1) ) {
                newSX = 0;
              } else {
                newSX = (this.spriteArr[i].sx + this.spriteWidth);  // simply go to the next frame to the right
              }
              this.spriteArr[i].sx = newSX;
            } // for
          } else {
            for (let i=0; i<this.spriteArr.length; i++) {
              let sprite = this.spriteArr[i];
              // if (this.timeCount >= this.frameDuration) {
              // this.timeCount = 0;
              //   this.curFrameIndex = ( (this.curFrameIndex >= this.frameTotal-1) ? (0) : (this.curFrameIndex + 1) );
              // } else {
              //   this.timeCount += 1;
              // }
            } // for
          } // if
    } // if
  };  // update

} // SpriteGroup
