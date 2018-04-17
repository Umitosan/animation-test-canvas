/*jshint esversion: 6 */

var canvas1 = $('#canvas7')[0], // canvas must be defined here for backend functions
    ctx7, // canvas.getContext('2d')
    aLoop7,
    myInterpolation;


function InterAnim(totalDots) {
  this.total = totalDots;
  this.dots = [];
  this.coef = 0.975;
  this.zoomDir = 1; // controls zoom direction: 1 is inward, -1 is outward
  this.zoomInBoundaryCoef = 1.4;  // when dots[2]x - dots[1].x < 1.22... time to revers the zoom
  this.zoomOutBoundaryCoef = 10;  // when dots[2]x - dots[1].x > 1.22... time to revers the zoom
  this.startTime = null;
  this.updateSpeed = 30; // ms

  this.init = function() {
    console.log('interAnim init');
    let offset = 5;
    let cols = 400/offset;
    let rows = 400/offset;
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        let tColor;
        if (((i+j)%5) === 0) {
          tColor = myColors.blue;
        } else if (((i+j)%8) === 0) {
          tColor = myColors.green;
        } else {
          tColor = myColors.mossGreen;
        }
        this.dots.push( { sX: j*offset,
                          sY: i*offset,
                          x: j*offset,
                          y: i*offset,
                          width: 2,
                          height: 2,
                          color: tColor,
                        });
      }
    }
    this.startTime = performance.now();
  };

  this.draw = function() {
    for (var k = 0; k < this.dots.length; k++) {
      ctx7.beginPath();
      ctx7.fillStyle = this.dots[k].color;
      ctx7.fillRect(this.dots[k].x, this.dots[k].y,this.dots[k].width,this.dots[k].height);
      ctx7.fill();
    }

    // blue x and y axis
    // ctx7.strokeStyle = 'blue';
    // ctx7.moveTo(0,200);
    // ctx7.lineTo(400,200);
    // ctx7.moveTo(200,0);
    // ctx7.lineTo(200,400);
    // ctx7.stroke();
  };

  this.update = function() {
    let curTime = performance.now();
    if ( (curTime % this.updateSpeed) < 17 ) {
      let c = this.coef;
      for (var i = 0; i < this.dots.length; i++) {
        // collapse towards center Y axis (y = 200)
        if (this.dots[i].y > 201) {
          let gap = this.dots[i].y - 200;
          this.dots[i].y -= (gap - (gap * c))*this.zoomDir;
        } else if (this.dots[i].y < 199) {
          let gap = 200 - this.dots[i].y;
          this.dots[i].y += (gap - (gap * c))*this.zoomDir;
        } else {
          // nothin
        } // if
        // collapse towards center X axis (x = 200)
        if (this.dots[i].x > 201) {
          let gap = this.dots[i].x - 200;
          this.dots[i].x -= (gap - (gap * c))*this.zoomDir;
        } else if (this.dots[i].x < 199) {
          let gap = 200 - this.dots[i].x;
          this.dots[i].x += (gap - (gap * c))*this.zoomDir;
        } else {
          // nothin
        } // if
      } // for
    } // if
    if  ( (this.dots[1].x - this.dots[0].x) < this.zoomInBoundaryCoef ) {
      console.log('changing zoom to OUT');
      this.zoomDir = -1;
    } else if ( (this.dots[1].x - this.dots[0].x) > this.zoomOutBoundaryCoef ) {
      console.log('changing zoom to IN');
      this.zoomDir = 1;
    } else {
      // console.log('zoom boundary probs');
    }
  }; // update

}
