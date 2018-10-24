/*jshint esversion: 6 */


var canvas12 = document.getElementById('canvas12'),
    ctx12,
    aLoop12,
    myWarp;

function Warp(context,quantity) {
  this.ctx = context;
  this.quant = quantity;
  this.x = undefined; // center coords of warp convergence
  this.y = undefined; // center coords of warp convergence
  this.centerX = 250;
  this.centerY = 250;
  this.mouseCircleRadius = 6;
  this.mouseEventData = undefined;
  this.stars = [];
  this.acceleration = 0.07;
  this.starMaxWidth = 4;
  this.starLen = 2;
  this.starMaxLen = 20;
  this.spawnRate = 10;

  this.init = function() {
    console.log('warp init');
      canvas12.addEventListener('mousemove', (evt) => {
        this.mouseEventData = evt;
      }, false);
      canvas12.addEventListener('click', (evt2) => {
        this.initStars();
      }, false);
  }; // init

  this.getMousePos = function() {
    let rect = canvas12.getBoundingClientRect();
    let msDataX = this.mouseEventData.clientX;
    let msDataY = this.mouseEventData.clientY;
    return {
      x: msDataX - rect.left,
      y: msDataY - rect.top
    };
  };

  this.initStars = function() {
    console.log('this.initStars');
    for (var i = 0; i < this.quant; i++) {
      this.stars.push(this.makeNewStar('even'));
    } // for
    // console.log('this.stars = ', this.stars);
  }; // initStars

  this.makeNewStar = function(mode) {
    let offset = 20;  // this val helps to start lines off the screen for better smoothness on animation
    let newX;
    let newY;
    if (mode === 'even') {
      newX = getRandomIntInclusive(-offset,canvas12.width+offset);
      newY = getRandomIntInclusive(-offset,canvas12.height+offset);
    } else if (mode === 'edge') {
      let coinFlip = getRandomIntInclusive(0,1);
      if  (coinFlip === 1) {
          newX = getRandomIntInclusive(-offset,canvas12.width+offset);
          let yFlip = getRandomIntInclusive(0,1);
          if (yFlip === 1) {
            newY = canvas12.height+offset;
          } else {
            newY = -offset;
          }
      } else {
        newY = getRandomIntInclusive(-offset,canvas12.height+offset);
        let xFlip = getRandomIntInclusive(0,1);
        if (xFlip === 1) {
          newX = canvas12.width+offset;
        } else {
          newX = -offset;
        }
      }
    } // end if
    // let randLen = getRandomIntInclusive(10,30);
    let newLen = 4;
    let newWidth = getRandomIntInclusive(1,this.starMaxWidth);
    let vel = 0.2;
    let color = randColor('rgba');
    // let color = randGrey();
    let computedAngle = this.getAngleToPoint(newX,newY,this.centerX,this.centerY);
    return {  x:     newX,
              y:     newY,
              angle: computedAngle,
              len:   newLen,
              width: newWidth,
              vel:   vel,
              color: color
            };
  };

  this.getAngleToPoint = function(x1,y1,centX,centY) {
    if ( (x1 >= centX) && (y1 >= centY) ) { // lower right
      return Math.atan((y1-centY)/(x1-centX))+getRadianAngle(180);
    } else if ( (x1 <= centX) && (y1 >= centY) ) { // lower left
      return Math.atan((y1-centY)/(x1-centX));
    } else if ( (x1 < centX) && (y1 < centY) ) { // upper left
      return Math.atan((centY-y1)/(centX-x1));
    } else if ( (x1 > centX) && (y1 < centY) ) { // upper right
      return Math.atan((y1-centY)/(x1-centX))+getRadianAngle(180);
    } else {
      // nothin
    }
  };

  this.getDistToCenter = function(x, y) {
    let a = Math.abs(this.centerX-x);
    let b = Math.abs(this.centerY-y);
    let dist = (Math.sqrt(Math.pow(a,2)+Math.pow(b,2)));
    return dist;
  };

  this.getNewLen = function(starX, starY) {
    let dist = this.getDistToCenter(starX,starY);
    let coef = 1 - (dist/708); // 708 is max distance diagonally from mouse point
    let newLen = (this.starMaxLen * coef);
    if (newLen < 1) { // force lengh to be at least 1 pixel
      newLen = 1;
    }
    return newLen;
  };

  this.moveStars = function() {
    let acc = this.acceleration;
    for (let i = 0; i < this.stars.length; i++) {
      let angle = this.stars[i].angle;
      let len = this.stars[i].len;
      let vel = this.stars[i].vel;
      this.stars[i].x += (vel*(Math.cos(angle)));
      this.stars[i].y += (vel*(Math.sin(angle)));
      // apply acceleration
      this.stars[i].vel += acc;
      // destroy stars when they get close to center OR off canvas too far
      if ( ((Math.abs(this.stars[i].x - (this.centerX)) < this.stars[i].len+6) && (Math.abs(this.stars[i].y - (this.centerY)) < this.stars[i].len+6)) ||
           (this.stars[i].x < -20) || (this.stars[i].x > canvas12.width+20) ||
           (this.stars[i].y < -20) || (this.stars[i].y > canvas12.height+20)) {
        this.stars.splice(i,1); // remove the spark from array
        // this.stars.push(this.makeNewStar('edge')); // make a new one!
        // console.log('number of stars = ', this.stars.length);
      }
    }
  };

  this.updateStars = function() {
    for (var i = 0; i < this.stars.length; i++) {
      // update angles
      this.stars[i].angle = this.getAngleToPoint(this.stars[i].x,this.stars[i].y,this.centerX,this.centerY);
      // update lengths
      this.stars[i].len = this.getNewLen(this.stars[i].x,this.stars[i].y);
    }
  };

  this.draw = function() {
    // mouse position TXT
    this.ctx.textAlign = "center";
    this.ctx.font = '14pt Calibri';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText( /* msg */ 'Mouse position(x,y):  ' + (this.x-0.5) + ' , ' + this.y,
                       /*  x  */  canvas12.width/2,
                       /*  y  */  30
                       );
    // circle around mouse
    this.ctx.beginPath();
    // this.ctx.fillStyle = this.color;
    this.ctx.fillStyle = this.black;
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    this.ctx.arc(this.x,this.y,this.mouseCircleRadius,0,360);
    this.ctx.stroke();
    this.ctx.fill();
    // stars
    for (var i = 0; i < this.stars.length; i++) {
      this.ctx.lineWidth = this.stars[i].width;
      // this.ctx.lineWidth = getRandomIntInclusive(1,2);
      this.ctx.strokeStyle = this.stars[i].color;
      let x = this.stars[i].x;
      let y = this.stars[i].y;
      let angle = this.stars[i].angle;
      let len = this.stars[i].len;
      // single ray
      this.ctx.beginPath();
      this.ctx.moveTo( x , y );
      this.ctx.lineTo( x+(len*Math.cos(angle)) , y+(len*Math.sin(angle)) );
      this.ctx.stroke();
    }
  }; // draw

  this.update = function() {
    if (this.mouseEventData !== undefined) {
      let mouseData = this.getMousePos();
      this.x = mouseData.x;
      this.y = mouseData.y;
      this.centerX = this.x;
      this.centerY = this.y;
      this.updateStars();
    }
    if ( (this.stars !== undefined) && (this.stars.length > 0) ) {  this.moveStars(); }
    for (let i = 0; i < this.spawnRate; i++) {
      this.stars.push(this.makeNewStar('edge')); // make a new one!
    }
  }; // update


} // Warp
