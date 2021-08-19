// ----- Const declarations -----
var healthAttribute = 'attr-health';
var enemyIdPrefix = 'enemy-';
var gameContainerId = 'game';
var gameCanvasId = 'gameCanvas';

// ----- Element declarations -----

// Game containers
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
var enemyCounter = 0;
var enemies = [];
var maxEnemies = 10;
var enemyId = 0;

var enemyDiv = document.createElement('div');
enemyDiv.setAttribute('id', enemyIdPrefix + enemyId);
enemyDiv.setAttribute(healthAttribute, 3);
enemyId++;
enemyDiv.classList.add('enemy-character');
enemyDiv.style.position = "absolute";
enemyDiv.style.left = '500px';
enemyDiv.style.top = '500px';
enemies.push(enemyDiv);

gameContainer.insertBefore(enemyDiv, game);

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

// Get if element is inside game boundaries
function isValidPosition(left, top, element) {
  return left > gameBoundaries.minX && (left + element.offsetWidth) < gameBoundaries.maxX &&
    top > gameBoundaries.minY && (top + element.offsetHeight) < gameBoundaries.maxY;
}

// Checks if a bullet collided with an enemy
function checkEnemyCollision(bullet) {
  var collision = false;
  var elementCollided;

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
    }
  }

  return collision ? elementCollided : collision;
}

// Damage an enemy and remove it if dead
function damageEnemy(enemy) {
  var enemyHealth = enemy.getAttribute(healthAttribute);
  enemyHealth--;
  if (enemyHealth == 0) {
    var enemyId = enemy.getAttribute('id').split(enemyIdPrefix)[1];
    enemy.parentElement.removeChild(enemy);
    enemies.splice(enemyId, 1);
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
