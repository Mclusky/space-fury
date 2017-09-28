//Creating a space background
/****************************/
var background = "assets/sprites/background/parallax-space-backgound.png";
var bigPLanet = "assets/sprites/background/parallax-space-big-planet.png";
var farPlanets = "assets/sprites/background/parallax-space-far-planets.png";
var ringPlanet = "assets/sprites/background/parallax-space-ring-planet.png";
var stars = "assets/sprites/background/parallax-space-stars.png";
var planet = "assets/sprites/background/planet.png";
var moon = "assets/sprites/background/moon.png";

function createBackground(ctx, canvas) {
  ctx.save();
  let back = new Image();
  back.src = background;
  let big = new Image();
  big.src = bigPLanet;
  let plnt = new Image();
  plnt.src = farPlanets;
  let ring = new Image();
  ring.src = ringPlanet;
  let star = new Image();
  star.src = stars;
  let mars = new Image();
  mars.src = planet;
  let gray = new Image();
  gray.src = moon;
  ctx.drawImage(back, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(big, (canvas.width / 2), 350, 150, 150);
  ctx.drawImage(plnt, 250, 300, 270, 160);
  ctx.drawImage(ring, 200, 100, 100, 220);
  ctx.drawImage(star, 600, 200, 280, 180);
  ctx.drawImage(mars, 700, 50, 300, 300);
  ctx.drawImage(gray, 50, 450, 100, 100);
  ctx.restore;
}
