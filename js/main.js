// ----- Const declarations -----
var healthAttribute = 'attr-health';
var enemyIdPrefix = 'enemy-';
var gameContainerId = 'game';
var gameCanvasId = 'gameCanvas';

// ----- Element declarations -----

// Game config
var score = document.getElementById('score');
var gameScore = 0;
var timer = document.getElementById('timer');
var gameContainer = document.getElementById(gameContainerId);
var game = document.getElementById(gameCanvasId);
var gameBoundaries;
calcGameBoundaries();

// Player object definition
var playerDiv = document.createElement('div');
var playerHealth = document.getElementById('health');
var playerSpeed = 5;
playerDiv.setAttribute('id', 'player');
playerDiv.classList.add('player-character');
playerDiv.style.position = "absolute";
playerDiv.style.left = getOffset(game).left + 100 + 'px';
playerDiv.style.top = getOffset(game).top + 100 + 'px';

// Pointer object definition
var cursorDiv = document.createElement('div');
cursorDiv.setAttribute('id', 'pointer');
cursorDiv.classList.add('player-pointer');
cursorDiv.style.position = "fixed";

gameContainer.insertBefore(playerDiv, game);
gameContainer.insertBefore(cursorDiv, game);

// Enemy portals
var enemyPortals = document.querySelectorAll('.portal-item');
var enemyPortalPositions = calcPortalPositions();

// ----- Window resize event -----
window.onresize = calcGameBoundaries();

// ----- Pointer move -----
onmousemove = function(e) {
  cursorDiv.style.left = e.clientX - 10 + 'px';
  cursorDiv.style.top = e.clientY - 10 + 'px';
}

// ----- Player shoot -----

// Shoot bullet from the player on mouse click
var bulletId = 0;
onclick = function(e) {
  var bulletX = getOffset(playerDiv).left;
  var bulletY = getOffset(playerDiv).top;
  var targetX = e.clientX;
  var tagetY = e.clientY;

  var bullet = document.createElement('div');
  bullet.setAttribute('id', 'bullet-' + bulletId);
  bulletId++;
  bullet.classList.add('bullet');
  bullet.style.position = 'fixed';
  bullet.style.left = bulletX + 'px';
  bullet.style.top = bulletY + 'px';

  gameContainer.insertBefore(bullet, game);

  // Movement
  var angle = Math.atan2(tagetY - bulletY, targetX - bulletX);
  var speed = 5;
  var deltaX = Math.cos(angle) * speed;
  var deltaY = Math.sin(angle) * speed;
  var bulletInterval = setInterval(
    function() {
      if (bullet) {
        var newPositionX = bulletX += deltaX;
        var newPositionY = bulletY += deltaY;
        if (isValidPosition(newPositionX, newPositionY, bullet)) {
          bullet.style.left = newPositionX + 'px';
          bullet.style.top = newPositionY + 'px';
        } else {
          removeBullet(bullet, bulletInterval);
        }

        // Check bullet collisions
        var enemyCollided = checkEnemyCollision(bullet);
        if (enemyCollided) {
          removeBullet(bullet, bulletInterval);
          damageEnemy(enemyCollided);
        }
      }
    }, 10
  );
}

// ----- Player movement -----
var keys = {};
var movementInterval = setInterval(movePlayer, 20);

onkeydown = function(e) {
  if (e && (e.key == 'w' || e.key == 'a' || e.key == 's' || e.key == 'd')) {
    keys[e.key] = true;
  }
}

onkeyup = function(e) {
  if (e && (e.key == 'w' || e.key == 'a' || e.key == 's' || e.key == 'd')) {
    keys[e.key] = false;
  }
}

function movePlayer() {
  for (var key in keys) {
    if (keys[key]) {
      if (key == 'w') {
        var newPosition = getOffset(playerDiv).top - playerSpeed;
        if (isValidPosition(getOffset(playerDiv).left, newPosition, playerDiv)) {
          playerDiv.style.top = newPosition + 'px';
        }
      }
      if (key == 'a') {
        var newPosition = getOffset(playerDiv).left - playerSpeed;
        if (isValidPosition(newPosition, getOffset(playerDiv).top, playerDiv)) {
          playerDiv.style.left = newPosition + 'px';
        }
      }
      if (key == 's') {
        var newPosition = getOffset(playerDiv).top + playerSpeed;
        if (isValidPosition(getOffset(playerDiv).left, newPosition, playerDiv)) {
          playerDiv.style.top = newPosition + 'px';
        }
      }
      if (key == 'd') {
        var newPosition = getOffset(playerDiv).left + playerSpeed;
        if (isValidPosition(newPosition, getOffset(playerDiv).top, playerDiv)) {
          playerDiv.style.left = newPosition + 'px';
        }
      }
    }
  }
}

