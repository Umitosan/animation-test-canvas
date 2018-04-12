/*jshint esversion: 6 */


var canvas3 = $('#canvas3')[0],
    ctx3,
    aLoop3,
    myArcGroup;


function Arc(x,y,r,color,context) {
  this.x = x;
  this.y = y;
  this.originalR = r;
  this.rVel = undefined; // rate of Radius change
  this.r = r;
  this.lineW = 2;
  this.color = color;
  this.ctx = context;
  this.sAngle = 0;
  this.eAngle = 2 * Math.PI;
  this.xVel = getRandomIntInclusive(1,2)*randSign(); // rand speed and direction
  this.yVel = getRandomIntInclusive(1,2)*randSign(); // rand speed and direction

  this.init = function() {
    let randRVel = getRandomIntInclusive(1,2)/4;
    if (r < 10) {
      this.rVel = randRVel;
    } else if (r > 22) {
      this.rVel = -randRVel;
    } else {
      this.rVel = randRVel*randSign();
    }
  };

  this.changeRad = function() {
    if ( ((this.r + this.rVel) > 40) || ((this.r + this.rVel) < 2) ) {
      this.rVel *= -1;
    } else {
      this.r += this.rVel;
    }
  };

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
    // check bounds
    if (  ((this.x + this.xVel + this.r + this.lineW) > canvas3.width) || ((this.x + this.xVel - this.r - this.lineW) < 0)  ) {
      this.xVel *= -1;
    }
    if (  ((this.y + this.yVel + this.r) > canvas3.height) || ((this.y + this.yVel - this.r) < 0)  ) {
      this.yVel *= -1;
    }
    // change vel
    this.x += this.xVel;
    this.y += this.yVel;
    // change radius
    this.changeRad();
  }; // update
} // Arc

function ArcGroup(quantity, context) {
  this.arcs = [];
  this.context = context;
  this.quantity = quantity;

  this.init = function() {
    for (let i = 0; i < this.quantity; i++) {
      let randRad = getRandomIntInclusive(2, 40);
      //  arc(x,y,radius,startAngle,endAngle,);
      this.arcs.push( new Arc(getRandomIntInclusive(randRad, canvas3.width-randRad),
                              getRandomIntInclusive(randRad, canvas3.height-randRad),
                              randRad,
                              randColor('rgba'),
                              this.context
                     ));
    }
    for (let j = 0; j < this.arcs.length; j++) {
      this.arcs[j].init();
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
