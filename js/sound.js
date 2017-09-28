var context;
var listOfSounds = ['assets/audio/ship-shot.mp3', 'assets/audio/red-shot.mp3', 'assets/audio/boss-shot.mp3'];
var bufferLoader;

window.onload = function innit() {
  var audioContext = window.AudioContext || window.webkitAudioContext;

  context = new AudioContext();
  loadAllSounds();
};
/***************/
//Sound Effects//
/***************/
function playSound(buffer) {
  var bufferSource = context.createBufferSource();
  bufferSource.buffer = buffer;
  bufferSource.connect(context.destination);
  bufferSource.start();
}

function samplesDecoded(buffers) {
  console.log("all samples loaded and decoded");

  window.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 32) {
      playSound(buffers[0]);
    }
  }, false);
}

function loadAllSounds() {
  bufferLoader = new BufferLoader(context, listOfSounds, samplesDecoded);
  bufferLoader.load();
}

class BufferLoader {
  constructor(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.callback = callback;
    this.bufferList = [];
    this.loadCount = 0;
  }
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  console.log('file: ' + url + "loading and decoding");
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    loader.context.decodeAudioData(request.response, function(buffer) {
        console.log("Loaded and decoded track " + (loader.loadCount + 1) + "/" + loader.urlList.length + "...");
        if (!buffer) {
          alert('error decoding file data ' + url);
          return
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length) {
          loader.callback(loader.bufferList);
        }
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  };
  request.onprogress = function(e) {
    if (e.total !== 0) {
      var percent = (e.loaded * 100) / e.total;
      console.log("loaded " + percent + " % of file " + index);
    }
  };
  request.onerror = function() {
    alert("BufferLoader: XHR error");
  };
  request.send();
};

BufferLoader.prototype.load = function() {
  console.log("Loading " + this.urlList.length + "track(s) ...please wait...");
  for (var i = 0; i < this.urlList.length; i++) {
    this.loadBuffer(this.urlList[i], i);
  }
};
