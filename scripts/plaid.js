/* jshint esversion: 6 */

var canvas10 = document.getElementById('canvas10'), // canvas must be defined here for backend functions
    ctx10, // canvas.getContext('2d')
    aLoop10,
    myPlaid;


function Plaid(context, lc) {
  this.ctx = context;
  this.lineCount = lc;
  this.lineThickness = (500/this.lineCount);
  this.bars = undefined;
  this.rowVel = 0.5;
  this.colVel = 1;

  this.init = function() {
    // console.log('plaid init');
    this.bars = [];
    let rows = [];
    let cols = [];
    for (let i = 0; i < this.lineCount+1; i++) { // extra 1 is for line off the screen top left
      rows.push(new Bar(/* context*/ this.ctx,
                        /* x       */ 0,
                        /* y       */ i * this.lineThickness,
                        /* c       */ randColor('rgba',0.5),
                        /* height  */ this.lineThickness,
                        /* length  */ 500
                        ));
    }
    for (let j = 0; j < this.lineCount+1; j++) { // extra 1 is for line off the screen top left
      cols.push(new Bar(/* context*/ this.ctx,
                        /* x       */ j * (500/this.lineCount),
                        /* y       */ 0,
                        /* c       */ randColor('rgba',0.5),
                        /* height  */ 500,
                        /* length  */ this.lineThickness
                        ));
    }
    this.bars.push(rows);
    this.bars.push(cols);
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
    for (let r = 0; r < this.bars[0].length; r++) {
      this.bars[0][r].y += this.rowVel;
      if ( (this.bars[0][r].y) > 500 ) {
        let firstBarY = this.bars[0][0].y;
        this.bars[0].pop();
        this.bars[0].unshift(new Bar( /* context*/ this.ctx,
                                      /* x       */ 0,
                                      /* y       */ firstBarY-this.lineThickness,
                                      /* c       */ randColor('rgba',0.3),
                                      /* width   */ this.lineThickness,
                                      /* length  */ 500
                                      ));
      }
    } // for
    for (let c = 0; c < this.bars[1].length; c++) {
      this.bars[1][c].x += this.colVel;
      if ( (this.bars[1][c].x) > 500 ) {
        let firstBarX = this.bars[1][0].x;
        this.bars[1].pop();
        this.bars[1].unshift(new Bar( /* context*/ this.ctx,
                                      /* x       */ firstBarX-this.lineThickness,
                                      /* y       */ 0,
                                      /* c       */ randColor('rgba',0.3),
                                      /* width   */ 500,
                                      /* length  */ this.lineThickness
                                      ));
      }
    } // for
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
    ctx = this.ctx;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    // void ctx.fillRect(x, y, width, height);
    ctx.fillRect(this.x,this.y,this.length,this.width);
    ctx.closePath();
  };

  this.update = function() {

  };
} // end Bar
