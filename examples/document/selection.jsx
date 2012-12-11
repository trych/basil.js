#includepath "~/Documents/;%USERPROFILE%Documents";
#include "basiljs/bundle/basil.js";

// you can get all the elements you have selected in indesign via b.selection()
// there a two different ways to use the b.selection() function

function draw() {
  // a
  var mySelection = b.selection();
  for (var i = 0; i < mySelection.length; i++) {
    b.println("element "+i+" is a: "+ mySelection[i] );
  };

  b.println("---");

  // b
  b.selection(function(item,counter){
    b.println("element "+counter+" is a: "+ item );
  });

}

b.go();