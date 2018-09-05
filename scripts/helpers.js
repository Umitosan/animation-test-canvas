/*jshint esversion: 6 */

///////////////////
// HELPER FUNCTIONS
///////////////////

function TxtBox(x,y,font,color) {
  this.x = x;
  this.y = y;
  this.font = font;
  this.color = color;

  this.draw = function() {
    ctx1.font = this.font;
    ctx1.fillStyle = this.color;
    ctx1.fillText("Sorted!",this.x,this.y);
  };
}

function getRadianAngle(degreeValue) {
  return degreeValue * Math.PI / 180;
}

function randSign() {
  let num = getRandomIntInclusive(1,2);
  if (num === 1) {
    return 1;
  } else {
    return -1;
  }
}

function randColor(type, alphaSwitch = null) { // default alpha = 1
  // more muted colors example
      // return ( "#" + Math.round((getRandomIntInclusive(0,99999999) + 0x77000000)).toString(16) );
  // full spectum below
  let endAlpha;
  if (type === 'hex') {
    return ( "#" + Math.round((getRandomIntInclusive(0,0xffffff))).toString(16) );
  } else if (type === 'rgba') {
      if (alphaSwitch === null) {
        endAlpha = 1;
      } else if (alphaSwitch === 'rand') {
        endAlpha = getRandomIntInclusive(1,10) / 10;
      } else {
        endAlpha = alphaSwitch;
      }
      return ( 'rgba('+ getRandomIntInclusive(0,255) +','+ getRandomIntInclusive(0,255) +','+ getRandomIntInclusive(0,255) +','+endAlpha+')' );
  } else {
    console.log("Not valid option for randColor()");
    return undefined;
  }
}

function invertRGBAstr(str) {
  let arr1 = str.slice(5,-1); // arr1 = "173,216,230,0.2"
  let arr2 = arr1.split(','); // arr2 = ["173","216","230","0.2"]
  let r = -1 * arr2[0] + 255;
  let g = -1 * arr2[1] + 255;
  let b = -1 * arr2[2] + 255;
  let a = arr2[3]; // alpha doesn't change
  return 'rgba('+r+','+g+','+b+','+a+')';
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function clearCanvas(context) {
  if (context) {
    context.clearRect(0, 0, canvas1.width, canvas1.height);
  } else {
    console.log('opps that\'s not a canvas context');
  }
}
