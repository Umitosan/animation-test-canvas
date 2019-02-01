/*jshint esversion: 6 */


var canvas15 = document.getElementById('canvas15'),
    ctx15,
    aLoop15,
    myPulse1;


function Pulse1(context) {
  this.ctx = context;
  this.height = null;
  this.width = null;
  this.oneTime = true;
  this.cubes = null;
  this.size = 6;
  this.changeTimer = 6000;
  this.masterColorAnimPos = null;
  this.count = 0;

  this.init = function() {
    this.height = canvas15.height;
    this.width = canvas15.width;
    this.cubes = [];
    let pos = getRandomIntInclusive(0,2);
    this.masterColorAnimPos = pos;
    let w = (this.width/this.size);
    let h = (this.height/this.size);
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let dir = ( (getRandomIntInclusive(0,1) === 0) ? (-1) : (1) );
        let tmpCube1 = new Cube1( /*x*/ i*w,
                                  /*y*/ j*h,
                                  /*w*/ w,
                                  /*h*/ h,
                                  /*dir*/ dir,
                                  /*pos*/ pos
                                  );
        tmpCube1.init();
        this.cubes.push(tmpCube1);
      }
    }
  };

  this.draw = function() {
    for (let i = 0; i < this.cubes.length; i++) {
      this.cubes[i].draw(this.ctx);
    }
  };

  this.update = function() {
    this.count += 1;
    // console.log('updates = ', this.count);
    for (let k = 0; k < this.cubes.length; k++) {
      console.assert(this.cubes[k].curColorArr[-1] === undefined, "oops array fucked");
    }
    if ((performance.now() % this.changeTimer) < 18) {
      let newPos = getRandomIntInclusive(0,2);
      this.masterColorAnimPos = newPos;
      if (newPos === 0) {
        console.log('RED change');
      } else if (newPos === 1) {
        console.log('GREEN change');
      } else if (newPos === 2) {
        console.log('BLUE change');
      } else  {
        console.log('probs');
      }
      for (let j = 0; j < this.cubes.length; j++) {
        this.cubes[j].randColorPos = newPos;
      }
    }
    for (let i = 0; i < this.cubes.length; i++) {
      this.cubes[i].update();
    }
  };

}


function Cube1(x,y,w,h,dir,pos) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.baseColor = "";
  this.curColorArr = null; // i.e. [255,255,255,1]
  this.oneTime = true;
  this.colorAnimDir = dir;
  this.randColorPos = pos;

  this.init = function() {
    console.assert(this.randColorPos !== -1, "wtf randColorPos = "+this.randColorPos);
    let tmpC = randColor('rgba');
    this.baseColor = tmpC;
    this.curColorArr = tmpC.slice(5,-1).split(",").map(c => parseInt(c));
  };


  this.draw = function(ctx) {
    let fillStr = "rgba("+this.curColorArr[0]+","+this.curColorArr[1]+","+this.curColorArr[2]+","+this.curColorArr[3]+")";
    // console.log('fillStr = ', fillStr);
    ctx.fillStyle = fillStr;
    ctx.fillRect(this.x,this.y,this.width,this.height);
  };

  this.update = function() {
    // console.assert(this.curColorArr[-1] === undefined, `oops array fucked: this.randColorPos = ${this.randColorPos} : this.colorAnimDir = ${this.colorAnimDir}`);
    if (this.curColorArr[this.randColorPos] === 254) {
      this.colorAnimDir *= -1;
    } else if (this.curColorArr[this.randColorPos] === 1) {
      this.colorAnimDir *= -1;
    } else {
      // change color as normal
    }
    this.curColorArr[this.randColorPos] += this.colorAnimDir;
    console.assert((this.colorAnimDir < 2) && (this.colorAnimDir > -2));
  };
}