// ----- Enemies spawn -----
var enemies = [];
var maxEnemies = 5;
var enemyId = 0;

// Spawn an enemy each 2 seconds if there are less tan max enemies into the battlefield
var enemySpawnInterval = setInterval(spawnEnemy, 2000);
function spawnEnemy() {
  if (enemies.length < maxEnemies) {
    var enemyDiv = document.createElement('div');
    enemyDiv.setAttribute('id', enemyIdPrefix + enemyId);
    enemyDiv.setAttribute(healthAttribute, 3);
    enemyId++;
    enemyDiv.classList.add('enemy-character');
    enemyDiv.style.position = "absolute";

    // Get enemy random position to spawn
    var enemyPosition = getEnemyRandomPosition();
    enemyDiv.style.left = enemyPosition.minX + 'px';
    enemyDiv.style.top = enemyPosition.minY + 'px';
    enemies.push(enemyDiv);
    
    gameContainer.insertBefore(enemyDiv, game);
  }
}

// ----- Utils -----

// Get element X and Y position
function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}

// Get boundaries for the game canvas
function calcGameBoundaries() {
  gameBoundaries = {
    minX: getOffset(game).left,
    maxX: getOffset(game).left + game.offsetWidth,
    minY: getOffset(game).top,
    maxY: getOffset(game).top + game.offsetHeight
  };
}

// Get and store all enemy portal positions
function calcPortalPositions() {
  var portalPositions = [];
  for (var i = 0; i < enemyPortals.length; i++) {
    var enemyPortalOffset = getOffset(enemyPortals[i]);
    portalPositions.push({
      minX: enemyPortalOffset.left,
      maxX: enemyPortalOffset.left + enemyPortals[i].offsetWidth,
      minY: enemyPortalOffset.top,
      maxY: enemyPortalOffset.top + enemyPortals[i].offsetHeight,
      centerX: enemyPortalOffset.left + (enemyPortals[i].offsetWidth / 2),
      centerY: enemyPortalOffset.top + (enemyPortals[i].offsetHeight / 2),
    });
  }
  return portalPositions;
}

// Get a random position for an enemy to spawn
function getEnemyRandomPosition() {
  return enemyPortalPositions[Math.floor(Math.random() * enemyPortalPositions.length)];
}

// Get if element is inside game boundaries
function isValidPosition(left, top, element) {
  return left > gameBoundaries.minX && (left + element.offsetWidth) < gameBoundaries.maxX &&
    top > gameBoundaries.minY && (top + element.offsetHeight) < gameBoundaries.maxY;
}

// Checks if a bullet collided with an enemy
function checkEnemyCollision(bullet) {
  var collision = false;
  var elementCollided, index;

  for (var i = 0; i < enemies.length && !collision; i++) {
    var enemy = enemies[i];

    // Get bullet boundaries
    var bulletOffset = getOffset(bullet);
    var bulletMinX = bulletOffset.left;
    var bulletMaxX = bulletOffset.left + bullet.offsetWidth;
    var bulletMinY = bulletOffset.top;

    // Get enemy boundaries
    var enemyOffset = getOffset(enemy);
    var enemyMinX = enemyOffset.left;
    var enemyMaxX = enemyOffset.left + enemy.offsetWidth;
    var enemyMinY = enemyOffset.top;
    var enemyMaxY = enemyOffset.top + enemy.offsetHeight;

    // Check if boundaries collide
    if ((bulletMinX >= enemyMinX && bulletMinX <= enemyMaxX && bulletMinY >= enemyMinY && bulletMinY <= enemyMaxY) ||
      (bulletMaxX >= enemyMinX && bulletMaxX <= enemyMaxX && bulletMinY >= enemyMinY && bulletMinY <= enemyMaxY)) {
      collision = true;
      elementCollided = enemy;
      index = i;
    }
  }

  return collision ? { enemy: elementCollided, enemyId: index } : collision;
}

// Damage an enemy and remove it if dead
function damageEnemy(enemyData) {
  var enemy = enemyData.enemy;
  var enemyHealth = enemy.getAttribute(healthAttribute);
  enemyHealth--;
  if (enemyHealth == 0) {
    enemy.parentElement.removeChild(enemy);
    enemies.splice(enemyData.enemyId, 1);
    increaseScore();
  } else {
    enemy.setAttribute(healthAttribute, enemyHealth);
  }
}

// Remove bullet element from the game
function removeBullet(bullet, interval) {
  if (bullet && bullet.parentElement) {
    bullet.parentElement.removeChild(bullet);
    clearInterval(interval);
  }
}

function increaseScore() {
  gameScore++;
  score.innerHTML = gameScore;
}
