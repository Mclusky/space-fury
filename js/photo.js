navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);

var video;
var webcamStream;
var canv = document.querySelector("#snapshot");
var context = canv.getContext('2d');
var picture, pictureSource;

function startCamera() {
  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      // constraints
      {
        video: true,
        audio: false
      },
      // successCallback
      function(localMediaStream) {
        video = document.querySelector('#myVideo');
        video.src = window.URL.createObjectURL(localMediaStream);
        webcamStream = localMediaStream.getTracks()[0];
      },
      // errorCallback
      function(err) {
        console.log("The following error occured: " + err);
      }
    );
  } else {
    console.log("getUserMedia not supported");
  }
}

function stopCamera() {
  if (webcamStream) {
    webcamStream.stop();
  }
}

function takeSnapshot() {
  context.drawImage(video, 0, 0, canv.width, canv.height);
  picture = canv.toDataURL();
}

function drawImage(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function(e) {
      context.clearRect(0, 0, canv.width, canv.height);
      context.save();
      context.drawImage(img, 0, 0, canv.width, canv.height);
      context.restore();
    }
    img.src = e.target.result;
    picture = img.src;
  };
  reader.readAsDataURL(file);
}

function readFileAndDraw(files) {
  drawImage(files[0]);
}
