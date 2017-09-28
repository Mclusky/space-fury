var frameCount = 0;
var lastTime;
var fps;
const fpsContainer = document.createElement('div');
const body = document.querySelector("body");

var initFpsCounter = function() {
  body.appendChild(fpsContainer);
};

var measureFPS = function(newTime) {
  if (lastTime === undefined) {
    lastTime = newTime;
    return;
  }
  var diffTime = newTime - lastTime;

  if (diffTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = newTime;
  }
  fpsContainer.innerHTML = "Frames Per Second: " + fps;
  fpsContainer.style.marginTop = 0;
  frameCount++;
};
