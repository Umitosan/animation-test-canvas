/* jshint esversion: 6 */

var canvas1 = $('#canvas9')[0], // canvas must be defined here for backend functions
    ctx9, // canvas.getContext('2d')
    aLoop9,
    myInterpolation;


function Maze(context, spacing) {
  this.nodes = [];
  this.lines = undefined;
  this.ctx = context;
  this.spacing = spacing;

  this.init = function() {
    this.lines = [];
    let sp = this.spacing;

    // fill NODES
    let gridSize = Math.floor(500/sp)+1;
    for (let r = 0; r < gridSize; r++) {
      let row = [];
      for (let c = 0; c < gridSize; c++) {
        row.push({"x":(c*sp), "y":(r*sp)});
      }
      this.nodes.push(row);
    }

    // fill/compute LINES paths
    for (let j = 0; j < gridSize; j++) {
        for (let i = 0; i < gridSize; i++) {
          let x1 = this.nodes[j][i].x;
          let y1 = 0;
          let x2 = this.nodes[j][i].x + sp;
          let y2 = 0;
          let randN = getRandomIntInclusive(0,1);  // Change this probability for cool results!!!!
          if (randN === 0) { // bot-left to top-right
            // console.log('forward slash');
            y1 = this.nodes[j][i].y + sp;
            y2 = this.nodes[j][i].y;
          } else if (randN === 1) { // top-left to bot-right
            // console.log('back slash');
            y1 = this.nodes[j][i].y;
            y2 = this.nodes[j][i].y + sp;
          } else {
            console.log('randN probs');
          }

          this.lines.push({"x1": x1, "y1": y1,
                           "x2": x2, "y2": y2,
                          });

        } // for
    } // for
    // console.log('this.lines = ', this.lines);
  }; // end init

  this.draw = function() {
    let ctx = this.ctx;

    // draw all NODES (intersections)
    // for (let r = 0; r < this.nodes.length; r++) {
    //   for (let c = 0; c < this.nodes[r].length; c++) {
    //     ctx.beginPath();
    //     ctx.fillStyle = myColors.blue;
    //     // ctx.strokeStyle = invertRGBAstr(myColors.green);
    //     ctx.strokeStyle = myColors.black;
    //     ctx.lineWidth = 1;
    //     // ctx9.arc(this.x,this.y,this.r,this.sAngle,this.eAngle);
    //     ctx.arc(this.nodes[r][c].x,this.nodes[r][c].y,3,0,360);
    //     ctx.fill();
    //     ctx.stroke();
    //   }
    // }

    // draw all LINES
    for (let i = 0; i < this.lines.length-1; i++) {
      let curLine = this.lines[i];
      let x1 = curLine.x1;
      let y1 = curLine.y1;
      let x2 = curLine.x2;
      let y2 = curLine.y2;
      ctx.beginPath();
      // ctx.fillStyle = myColors.green;
      // ctx.strokeStyle = invertRGBAstr(myColors.green);
      if (y1 > y2) {
        ctx.strokeStyle = myColors.lightblueAlpha; // change the colors for fun stuff!
      } else {
        // ctx.strokeStyle = invertRGBAstr(myColors.black); // change the colors for fun stuff!
        ctx.strokeStyle = myColors.coral; // change the colors for fun stuff!
      }
      ctx.lineWidth = 1;
      ctx.moveTo(x1,y1);
      ctx.lineTo(x2,y2);
      // ctx.fill();
      ctx.stroke();
    }
  };

  this.update = function() {
    this.init();
    console.log('update happened');
  };

}
