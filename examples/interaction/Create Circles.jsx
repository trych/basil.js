#targetengine "session";
#include "../../basil.js";

function setup() {
  var idleTask = app.idleTasks.add({name:"create_circles_idle_task", sleep:3});
  var onIdleEventListener = idleTask.addEventListener(IdleEvent.ON_IDLE, onIdleEventHandler, false);
  alert("Created idle task " + idleTask.name + "; Run the _Stop() script to end it!");
  b.text("move me up/down",-250,0, 50,30);
}

function onIdleEventHandler(myIdleEvent) {
  var textFrame = app.activeDocument.textFrames.item(0); 
  textFrame.contents = Math.random()+"";
}