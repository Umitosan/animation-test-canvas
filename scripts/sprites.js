/*jshint esversion: 6 */


var canvas5 = document.getElementById('canvas5'),
    ctx5,
    aLoop5,
    mySpriteGroup;
var canvas6 = document.getElementById('canvas6'),
    ctx6,
    aLoop6,
    marioWalk;

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
  this.curFrameIndex = frame0; // only used by tiled=false
  this.frameDuration = duration;
  this.tiled = tiled;
  this.startTime = null;
  this.curTime = null;
  this.spriteArr = [];

  this.init = function() {  // init slices up the sprite sheet into interatable frames of animation
    this.startTime = performance.now();
    if (this.tiled) {  // tiled option will fill canvas according to canvW by canvH
      let tiledCounter = this.frame0;
      var colTotal = Math.floor(this.canvW / this.displayWidth);
      var rowTotal = Math.floor(this.canvH / this.displayHeight);
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
      this.spriteArr.push({ sx: (this.frame0*this.spriteWidth),
                            sy: 0,
                            dx: xGapOffset,
                            dy: yGapOffset,
                          });
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
                          /* sx */    this.spriteArr[0].sx, // read sprite shit right to left like this:  (this.spriteWidth*this.frameTotal-this.spriteWidth) - (this.spriteWidth*this.curFrameIndex)
                          /* sy */    this.spriteArr[0].sy,
                          /*sWidth*/  this.spriteWidth,
                          /*sHeight*/ this.spriteHeight,
                          /* dx */    this.spriteArr[0].dx,
                          /* dy */    this.spriteArr[0].dy,
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
          } else { // not tiled - single spirte
            if ( ((this.curFrameIndex + 1) > (this.frame0 + this.frameTotal)) ) {
              // console.log('curFrameIndex flipped');
              this.curFrameIndex = this.frame0;
              this.spriteArr[0].sx = this.frame0 * this.spriteWidth;
            } else {
              this.curFrameIndex += 1;
              this.spriteArr[0].sx = (this.curFrameIndex*this.spriteWidth);
            } // if
            // console.log('this.curFrameIndex = ', this.curFrameIndex);
            // console.log('this.spriteArr[0].sx = ', this.spriteArr[0].sx);
            // console.log('time dif = ', performance.now()-this.startTime);
          } // if
    } // if
  };  // update

} // SpriteGroup
