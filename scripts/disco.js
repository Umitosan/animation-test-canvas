/*jshint esversion: 6 */


var canvas2 = document.getElementById('canvas2'),
    ctx2,
    aLoop2,
    myDisco;

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
