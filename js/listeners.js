var btn = document.querySelector("#save");
var pic = document.querySelector("#face-photo");
var startCam = document.querySelector("#start-camera");
var stopCam = document.querySelector("#stop-camera");
var inputFile = document.querySelector("#file");
var pattern = /[a-zA-Z0-9]{3}/
// Listener for pressed keys
function inputListeners(inputStates) {
  window.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 37) {
      inputStates.left = true;
    } else if (evt.keyCode === 38) {
      inputStates.up = true;
    } else if (evt.keyCode === 39) {
      inputStates.right = true;
    } else if (evt.keyCode === 40) {
      inputStates.down = true;
    } else if (evt.keyCode === 32) {
      inputStates.space = true;
    } else if (evt.keyCode === 13) {
      inputStates.enter = true;
    } else if (evt.keyCode === 82) {
      inputStates.r = true;
    }
  }, false);

  // Listener for released keys
  window.addEventListener('keyup', function(evt) {
    if (evt.keyCode === 37) {
      inputStates.left = false;
    } else if (evt.keyCode === 38) {
      inputStates.up = false;
    } else if (evt.keyCode === 39) {
      inputStates.right = false;
    } else if (evt.keyCode === 40) {
      inputStates.down = false;
    } else if (evt.keyCode === 32) {
      inputStates.space = false;
    } else if (evt.keyCode === 13) {
      inputStates.enter = false;
    } else if (evt.keyCode === 82) {
      inputStates.r = false;
    }
  }, false);
}

nameEntered.addEventListener("input", function(e) {
  if (pattern.test(nameEntered.value) && nameEntered.value.length === 3) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
});

btn.addEventListener("click", function() {
  createDataBase();
  topScorer();
  displaySwitch();
  scoreSaved = true;
  btn.disabled = true;
});

startCam.addEventListener("click", function() {
  startCamera();
});

stopCam.addEventListener("click", function() {
  stopCamera();
});

pic.addEventListener("click", function() {
  takeSnapshot();
});
