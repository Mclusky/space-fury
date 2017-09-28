var redShotURL = "assets/sprites/enemies/bullet_red.png";
var shipBulletURL = "assets/sprites/blue-ship/bullet.png";
var bosses = ["assets/sprites/boss/boss1.png", "assets/sprites/boss/boss2.png", "assets/sprites/boss/boss3.png", "assets/sprites/boss/boss4.png", "assets/sprites/boss/boss5.png"];
var bossToDisplay = 0;

/***********************/
//Constructor Functions//
/***********************/
class BlueBullet {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }
  drawBullet(ctx) {
    var shot = new Image();
    shot.src = shipBulletURL;
    ctx.save();
    ctx.drawImage(shot, this.x, this.y, this.width, this.height);
    ctx.restore();
  }
  move() {
    this.x += distanceToMove(delta, this.speed);
  }
}

class RedBullet {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }
  drawBullet(ctx) {
    var shot = new Image();
    shot.src = redShotURL;
    ctx.save();
    ctx.drawImage(shot, this.x, this.y, this.width, this.height);
    ctx.restore();
  }
  move() {
    this.x -= distanceToMove(delta, this.speed);
  }
}

class BossBullet {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }
  drawBullet(ctx) {
    var bossShot = new Image();
    bossShot.src = redShotURL;
    ctx.save();
    ctx.drawImage(bossShot, this.x, this.y, this.width, this.height);
    ctx.restore();
  }
  move() {
    this.x -= distanceToMove(delta, this.speed);
  }
}

class Boss {
  constructor(x, y, speed, width, height) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = width;
    this.height = height;
  }
  drawBoss(ctx) {
    var b = new Image();
    b.src = bosses[bossToDisplay];
    ctx.save();
    ctx.drawImage(b, this.x, this.y, this.width, this.height);
    ctx.restore();
  }

  move(canvas) {
    this.y += distanceToMove(delta, this.speed);
    if (this.y > canvas.height - this.height || this.y < 0) {
      this.speed = -this.speed;
    }
  }
}

class Enemy {
  constructor(x, y, speed, width, height, direction) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = width;
    this.height = height;
    this.direction = direction;
  }
}
/*****************/
//Sprite Functions//
/*****************/
class SpriteImage {
  constructor(img, x, y, width, height) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  draw(ctx, xPos, yPos, scale) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height, xPos, yPos, this.width * scale, this.height * scale);
  }
}

class Sprite {
  constructor() {
    this.spriteArray = [];
    this.currentFrame = 0;
    this.delayBetweenFrames = 40;
    this.then = performance.now();
    this.totalTimeSinceLastRedraw = 0;
  }
  extractSprites(spritesheet, nbPostures, postureToExtract, nbFramesPerPosture, spriteWidth, spriteHeight) {
    var nbSpritesPerRow = Math.floor(spritesheet.width / spriteWidth);
    var startIndex = (postureToExtract - 1) * nbFramesPerPosture;
    var endIndex = startIndex + nbFramesPerPosture;
    for (var index = startIndex; index < endIndex; index++) {
      var x = (index % nbSpritesPerRow) * spriteWidth;
      var y = Math.floor(index / nbSpritesPerRow) * spriteHeight;
      var s = new SpriteImage(spritesheet, x, y, spriteWidth, spriteHeight);
      this.spriteArray.push(s);
    }
  }
  drawStopped(ctx, x, y) {
    var currentSpriteImage = this.spriteArray[this.currentFrame];
    currentSpriteImage.draw(ctx, x, y, 1);
  }
  draw(ctx, x, y) {
    var now = performance.now();
    var delta = now - this.then;
    var currentSpriteImage = this.spriteArray[this.currentFrame];
    currentSpriteImage.draw(ctx, x, y, 1);
    if (this.totalTimeSinceLastRedraw > this.delayBetweenFrames) {
      this.currentFrame++;
      this.currentFrame %= this.spriteArray.length;
      this.totalTimeSinceLastRedraw = 0;
    } else {
      this.totalTimeSinceLastRedraw += delta;
    }
    this.then = now;
  }
  setNbImagesPerSecond(nb) {
    this.delayBetweenFrames = 1000 / nb;
  }
}
