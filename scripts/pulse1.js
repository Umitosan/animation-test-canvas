/*jshint esversion: 6 */


var canvas15 = document.getElementById('canvas15'),
    ctx15,
    aLoop15,
    myPulse1;


function Pulse1(context) {
  this.ctx = context;
  this.height = null;
  this.width = null;
  this.baseColor = "";
  this.curColorArr = null; // i.e. [255,255,255,1]
  this.oneTime = true;
  this.randColorPos = null;
  this.colorAnimDir = 1;

  this.init = function() {
    // randColor(type, alphaSwitch = null)
    this.baseColor = randColor('rgba');
    this.curColorArr = this.baseColor.slice(5,-1).split(",").map(c => parseInt(c));
    this.height = canvas15.height;
    this.width = canvas15.width;
    this.randColorPos = getRandomIntInclusive(0,2);
    console.log('this.randColorPos = ', this.randColorPos);
    console.log('this.baseColor = ', this.baseColor);
  };

  this.draw = function() {
    this.ctx.fillStyle = "rgba("+this.curColorArr[0]+","+this.curColorArr[1]+","+this.curColorArr[2]+","+this.curColorArr[3]+")";
    this.ctx.fillRect(0,0,this.width,this.height);
  };

  this.update = function() {
    if (this.curColorArr[this.randColorPos] >= 254) {
      this.colorAnimDir *= -1;
    } else if (this.curColorArr[this.randColorPos] <= 1) {
      this.colorAnimDir *= -1;
    } else {
      // nothin
    }
    this.curColorArr[this.randColorPos] += this.colorAnimDir;
  };

}
