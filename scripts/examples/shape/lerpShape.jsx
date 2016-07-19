// for testing the new lerpShape function
// should later become an example script

#includepath "~/Documents/;%USERPROFILE%Documents";
#include "basiljs/bundle/basil.js";

function draw() {
  b.clear(b.doc());

  // initial setup of shapes
  b.rectMode( b.CENTER );
  b.noFill();

  var dist = b.height / 5;
  var steps = 4;

  var shapeA1 = b.rect(b.width / 2 - 200, dist, 50, 50);
  var shapeA2 = b.rect(b.width / 2 + 200, dist, 50, 50);

  var shapeB1 = b.rect(b.width / 2 - 200, dist * 2, 50, 50);
  b.rotate( b.radians(270) );
  var shapeB2 = b.ellipse(b.width / 2 + 200, dist * 2, 50, 50);
  b.resetMatrix();

  var shapeC1 = b.rect(b.width / 2 - 200, dist * 3, 50, 50);
  b.rotate( b.radians(90) );
  var shapeC2 = b.rect(b.width / 2 + 200, dist * 3, 50, 50);
  b.resetMatrix();

  // add interpolation to non-trivial shape here later
  // var shapeD1 = b.rect(b.width / 2 - 200, dist * 4, 100, 100);
  // var shapeD2 = b.rect(b.width / 2 + 200, dist * 4, 100, 100);

  for (var i = 1; i < steps; i++) {
    b.lerpShape(shapeA1, shapeA2, i * (1 / steps));
    b.lerpShape(shapeB1, shapeB2, i * (1 / steps));
    b.lerpShape(shapeC1, shapeC2, i * (1 / steps));
  }
}

b.go();