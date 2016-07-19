// for testing the new lerpShape function
// should later become an example script

#includepath "~/Documents/;%USERPROFILE%Documents";
#include "basiljs/bundle/basil.js";

function draw() {

  // initial setup of shapes
  b.rectMode( b.CENTER );
  b.noFill();

  var dist = b.height / 5;

  var shapeA1 = b.rect(b.width / 2 - 200, dist, 100, 100);
  var shapeA2 = b.rect(b.width / 2 + 200, dist, 100, 100);

  var shapeB1 = b.rect(b.width / 2 - 200, dist * 2, 100, 100);
  var shapeB2 = b.ellipse(b.width / 2 + 200, dist * 2, 100, 100);

  var shapeC1 = b.rect(b.width / 2 - 200, dist * 3, 100, 100);
  b.rotate( b.radians(180) );
  var shapeC2 = b.rect(b.width / 2 + 200, dist * 3, 100, 100);
  b.resetMatrix();

  // add interpolation to non-trivial shape here later
  // var shapeD1 = b.rect(b.width / 2 - 200, dist * 4, 100, 100);
  // var shapeD2 = b.rect(b.width / 2 + 200, dist * 4, 100, 100);



}

b.go();