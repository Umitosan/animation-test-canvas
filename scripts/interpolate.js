/*jshint esversion: 6 */

var canvas1 = $('#canvas7')[0], // canvas must be defined here for backend functions
    ctx7, // canvas.getContext('2d')
    aLoop7,
    myInterpolation;


function InterAnim(totalDots) {
  this.total = totalDots;
  this.dots = [];
  this.color = myColors.mossGreen;
  this.coef = 0.97;
  this.startTime = null;
  this.updateSpeed = 30; // ms

  this.init = function() {
    console.log('interAnim init');
    let offset = 6;
    let cols = 400/offset;
    let rows = 400/offset;
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        this.dots.push( { sX: j*offset,
                          sY: i*offset,
                          x: j*offset,
                          y: i*offset,
                          width: 2,
                          height: 2,
                        });
      }
    }
    this.startTime = performance.now();
  };

  this.draw = function() {
    ctx7.beginPath();
    ctx7.fillStyle = this.color;
    ctx7.strokeStyle = this.color;
    for (var k = 0; k < this.dots.length; k++) {
      ctx7.fillRect(this.dots[k].x, this.dots[k].y,this.dots[k].width,this.dots[k].height);
    }
    ctx7.fill();
    ctx7.stroke();

    ctx7.strokeStyle = 'blue';
    ctx7.moveTo(0,200);
    ctx7.lineTo(400,200);
    ctx7.moveTo(200,0);
    ctx7.lineTo(200,400);
    ctx7.stroke();
  };

  this.update = function() {
    let curTime = performance.now();
    if ( (curTime % this.updateSpeed) < 17 ) {
      let c = this.coef;
      for (var i = 0; i < this.dots.length; i++) {
        // collapse towards center Y axis (y = 200)
        if (this.dots[i].y > 201) {
          let gap = this.dots[i].y - 200;
          this.dots[i].y -= (gap - (gap * c));
        } else if (this.dots[i].y < 199) {
          let gap = 200 - this.dots[i].y;
          this.dots[i].y += (gap - (gap * c));
        } else {
          // nothin
        } // if
        // collapse towards center X axis (x = 200)
        if (this.dots[i].x > 201) {
          let gap = this.dots[i].x - 200;
          this.dots[i].x -= (gap - (gap * c));
        } else if (this.dots[i].x < 199) {
          let gap = 200 - this.dots[i].x;
          this.dots[i].x += (gap - (gap * c));
        } else {
          // nothin
        } // if
      } // for
    } // if
  }; // update

}
