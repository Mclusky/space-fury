var delta, oldTime = 0;

var distanceToMove = function(delta, speed) {
  return (speed * delta) / 1000;
};

function timer(currentTime) {
  var delta = currentTime - oldTime;
  oldTime = currentTime;
  return delta;
}
