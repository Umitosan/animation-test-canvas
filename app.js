/*jshint esversion: 6 */


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
  mossGreen: 'rgba(140, 156, 9, 1)',
  coral: 'rgba(242, 137, 134, 1)'
};


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


  $('.scrollable').on('click', function(event) {
    // console.log('scrollable clicked');
    var target = $(this.getAttribute('href'));
    if( target.length ) {
      event.preventDefault();
      // console.log('target.offset().top = ', target.offset().top);
      if (target[0].getAttribute('id') === "scroll-top") {
        $('html, body').stop().animate({ scrollTop: (target.offset().top -120) }, 500); // 120 because of nav bar
      } else {
        $('html, body').stop().animate({ scrollTop: (target.offset().top -72) }, 500); // -53 to adjust for margin
      }
    }
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
      aLoop1.paused = (!aLoop1.paused);
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
      aLoop2.paused = (!aLoop2.paused);
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
      aLoop3.paused = (!aLoop3.paused);
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
      aLoop4.paused = (!aLoop4.paused);
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
  //// Group 5
  ////
  $('#start5').click(function() {
    if (!aLoop5) {
      console.log('loop5 started');
      clearCanvas(ctx5);
      // SpriteGroup(ctx,canvW,canvH,src,sWidth,sHeight,dWidth,dHeight,frameT,frame0,duration,tiled)
      mySpriteGroup = new SpriteGroup(/* ctx      */  ctx5,
                                      /* canvW    */  500,
                                      /* canvH    */  500,
                                      /* src      */  'img/blue1anim.png',
                                      /* sWidth   */  64,
                                      /* sHeight  */  64,
                                      /* dWidth   */  canvas5.width/10,
                                      /* dHeight  */  canvas5.width/10,
                                      /* frameT   */  8,
                                      /* frame0   */  0,
                                      /* duration */  70,
                                      /* tiled    */  true
                                     );
      mySpriteGroup.init();  //
      aLoop5 = new AnimLoop(ctx5,mySpriteGroup);   // AnimLoop(context, animObj)
      aLoop5.init(60,5);    // this.init = function(fps,someIndex)
      aLoop5.startAn();
    }
  });
  $('#pause5').click(function() {
    if (aLoop5) {
      console.log('loop5 pause toggle');
      aLoop5.paused = (!aLoop5.paused );
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

  /////
  //// Group 6
  ////
  $('#start6').click(function() {
    if (!aLoop6) {
      console.log('loop6 started');
      clearCanvas(ctx6);
      // SpriteGroup(ctx,canvW,canvH,src,sWidth,sHeight,dWidth,dHeight,frameT,frame0,duration,tiled)
      marioWalk = new SpriteGroup(    /* ctx      */  ctx6,
                                      /* canvW    */  500,
                                      /* canvH    */  500,
                                      /* src      */  'img/mario1walk.png',
                                      /* sWidth   */  20,
                                      /* sHeight  */  16,
                                      /* dWidth   */  200,
                                      /* dHeight  */  200,
                                      /* frameT   */  10,
                                      /* frame0   */  0,
                                      /* duration */  100,
                                      /* tiled    */  false
                                     );
      marioWalk.init();  //
      aLoop6 = new AnimLoop(ctx6,marioWalk);   // AnimLoop(context, animObj)
      aLoop6.init(60,6);    // function(fps,someIndex)
      aLoop6.startAn();
    }
  });
  $('#pause6').click(function() {
    if (aLoop6) {
      console.log('loop6 pause toggle');
      aLoop6.paused = (!aLoop6.paused );
    }
  });
  $('#reset6').click(function() {
    if (aLoop6) {
      console.log('loop6 reset');
      cancelAnimationFrame(aLoop6.reqAnimFrame);
      aLoop6 = undefined;
      clearCanvas(ctx6);
    }
  });

  /////
  //// Group 7
  ////
  $('#start7').click(function() {
    if (!aLoop7) {
      console.log('loop7 started');
      clearCanvas(ctx7);
      myInterpolation = new InterAnim(40); // interAnim(dotsGridWidth)
      myInterpolation.init();
      aLoop7 = new AnimLoop(ctx7,myInterpolation);   // AnimLoop(context, animObj)
      aLoop7.init(60,4);    // function(fps,someIndex)
      aLoop7.startAn();
    }
  });
  $('#pause7').click(function() {
    if (aLoop7) {
      console.log('loop7 pause toggle');
      aLoop7.paused = (!aLoop7.paused);
    }
  });
  $('#reset7').click(function() {
    if (aLoop7) {
      console.log('loop7 reset');
      cancelAnimationFrame(aLoop7.reqAnimFrame);
      aLoop7 = undefined;
      clearCanvas(ctx7);
    }
  });

  /////
  //// Group 8
  ////
  $('#start8').click(function() {
    if (!aLoop8) {
      console.log('loop8 started');
      clearCanvas(ctx8);
      myMouseTrack = new MouseTrack(ctx8,40);
      myMouseTrack.init();
      aLoop8 = new AnimLoop(ctx8,myMouseTrack);   // AnimLoop(context, animObj)
      aLoop8.init(60,4);    // function(fps,someIndex)
      aLoop8.startAn();
    }
  });
  $('#pause8').click(function() {
    if (aLoop8) {
      console.log('loop8 pause toggle');
      aLoop8.paused = (!aLoop8.paused);
    }
  });
  $('#reset8').click(function() {
    if (aLoop8) {
      console.log('loop8 reset');
      cancelAnimationFrame(aLoop8.reqAnimFrame);
      aLoop8 = undefined;
      clearCanvas(ctx8);
    }
  });


  /////
  //// Group 9
  ////
  $('#start9').click(function() {
    if (!aLoop9) {
      console.log('loop9 started');
      clearCanvas(ctx9);
      myMaze = new Maze(ctx9, 26); // Maze(context, spacing)
      myMaze.init();
      aLoop9 = new AnimLoop(ctx9,myMaze);   // AnimLoop(context, animObj)
      aLoop9.init(0.7,4);    // function(fps,someIndex)
      aLoop9.startAn();
    }
  });
  $('#pause9').click(function() {
    if (aLoop9) {
      console.log('loop9 pause toggle');
      aLoop9.paused = (!aLoop9.paused);
    }
  });
  $('#reset9').click(function() {
    if (aLoop9) {
      console.log('loop9 reset');
      cancelAnimationFrame(aLoop9.reqAnimFrame);
      aLoop9 = undefined;
      clearCanvas(ctx9);
    }
  });


  /////
  //// Group 10
  ////
  $('#start10').click(function() {
    if (!aLoop10) {
      console.log('loop10 started');
      clearCanvas(ctx10);
      myPlaid = new Plaid(ctx10, 16); // Maze(context, lineCount)
      myPlaid.init();
      aLoop10 = new AnimLoop(ctx10,myPlaid);   // AnimLoop(context, animObj)
      aLoop10.init(60,4);    // function(fps,someIndex)
      aLoop10.startAn();
    }
  });
  $('#pause10').click(function() {
    if (aLoop10) {
      console.log('loop10 pause toggle');
      // aLoop10.paused = (!aLoop10.paused );
      aLoop10.paused = (!aLoop10.paused);
    }
  });
  $('#reset10').click(function() {
    console.log('loop10 resest clicked');
    if (aLoop10) {
      console.log('loop10 reset');
      cancelAnimationFrame(aLoop10.reqAnimFrame);
      aLoop10 = undefined;
      clearCanvas(ctx10);
    }
  });


  /////
  //// Group 11
  ////
  $('#start11').click(function() {
    if (!aLoop11) {
      console.log('loop11 started');
      clearCanvas(ctx11);
      myMarbleSim = new MarbleSim(ctx11, 20);   // Obj(context, total)
      myMarbleSim.init();
      aLoop11 = new AnimLoop(ctx11,myMarbleSim);   // AnimLoop(context, animObj)
      aLoop11.init(60,4);    // function(fps,someIndex)
      aLoop11.startAn();
    }
  });
  $('#pause11').click(function() {
    if (aLoop11) {
      console.log('loop11 pause toggle');
      aLoop11.paused = (!aLoop11.paused);
    }
  });
  $('#reset11').click(function() {
    console.log('loop11 resest clicked');
    if (aLoop11) {
      console.log('loop11 reset');
      cancelAnimationFrame(aLoop11.reqAnimFrame);
      aLoop11 = undefined;
      clearCanvas(ctx11);
    }
  });

  /////
  //// Group 12
  ////
  $('#start12').click(function() {
    if (!aLoop12) {
      console.log('loop12 started');
      clearCanvas(ctx12);
      myWarp = new Warp(ctx12, 20);   // Obj(context, total)
      myWarp.init();
      aLoop12 = new AnimLoop(ctx12,myWarp);   // AnimLoop(context, animObj)
      aLoop12.init(60,4);    // function(fps,someIndex)
      aLoop12.startAn();
    }
  });
  $('#pause12').click(function() {
    if (aLoop12) {
      console.log('loop12 pause toggle');
      aLoop12.paused = (!aLoop12.paused);
    }
  });
  $('#reset12').click(function() {
    console.log('loop12 resest clicked');
    if (aLoop12) {
      console.log('loop12 reset');
      cancelAnimationFrame(aLoop12.reqAnimFrame);
      aLoop12 = undefined;
      clearCanvas(ctx12);
    }
  });

});
