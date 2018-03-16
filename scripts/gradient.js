/*jshint esversion: 6 */


var canvas1 = $('#canvas1')[0], // canvas must be defined here for backend functions
    ctx1, // canvas.getContext('2d')
    aLoop1,
    myGradAnim;

// GradBar is two gradients whose edges touch and have the same thickness in a way to make an interesting single bar of color
function GradBar(context,grad1,grad1stopA,grad1stopB,rect1,grad2,grad2stopA,grad2stopB,rect2,speed,center) {
  this.ctx = context;
  this.grad1 = grad1;
  this.grad1stopA = grad1stopA;
  this.grad1stopB = grad1stopB;
  this.rect1 = rect1;
  this.grad2 = grad2;
  this.grad2stopA = grad2stopA;
  this.grad2stopB = grad2stopB;
  this.rect2 = rect2;
  this.speed = speed;   // speed is pixels per second
  this.center = center;

  this.draw = function() {
    let gradient1 = this.ctx.createLinearGradient(this.grad1.x0, this.grad1.y0, this.grad1.x1, this.grad1.y1); // ctx.createLinearGradient(x0, y0, x1, y1);
    gradient1.addColorStop(this.grad1stopA.offset, this.grad1stopA.color);  // void gradient.addColorStop(offset, color);
    gradient1.addColorStop(this.grad1stopB.offset, this.grad1stopB.color);
    this.ctx.fillStyle = gradient1;
    this.ctx.fillRect(this.rect1.x0, this.rect1.y0, this.rect1.x1, this.rect1.y1);
    let gradient2 = this.ctx.createLinearGradient(this.grad2.x0, this.grad2.y0, this.grad2.x1, this.grad2.y1); // ctx.createLinearGradient(x0, y0, x1, y1);
    gradient2.addColorStop(this.grad2stopA.offset, this.grad2stopA.color);  // void gradient.addColorStop(offset, color);
    gradient2.addColorStop(this.grad2stopB.offset, this.grad2stopB.color);
    this.ctx.fillStyle = gradient2;
    this.ctx.fillRect(this.rect2.x0, this.rect2.y0, this.rect2.x1, this.rect2.y1);
  }; // draw
} // GradBar

function GradAnim(context, barCount = 20, speed = 20, color1 = 'lightblue', color2 = 'green', rotation = 0) {
  this.ctx = context;
  this.barCount = barCount;
  this.speed = speed; // pixels per second
  this.color1 = color1;
  this.color2 = color2;
  this.rotation = rotation;
  this.bars = [];

  this.init = function() {
    let c1 = this.color1;
    let c2 = this.color2;
    for (let i = 0 ; i < this.barCount ; i++) {
      let randCenter = getRandomIntInclusive(10,canvas1.width-10);
      let sp = getRandomIntInclusive(1,this.speed);
      let topY = (canvas1.height/barCount)*(i);
      let botY = (canvas1.height/barCount)*(1+i);
      // REF: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient
      let bar = new GradBar(  /*context*/    this.ctx,
                              /*grad1*/      { x0: 0, y0: 0, x1: randCenter, y1: 0 },  // ctx.createLinearGradient(x0, y0, x1, y1);
                              /*grad1stopA*/ { offset: 0, color: c1 },  // void gradient.addColorStop(offset, color);
                              /*grad1stopB*/ { offset: 1, color: c2 },
                              /*rect1*/      { x0: 0, y0: topY, x1: randCenter, y1: botY},
                              /*grad2*/      { x0: randCenter, y0: 0, x1: canvas1.width, y1: 0 },
                              /*grad2stopA*/ { offset: 0, color: c2 },
                              /*grad2stopB*/ { offset: 1, color: c1 },
                              /*rect2*/      { x0: randCenter, y0: topY, x1: canvas1.width, y1: botY},
                              /*speed*/      sp,
                              /*center*/     randCenter
                            );
    this.bars.push(bar);
    } // for
  }; // init
  this.draw = function() {
    for (let i = 0 ; i < this.bars.length ; i++) {
      // rotate before drawing
      if (this.rotation !== 0) {
        this.ctx.translate(canvas1.width/2, canvas1.width/2);
        this.ctx.rotate(getRadianAngle(this.rotation));
        this.ctx.translate(-canvas1.width/2, -canvas1.width/2);
      }
      this.bars[i].draw();
      // rotate back for other calculations to perform correctly
      if (this.rotation !== 0) {
        this.ctx.translate(canvas1.width/2, canvas1.width/2);
        this.ctx.rotate(getRadianAngle(this.rotation*-1));
        this.ctx.translate(-canvas1.width/2, -canvas1.width/2);
      }
    } // for
  }; // draw
  this.update = function() {
    for (let i = 0 ; i < this.bars.length ; i++) {  // update postions for each bar
      if (  ((this.bars[i].center+this.bars[i].speed-10) < 0) || ((this.bars[i].center+this.bars[i].speed+10) > canvas1.width) ) {  // test bound collision
        this.bars[i].speed *= -1; // change direction
      } else { // update the new location
        this.bars[i].center += this.bars[i].speed;
        let c = this.bars[i].center;
        this.bars[i].grad1.x1 = c;
        this.bars[i].rect1.x1 = c;
        this.bars[i].grad2.x0 = c;
        this.bars[i].rect2.x0 = c;
      } // if
    } // for
  }; // update
} // gradAnim


/*
cool color bar pairs

current color1 =  rgba(17,248,200,1)
current color2 =  rgba(176,83,227,1)

current color1 =  rgba(251,45,211,1)
current color2 =  rgba(18,199,2,1)

current color1 =  rgba(52,195,224,1)
current color2 =  rgba(246,72,16,1)

 current color2 =  rgba(228,248,154,1)
 current color1 =  rgba(163,214,159,1)

 current color1 =  rgba(132,175,224,1)
 current color2 =  rgba(251,200,166,1)

 tangerine
 current color1 =  rgba(215,177,187,1)
 current color2 =  rgba(165,253,50,1)

 soft retro
 current color1 =  rgba(74,162,188,1)
 current color2 =  rgba(201,149,204,1)

 blue brown
 current color1 =  rgba(10,194,222,1)
 current color2 =  rgba(132,80,24,1)

another blue brown
current color1 =  rgba(25,151,254,1)
current color2 =  rgba(85,71,3,1)

 */
