//SHIP SHOOTING
var laser = new Howl({
  src: ['audio/ship-shot.mp3', 'audio/ship-shot.ogg']
});
//ENEMY SHOOTING
var redShot = new Howl({
  src: ['audio/red-shot.mp3', 'audio/red-shot.ogg']
});
//BOSS SHOOTING
var bossShot = new Howl({
  src: ['audio/boss-shot.mp3', 'audio/boss-shot.ogg']
});
//ENEMY SHIP DESTROYED
var redDeath = new Howl({
  src: ['audio/red-explosion.mp3', 'audio/red-explosion.ogg'],
  volume: 0.7
});
//BOSS HIT
var hitBoss = new Howl({
  src: ['audio/boss-hit.mp3', 'audio/boss-hit.ogg']
});
//BOSS KILLED
var bossDeath = new Howl({
  src: ['audio/boss-explosion.mp3', 'audio/boss-explosion.ogg'],
  volume: 0.5
});
//SHIP HIT
var hit = new Howl({
  src: ['audio/ship-hit.mp3', 'audio/ship-hit.ogg']
});
//SHIP DESTROYED
var death = new Howl({
  src: ['audio/blue-death.mp3', 'audio/blue-death.ogg']
});
//INTRO MUSIC
var intro = new Howl({
  src: ['audio/intro.mp3', 'audio/intro.ogg'],
  loop: true
});
//PLAYING GAME STATE MUSIC
var mainTheme = new Howl({
  src: ['audio/main-theme.mp3', 'audio/main-theme.ogg'],
  loop: true,
  volume: 0.8
});
//GAME OVER MUSIC
var over = new Howl({
  src: ['audio/game-over.mp3', 'audio/game-over.ogg'],
});
//WIN MUSIC
var finish = new Howl({
  src: ['audio/finish.mp3', 'audio/finish.ogg'],
  loop: true,
  volume: 1
});
/*******************************/
//ADJUSTING GAME SOUND EFFECTS//
/******************************/
var music = document.querySelector("#music");
music.addEventListener('input', function() {
  intro.volume(music.value);
  mainTheme.volume(music.value);
  over.volume(music.value);
});

var blueLaser = document.querySelector("#blue-shots");
blueLaser.addEventListener('input', function() {
  laser.volume(blueLaser.value);
});

var redLaser = document.querySelector("#red-shots");
redLaser.addEventListener('input', function() {
  redShot.volume(redLaser.value);
  bossShot.volume(redLaser.value);
});

var boom = document.querySelector("#destruction");
boom.addEventListener('input', function() {
  bossDeath.volume(boom.value);
  redDeath.volume(boom.value);
});
