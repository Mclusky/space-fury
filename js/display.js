var scoreDisplayed = false;
var sideInfo = document.querySelector("#side-info");
var credits = document.querySelector("#end-credits");
var finalScore = document.querySelector("#top-score");
var nameEntered = document.querySelector("#name");
var bestScore = document.querySelector("#best-score");
var scoreSaved = false;
var pictureReady = false;

/*******************/
//GAME INTRO DISPLAY
/*******************/
function randomRGB() {
  return Math.floor(Math.random() * 256);
}

function randomColor() {
  var color = 'rgb(';
  color += randomRGB() + ',';
  color += randomRGB() + ',';
  color += randomRGB() + ')';
  return color;
}

function displayTitle() {
  ctx.save();
  ctx.font = "100px Play, sans-serif";
  ctx.strokeStyle = "#057322";
  ctx.fillStyle = randomColor();
  ctx.strokeText('"SPACE FURY"', 100, 500);
  ctx.fillText('"SPACE FURY"', 95, 500);
  ctx.restore();
}
/***************************************/
//SAVING NAME & SCORE + DISPLAY RANKING
/***************************************/
//WHEN PLAYER FINISHED THE GAME
function displayEndCredits() {
  if (scoreDisplayed == false && scoreSaved == false) {
    if (sideInfo.className === "infoBack" && credits.className === "credits-out") {
      sideInfo.classList.toggle("infoBack");
      credits.classList.toggle('credits-out');
    }
    credits.style.display = "inline-block";
    sideInfo.classList.toggle("info-out");
    credits.classList.toggle("credits-show");
    nameEntered.value = "";
    context.clearRect(0, 0, canv.width, canv.height);
    finalScore.innerHTML = '<h1>FINAL SCORE<h1>' +
      '<br>' + score;
    scoreDisplayed = true;
  }
}
//SWITCHING BACK TO MAIN DISPLAY AFTER SAVING SCORE
function displaySwitch() {
  if (sideInfo.className === "info-out" && credits.className === "credits-show") {
    sideInfo.classList.toggle("info-out");
    credits.classList.toggle('credits-show');
  }
  sideInfo.classList.toggle("infoBack");
  credits.classList.toggle('credits-out');
  scoreDisplayed = false;
  stopCamera();
}
//LOADING PICTURE OF TOP SCORER BEFORE DISPLAYING IT IN LOOP
function bestScorer() {
  var img = new Image();
  img.onload = function() {
    pictureTopScorer = img;
    pictureReady = true;
  }
  img.src = winnerPic;
}
