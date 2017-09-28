/*************************/
//Collision Test function//
/*************************/
function shipsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
  if ((x1 > (x2 + w2)) || ((x1 + w1) < x2)) {
    return false;
  }
  if ((y1 > (y2 + h2)) || ((y1 + h1) < y2)) {
    return false;
  }
  return true;
}
