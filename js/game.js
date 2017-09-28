//VARIABLES NEEDED IN OTHER JS FILES
//CAN'T PASS AS ARGUMENTS
var score;
var canvas = document.getElementById('myCanvas');
var w = canvas.width;
var h = canvas.height;
var ctx = canvas.getContext('2d');
/**************/
//Game Framework
/**************/
window.onload = function init() {
  //Starting a new game
  var game = new GF();
  game.start();
  intro.play();
};

var GF = function() {
  //Variables
  var inputStates = {};
  var scoreSheet;
  score = 0;
  var scoreBetweenBoss = 0;
  var lives = 3;
  var shipsLeftToDisplay = [];
  var shipsLeft;
  var rankingDisplayed = false;
  var SHIP_STRAIGHT = 0;
  var ENEMY_STRAIGHT = 0;
  var EXPLOSION_STRAIGHT = 0;
  var shipSprites = [];
  var enemySprites = [];
  var enemyArray = [];
  var enemyShots = [];
  var explosionSprites = [];
  var redExplosionSprites = [];
  var blueShots = [];
  var cx, cy, bx, by;
  var redExplosionCount = 0;
  var blueExplosionCount = 0;
  var bossCount = 0;
  var bossesKilled = 0;
  var bossShots = [];
  var bigBoss = [];
  var bossHit = 0;
  var redShips = 2;
  var gameStates = {
    mainMenu: 0,
    playing: 1,
    gameOver: 2,
    finish: 3
  };
  var currentGameState = gameStates.mainMenu;
  /*****************/
  //Game Objects//
  /**************/
  var ship = {
    x: 0,
    y: 0,
    width: 92,
    height: 92,
    speed: 200,
    direction: SHIP_STRAIGHT,
    dead: false
  };

  var bullet = {
    x: 0,
    y: 0,
    speed: 500
  };

  var enemy = {
    x: 0,
    y: 0,
    width: 83,
    height: 75,
    speed: 100,
    direction: ENEMY_STRAIGHT
  };

  var boss = {
    x: 1000 - 70,
    y: 300,
    startX: 0,
    startY: 0,
    width: 101,
    height: 122,
    speed: 100
  };

  var explosion = {
    x: 0,
    y: 0,
    width: 256,
    height: 256,
    speed: 100,
    direction: EXPLOSION_STRAIGHT
  };

  function clearCanvas() {
    ctx.clearRect(0, 0, w, h);
  }

  function testLives() {
    if (lives === 0) {
      ship.dead = true;
      mainTheme.stop();
      over.play();
      currentGameState = gameStates.gameOver;
    }
  }
  /*********************************/
  //TESTING ALL COLLISIONS POSSIBLE//
  /*********************************/
  //test collision between blue and red ships
  function testCollisionsShips() {
    for (var i = 0; i < enemyArray.length; i++) {
      if (shipsOverlap(ship.x, ship.y, ship.width, ship.height, enemyArray[i].x, enemyArray[i].y, enemyArray[i].width, enemyArray[i].height)) {
        bx = enemyArray[i].x;
        by = enemyArray[i].y;
        enemyArray.splice(i, 1);
        blueExplosionCount = 0;
        lives -= 1;
        shipsLeft.removeChild(shipsLeft.lastChild);
        testLives();
      }
    }
  }
  //Test collisions between blue ship and enemy bullets
  function testCollisionBlueRedBullets() {
    for (var i = 0; i < enemyShots.length; i++) {
      if (shipsOverlap(ship.x, ship.y - 15, ship.width, ship.height, enemyShots[i].x, enemyShots[i].y, enemyShots[i].width, enemyShots[i].height - 40)) {
        bx = enemyShots[i].x;
        by = enemyShots[i].y;
        enemyShots.splice(i, 1);
        blueExplosionCount = 0;
        lives -= 1;
        hit.play();
        shipsLeft.removeChild(shipsLeft.lastChild);
        testLives();
      }
    }
  }
  //test collision between blue bullet and red ships
  function testCollisionBlueBulletRedShips() {
    for (var i = 0; i < blueShots.length; i++) {
      for (var j = 0; j < enemyArray.length; j++) {
        if (blueShots[i]) {
          if (shipsOverlap(blueShots[i].x, blueShots[i].y, blueShots[i].width, blueShots[i].height, enemyArray[j].x, enemyArray[j].y, enemyArray[j].width, enemyArray[j].height)) {
            cx = blueShots[i].x;
            cy = blueShots[i].y;
            enemyArray.splice(j, 1);
            blueShots.splice(i, 1);
            redExplosionCount = 0;
            score += 100;
            checkScore();
            redDeath.play();
            if (bigBoss.length === 0) {
              scoreBetweenBoss += 100;
            }
          }
        }
      }
    }
  }
  //test collision between blue bullet and boss
  function testCollisionBlueBulletBoss() {
    for (var i = 0; i < blueShots.length; i++) {
      for (var j = 0; j < bigBoss.length; j++) {
        if (shipsOverlap(blueShots[i].x, blueShots[i].y, blueShots[i].width, blueShots[i].height, bigBoss[j].x, bigBoss[j].y, bigBoss[j].width, bigBoss[j].height)) {
          hitBoss.play();
          bossHit++;
          blueShots.splice(i, 1);
          if (bossHit >= 10) {
            scoreBetweenBoss += 100;
            cx = bigBoss[0].x;
            cy = bigBoss[0].y;
            redExplosionCount = 0;
            bigBoss.splice(0, 1);
            bossHit = 0;
            score += 300;
            bossCount = 0;
            bossesKilled++;
            checkScore();
            bossDeath.play();
          }
          if (bossesKilled === 5) {
            mainTheme.stop();
            finish.play();
            currentGameState = gameStates.finish;
          }
        }
      }
    }
  }
  //test collision between ship and boss bullets
  function testCollisionShipBossBullets() {
    for (var i = 0; i < bossShots.length; i++) {
      if (shipsOverlap(ship.x, ship.y - 15, ship.width, ship.height, bossShots[i].x, bossShots[i].y, bossShots[i].width, bossShots[i].height - 40)) {
        bx = bossShots[i].x;
        by = bossShots[i].y;
        bossShots.splice(i, 1);
        blueExplosionCount = 0;
        lives -= 1;
        hit.play();
        shipsLeft.removeChild(shipsLeft.lastChild);
        testLives();
      }
    }
  }
  //test collision between ship and boss
  function testCollisionShipBoss() {
    if (bigBoss[0] != undefined) {
      if (shipsOverlap(ship.x, ship.y, ship.width, ship.height, bigBoss[0].x, bigBoss[0].y, bigBoss[0].width, bigBoss[0].height)) {
        ship.dead = true;
        mainTheme.stop();
        over.play();
        bx = bigBoss[0].x;
        by = bigBoss[0].y;
        bigBoss.splice(0, 1);
        blueExplosionCount = 0;
        currentGameState = gameStates.gameOver;
      }
    }
  }
  /*********************/
  //EXPLOSIONS//
  /*********************/
  function redExplosion() {
    if (cx != undefined && cy != undefined && redExplosionCount < 40) {
      redExplosionSprites[explosion.direction].draw(ctx, (cx - (explosion.width / 2)), (cy - (explosion.height / 2)));
      redExplosionCount++;
    }
  }

  function blueExplosion() {
    if (bx != undefined && by != undefined && blueExplosionCount < 40) {
      explosionSprites[explosion.direction].draw(ctx, (bx - (explosion.width / 2)), (by - (explosion.height / 2)));
      blueExplosionCount++;
    }
    if (lives <= 0 && blueExplosionCount >= 40) {
      ship.dead = true;
    }
  }
  /****************/
  //SCORE + LIVES//
  /****************/
  function displayScore() {
    scoreSheet.innerHTML = '<h1>SCORE<h1>' +
      '<br>' + score;
  }

  function checkScore() {
    if (bigBoss.length === 0) {
      switch (scoreBetweenBoss) {
        case 500:
          bossCount = 1;
          bossToDisplay = 0;
          break;
        case 2000:
          bossCount = 1;
          bossToDisplay = 1;
          enemy.speed = 150;
          redShips = 3;
          boss.speed = 150;
          break;
        case 3000:
          bossCount = 1;
          bossToDisplay = 2;
          enemy.speed = 200;
          break;

        case 5000:
          bossCount = 1;
          bossToDisplay = 3;
          redShips = 4;
          enemy.speed = 300;
          boss.speed = 250;
          break;
        case 8000:
          bossCount = 1;
          bossToDisplay = 4;
          enemy.speed = 400;
          boss.speed = 300;
          break;
      }
    }
  }

  function displayLives() {
    if (shipsLeft.children.length < lives) {
      let img = new Image();
      img.src = "assets/sprites/blue-ship/ship-display.png";
      for (var i = 0; i < lives; i++) {
        shipsLeft.appendChild(img);
      }
    }
  }
  /*******************/
  //MOVING THE SHIPS//
  /*******************/
  function updatePosition() {
    ship.speedX = ship.speedY = 0;

    if (inputStates.left) {
      ship.speedX = -ship.speed;
    }
    if (inputStates.right) {
      ship.speedX = ship.speed;
    }
    if (inputStates.up) {
      ship.speedY = -ship.speed;
    }
    if (inputStates.down) {
      ship.speedY = ship.speed;
    }
    if (inputStates.space) {
      inputStates.space = false;
      createBlueBullet();
      laser.play();
    }
    if (inputStates.r) {
      ship.speed = 400;
      bullet.speed = 550;
      enemy.speed = 150;
    } else {
      ship.speed = 200;
      bullet.speed = 500;
      enemy.speed = 100;
    }
    ship.x += distanceToMove(delta, ship.speedX);
    ship.y += distanceToMove(delta, ship.speedY);

    if (ship.y < 0) {
      ship.y = 0;
    }
    if ((ship.y + ship.height) > canvas.height) {
      ship.y = canvas.height - ship.height;
    }
    if ((ship.x + ship.width) > canvas.width) {
      ship.x = canvas.width - ship.width;
    }
    if (ship.x < 0) {
      ship.x = 0;
    }
    testCollisionsShips(enemyArray, ship, lives, shipsLeft);
    testCollisionBlueRedBullets(enemyShots, ship, lives, shipsLeft);
    testCollisionShipBossBullets(bossShots, ship, lives, shipsLeft);
    testCollisionShipBoss(bigBoss, ship);
  }

  function updateEnemyPosition() {
    if (enemyArray.length === 0) {
      createEnemy(redShips);
    }
    for (var i = 0; i < enemyArray.length; i++) {
      //drawing enemies off of enemy sprites//
      enemyArray[i].x -= distanceToMove(delta, enemyArray[i].speed);
      enemySprites[enemy.direction].draw(ctx, enemyArray[i].x, enemyArray[i].y);
      if ((enemyArray[i].x) < 0 - enemyArray[i].width) {
        enemyArray.splice(i, 1);
      }
    }
  }

  function updateBossPosition() {
    if (bossCount === 1) {
      createBoss();
    }
    if (bigBoss.length > 0) {
      bigBoss[0].move(canvas);
      bigBoss[0].drawBoss(ctx);
    }
  }
  /*********************/
  //CREATING BULLETS//
  /********************/
  function createBlueBullet() {
    var blue = new BlueBullet((ship.x + 65),
      (ship.y + 60 / 2), 30, 30, bullet.speed);
    blueShots.push(blue);
  }

  function createEnemyBullet() {
    for (var i = 0; i < enemyArray.length; i++) {
      let redBullet = new RedBullet((enemyArray[i].x), (enemyArray[i].y + 25), 30, 30, bullet.speed);
      enemyShots.push(redBullet);
      redShot.play();
    }
  }

  function createBossBullets() {
    let bul = new BossBullet(boss.x, (bigBoss[0].y + 40), 30, 30, bullet.speed);
    let bul2 = new BossBullet(boss.x, (bigBoss[0].y + 100), 30, 30, bullet.speed);
    bossShots.push(bul);
    bossShots.push(bul2);
    bossShot.play();
  }
  /*****************/
  //MOVING BULLETS//
  /****************/
  function updateBlueBullet() {
    for (var i = 0; i < blueShots.length; i++) {
      blueShots[i].move();
      blueShots[i].drawBullet(ctx);
      if (blueShots[i].x > canvas.width) {
        blueShots.splice(i, 1);
      }
    }
    if (enemyArray.length != 0 && blueShots.length > 0) {
      testCollisionBlueBulletRedShips(blueShots, enemyArray);
    }
    if (bigBoss.length != 0) {
      testCollisionBlueBulletBoss(blueShots, bigBoss, bossHit, bossCount, bossesKilled);
    }
  }

  function updateRedBullet() {
    if (enemyShots.length === 0) {
      createEnemyBullet();
    }
    for (var i = 0; i < enemyShots.length; i++) {
      enemyShots[i].move();
      enemyShots[i].drawBullet(ctx);
      if (enemyShots[i].x < -300) {
        enemyShots.splice(i, 1);
      }
    }
  }

  function updateBossBullets() {
    if (bossShots.length === 0 && bigBoss.length != 0) {
      createBossBullets();
    }
    for (var i = 0; i < bossShots.length; i++) {
      bossShots[i].move();
      bossShots[i].drawBullet(ctx);
      if (bossShots[i].x < -300) {
        bossShots.splice(i, 1);
      }
    }
  }
  /*********************************/
  //CREATING ENEMY SHIPS + BOSS//
  /********************************/
  function createEnemy(n) {
    while (enemyArray.length < n) {
      let red = new Enemy(1000 + (Math.floor(Math.random() * 100)), ((canvas.height - enemy.width) * Math.random()), enemy.speed, enemy.width, enemy.height, ENEMY_STRAIGHT);
      enemyArray.push(red);

    }
    for (var i = 0; i < enemyArray.length; i++) {
      for (var j = i + 1; j < enemyArray.length; j++) {
        while (enemyArray[i].y - enemyArray[j].y < 0 && enemyArray[i].y - enemyArray[j].y > -enemy.height) {
          enemyArray[i].y = (canvas.height - enemy.width) * Math.random();
        }
        while (enemyArray[i].y - enemyArray[j].y > 0 && enemyArray[i].y - enemyArray[j].y < enemy.height) {
          enemyArray[i].y = (canvas.height - enemy.width) * Math.random();
        }
      }
    }
  }

  function createBoss() {
    let badGuy = new Boss(boss.x, boss.y, boss.speed, boss.width, boss.height);
    badGuy.move(canvas);
    badGuy.drawBoss(ctx);
    bigBoss.push(badGuy);
    bossCount = 0;
  }
  /*****************************/
  //RESET FUNCTION FOR NEW GAME//
  /*****************************/
  function resetGame() {
    lives = 3;
    score = 0;
    scoreBetweenBoss = 0;
    enemy.speed = 100;
    enemyArray = [];
    boss.speed = 100;
    bigBoss = [];
    bossShots = [];
    bossesKilled = 0;
    bossToDisplay = 0;
    enemyShots = [];
    blueShots = [];
    redShips = 2;
    ship.x = 0;
    ship.y = 0;
    scoreSheet.innerHTML = "";
    shipsLeft.innerHTML = "";
  }
  /*************************************************/
  //MAIN LOOP ANIMATION//
  /*************************************************/
  var mainLoop = function(time) {
    measureFPS(time);
    delta = timer(time);
    clearCanvas();
    createBackground(ctx, canvas);
    switch (currentGameState) {
      case gameStates.playing:
        ship.dead = false;
        updatePosition();
        //Blue Ship created here//
        /*********************************/
        shipSprites[ship.direction].draw(ctx, ship.x, ship.y);
        /*********************************/
        updateEnemyPosition(delta);
        updateBlueBullet();
        updateRedBullet();
        blueExplosion();
        redExplosion();
        updateBossPosition();
        updateBossBullets();
        checkScore();
        displayScore();
        displayLives();
        break;
      case gameStates.mainMenu:
        displayTitle();
        scoreSaved = false;
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#057322";
        ctx.save();
        ctx.strokeText("Press Space Bar to Shoot", 50, 50);
        ctx.fillText("Press Space Bar to Shoot", 50, 50);
        ctx.strokeText("Use Arrows To Move", 100, 150);
        ctx.fillText("Use Arrows To Move", 100, 150);
        ctx.strokeText("Hold 'R' for Light Speed", 150, 250);
        ctx.fillText("Hold 'R' for Light Speed", 150, 250);
        ctx.strokeText("Press Enter To Start", 200, 350);
        ctx.fillText("Press Enter To Start", 200, 350);
        ctx.restore();
        ship.dead = false;
        if (inputStates.enter) {
          intro.stop();
          currentGameState = gameStates.playing;
          mainTheme.play();
        }
        break;
      case gameStates.gameOver:
        ship.dead = true;
        blueExplosion();
        ctx.save();
        ctx.strokeText("Game Over", 200, 200);
        ctx.fillText("Game Over", 200, 200);
        ctx.strokeText("Press enter to play again", 200, 300);
        ctx.fillText("Press enter to play again", 200, 300);
        ctx.restore();
        if (inputStates.enter) {
          inputStates.enter = false;
          over.stop();
          clearCanvas();
          ship.dead = false;
          resetGame();
          intro.play();
          currentGameState = gameStates.mainMenu;
        }
        break;
      case gameStates.finish:
        if (pictureReady == false) {
          shipSprites[ship.direction].draw(ctx, ship.x, ship.y);
        }
        redExplosion();
        enemyArray = [];
        bigBoss = [];
        enemyShots = [];
        displayEndCredits();
        if (scoreSaved == false) {
          ctx.save();
          ctx.fillStyle = randomColor();
          ctx.strokeText("CONGRATULATIONS!", 200, 100);
          ctx.fillText("CONGRATULATIONS!", 199, 100);
          ctx.restore();
          ctx.save();
          ctx.strokeText("YOU SAVED THE GALAXY", 200, 250);
          ctx.fillText("YOU SAVED THE GALAXY", 199, 250);
          ctx.strokeText("Save your score", 200, 300);
          ctx.fillText("Save your score", 199, 300);
          ctx.strokeText("Game artwork by MillionthVector & on OpenGameArt.org", 200, 400);
          ctx.fillText("Game artwork by MillionthVector & on OpenGameArt.org", 199, 400);
          ctx.restore();
          //DISABLING ENTER KEY PRESS TO SAVE DATA
          window.onkeypress = function(e) {
            if (e.keyCode === 13) {
              e.preventDefault();
            }
          }
        } else if (scoreSaved == true) {
          ctx.save();
          ctx.strokeText("TOP SCORER : " + winner, 400, 100);
          ctx.fillText("TOP SCORER : " + winner, 399, 100);
          ctx.strokeText(winnerScore + " points", 450, 150);
          ctx.fillText(winnerScore + " points", 449, 150);
          ctx.strokeText("Press Enter to play again", 400, 400);
          ctx.fillText("Press Enter to play again", 399, 400);
          ctx.restore();
          if (pictureReady == true) {
            ctx.save();
            ctx.strokeStyle = "rgba(142, 45, 108, 0.45)";
            ctx.strokeRect(449, 199, 122, 82);
            ctx.drawImage(pictureTopScorer, 450, 200, 120, 80);
            ctx.restore();
          }
        }
        if (inputStates.enter && scoreSaved === true) {
          scoreDisplayed = false;
          inputStates.enter = false;
          finish.stop();
          clearCanvas();
          resetGame();
          intro.play();
          currentGameState = gameStates.mainMenu;
        }
    }
    requestAnimationFrame(mainLoop);
  };

  //SPRITESHEETS//
  /*************/
  var loadAssets = function(callback) {
    //SHIP//
    /******/
    var SPRITESHEET_URL = "assets/sprites/blue-ship/ship.png";
    var SPRITE_WIDTH = 92;
    var SPRITE_HEIGHT = 92;
    var NB_POSTURES = 1;
    var NB_FRAMES_PER_POSTURE = 3;

    var spritesheet = new Image();
    spritesheet.src = SPRITESHEET_URL;

    spritesheet.onload = function() {
      for (var i = 0; i < NB_POSTURES; i++) {
        var sprite = new Sprite();
        sprite.extractSprites(spritesheet, NB_POSTURES, (i + 1), NB_FRAMES_PER_POSTURE, SPRITE_WIDTH, SPRITE_HEIGHT);
        sprite.setNbImagesPerSecond(20);
        shipSprites[i] = sprite;
      }
    };

    //Blue Explosion//
    /****************/
    var SPRITESHEET_BLUE_X_URL = "assets/sprites/explosions/blue-explosion/blueX.png";
    var SPRITE_EXP_WIDTH = 256;
    var SPRITE_EXP_HEIGHT = 256;
    var NB_POSTURES_EXP = 1;
    var NB_FRAMES_PER_POSTURE_EXP = 17;

    var spritesheetExplosion = new Image();
    spritesheetExplosion.src = SPRITESHEET_BLUE_X_URL;

    spritesheetExplosion.onload = function() {
      for (var i = 0; i < NB_POSTURES_EXP; i++) {
        var spriteExplosion = new Sprite();
        spriteExplosion.extractSprites(spritesheetExplosion, NB_POSTURES_EXP, (i + 1), NB_FRAMES_PER_POSTURE_EXP, SPRITE_EXP_WIDTH, SPRITE_EXP_HEIGHT);
        spriteExplosion.setNbImagesPerSecond(30);
        explosionSprites[i] = spriteExplosion;
      }
    }

    //Red Explosion//
    /***************/
    var SPRITESHEET_RED_X_URL = "assets/sprites/explosions/red-explosion/red-exp.png";
    var SPRITE_RED_EXP_WIDTH = 256;
    var SPRITE_RED_EXP_HEIGHT = 256;
    var NB_POSTURES_RED_EXP = 1;
    var NB_FRAMES_PER_POSTURE_RED_EXP = 17;

    var spritesheetRedExplosion = new Image();
    spritesheetRedExplosion.src = SPRITESHEET_RED_X_URL;

    spritesheetRedExplosion.onload = function() {
      for (var i = 0; i < NB_POSTURES_RED_EXP; i++) {
        var spriteRedExplosion = new Sprite();
        spriteRedExplosion.extractSprites(spritesheetRedExplosion, NB_POSTURES_RED_EXP, (i + 1), NB_FRAMES_PER_POSTURE_RED_EXP, SPRITE_RED_EXP_WIDTH, SPRITE_RED_EXP_HEIGHT);
        spriteRedExplosion.setNbImagesPerSecond(60);
        redExplosionSprites[i] = spriteRedExplosion;
      }
    }

    //ENEMIES//
    /*********/
    var SPRITESHEET_ENEMY_URL = "assets/sprites/enemies/enemy-ship.png";
    var SPRITE_ENEMY_WIDTH = 78;
    var SPRITE_ENEMY_HEIGHT = 75;
    var NB_POSTURES_ENEMY = 1;
    var NB_FRAMES_PER_POSTURE_ENEMY = 2;

    var spritesheetEnemy = new Image();
    spritesheetEnemy.src = SPRITESHEET_ENEMY_URL;

    spritesheetEnemy.onload = function() {
      for (var i = 0; i < NB_POSTURES_ENEMY; i++) {
        var spriteEnemy = new Sprite();
        spriteEnemy.extractSprites(spritesheetEnemy, NB_POSTURES_ENEMY, (i + 1), NB_FRAMES_PER_POSTURE_ENEMY, SPRITE_ENEMY_WIDTH, SPRITE_ENEMY_HEIGHT);
        spriteEnemy.setNbImagesPerSecond(20);
        enemySprites[i] = spriteEnemy;
      }
      callback();
    };
  };

  var start = function() {
    initFpsCounter();
    var container = document.querySelector("#canvasContainer");
    var playerInfo = document.querySelector("#player-info");
    shipsLeft = document.querySelector("#ships-left");
    scoreSheet = document.querySelector("#scoreSheet");
    ctx.fillStyle = "#dd0000";
    ctx.font = "30px Play, sans-serif";
    var slide = document.querySelector("#fps");
    slide.addEventListener('input', function(e) {
      if (enemy.speed > 0) {
        enemy.speed = parseInt(slide.value);
      } else {
        enemy.speed = parseInt(-slide.value);
      }
    });
    inputListeners(inputStates);
    loadAssets(function() {
      requestAnimationFrame(mainLoop);
    });
  };

  return {
    start: start
  };
};
