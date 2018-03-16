/*jshint esversion: 6 */


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
