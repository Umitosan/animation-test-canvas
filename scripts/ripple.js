/*jshint esversion: 6 */


var canvas13 = document.getElementById('canvas13'),
    ctx13,
    aLoop13,
    myRipple;


function Ripple(context) {
  this.ctx = context;
  this.circleGroup = undefined;
  this.lastClickEvent = undefined;
  this.showTxt = undefined;

  this.init = function() {
    console.log('ripple init');
    canvas13.addEventListener('click', (evt) => {
      this.lastClickEvent = evt;
      this.clicked();
    }, false);
    this.circleGroup = [];
    this.showTxt = true;
  };

  this.getMousePos = function() {
    let rect = canvas13.getBoundingClientRect();
    let msDataX = this.lastClickEvent.clientX;
    let msDataY = this.lastClickEvent.clientY;
    return {
      x: msDataX - rect.left,
      y: msDataY - rect.top
    };
  };

  this.clicked = function() {
    if (this.showTxt === true) {
      this.showTxt = false;
    }
    let mouseData = this.getMousePos();
    let newCircleArray = [];
    let newColor = randColor('rgba');
    let totalCir = 10;
    let alphaCoeff = 1 / totalCir;
    for (let i = 0; i < totalCir; i++) {
      if (i < (totalCir/2)) {
        updatedColor = changeAlpha( newColor,1-(i*alphaCoeff) );
      } else if (i >= (totalCir/2)) {
        updatedColor = changeAlpha( newColor,(i*alphaCoeff) );
      } else {
        // nothin
      }
      let newCircle = { x:    mouseData.x,
                        y:    mouseData.y,
                        r:    (3*i)+1,
                        rVel: 1,
                        color: updatedColor
                      };
      newCircleArray.push(newCircle);
    }
    this.circleGroup.push(newCircleArray);
  };


  this.draw = function() {
    // Txt note
    if (this.showTxt === true) {
      this.ctx.textAlign = "center";
      this.ctx.font = '20pt Calibri';
      this.ctx.fillStyle = 'black';
      this.ctx.fillText(  /* msg */ 'CLICK ME',
                          /*  x  */  canvas12.width/2,
                          /*  y  */  canvas12.width/2
                        );
    }
    for (let i = 0; i < this.circleGroup.length; i++) {
      for (let j = this.circleGroup[i].length-1; j > -1; j--) {
        let curCircle = this.circleGroup[i][j];
        this.ctx.beginPath();
        this.ctx.lineWidth = 3+0.3;
        this.ctx.strokeStyle = curCircle.color;
        this.ctx.fillStyle = curCircle.color;
        this.ctx.arc(curCircle.x,curCircle.y,curCircle.r,0,(2*Math.PI));
        this.ctx.stroke();
        // this.ctx.fill();
      }
    }
  };

  this.update = function() {
    for (let i = 0; i < this.circleGroup.length; i++) {
      if (this.circleGroup[i] !== undefined) {
        for (let j = 0; j < this.circleGroup[i].length; j++) {
          this.circleGroup[i][j].r += this.circleGroup[i][j].rVel;
          if (this.circleGroup[i][j].r > (canvas13.width+100)) {
            this.circleGroup.splice(i,1);
            // console.log('circleGroup out of bounds');
            if (this.circleGroup.length === 0) {
              // console.log('last circle anim complete, breaking');
              break; // forces exit of loop properly
            }
          }
        }
      }
    }
  };

}
