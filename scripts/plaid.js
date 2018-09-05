/* jshint esversion: 6 */

var canvas10 = $('#canvas10')[0], // canvas must be defined here for backend functions
    ctx10, // canvas.getContext('2d')
    aLoop10,
    myInterpolation;


function Plaid(context, lc) {
  this.ctx = context;
  this.lineCount = lc;
  this.bars = undefined;

  this.init = function() {
    console.log('plaid init');
    this.bars = [];
    let rows = [];
    let cols = [];
    for (let i = 0; i < this.lineCount; i++) {
      rows.push(new Bar(/* context*/ this.ctx,
                        /* x       */ 0,
                        /* y       */ i * (500/this.lineCount),
                        /* c       */ randColor('rgba','rand'),
                        /* height  */ 500/this.lineCount,
                        /* length  */ 500
                        ));
    }
    for (let j = 0; j < this.lineCount; j++) {
      cols.push(new Bar(/* context*/ this.ctx,
                        /* x       */ j * (500/this.lineCount),
                        /* y       */ 0,
                        /* c       */ randColor('rgba','rand'),
                        /* height  */ 500,
                        /* length  */ 500/this.lineCount
                        ));
    }
    this.bars.push(rows);
    this.bars.push(cols);
    console.log('this.bars = ', this.bars);
  };

  this.draw = function() {
    for (let r = 0; r < this.bars[0].length; r++) {
      this.bars[0][r].draw();
    }
    for (let c = 0; c < this.bars[1].length; c++) {
      this.bars[1][c].draw();
    }
  };

  this.update = function() {
  };
} // end Plaid


function Bar(context,x,y,c,w,l) {
  this.ctx = context;
  this.x = x;
  this.y = y;
  this.color = c;
  this.width = w;
  this.length = l;

  this.draw = function() {
    this.ctx.fillStyle = this.color;
    // void ctx.fillRect(x, y, width, height);
    this.ctx.fillRect(this.x,this.y,this.length,this.width);
  };

  this.update = function() {

  };
} // end Bar
