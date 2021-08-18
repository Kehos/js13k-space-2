// ----- Const declarations -----
var healthAttribute = 'attr-health';
var enemyIdPrefix = 'enemy-';

// ----- Element declarations -----
var game = document.getElementById('game');

// Player object definition
var playerDiv = document.createElement('div');
var playerHealth = document.getElementById('health');
var playerSpeed = 5;
playerDiv.setAttribute('id', 'player');
playerDiv.classList.add('player-character');
playerDiv.style.position = "absolute";
playerDiv.style.left = '100px';
playerDiv.style.top = '100px';

// Pointer object definition
var cursorDiv = document.createElement('div');
cursorDiv.setAttribute('id', 'pointer');
cursorDiv.classList.add('player-pointer');
cursorDiv.style.position = "absolute";

document.body.insertBefore(playerDiv, game);
document.body.insertBefore(cursorDiv, game);

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

  document.body.insertBefore(bullet, game);

  // Movement
  var angle = Math.atan2(tagetY - bulletY, targetX - bulletX);
  var speed = 5;
  var deltaX = Math.cos(angle) * speed;
  var deltaY = Math.sin(angle) * speed;
  var bulletInterval = setInterval(
    function() {
      if (bullet) {
        bullet.style.left = (bulletX += deltaX) + 'px';
        bullet.style.top = (bulletY += deltaY) + 'px';
      }

      var enemyCollided = checkEnemyCollision(bullet);
      if (enemyCollided) {
        bullet.parentElement.removeChild(bullet);
        damageEnemy(enemyCollided);
      }
    }, 10
  );

  setTimeout(
    function() {
      clearInterval(bulletInterval);
      if (bullet && bullet.parentElement) {
        bullet.parentElement.removeChild(bullet);
      }
    }, 2000
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
        playerDiv.style.top = getOffset(playerDiv).top - playerSpeed + 'px';
      }
      if (key == 'a') {
        playerDiv.style.left = getOffset(playerDiv).left - playerSpeed + 'px';
      }
      if (key == 's') {
        playerDiv.style.top = getOffset(playerDiv).top + playerSpeed + 'px';
      }
      if (key == 'd') {
        playerDiv.style.left = getOffset(playerDiv).left + playerSpeed + 'px';
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

document.body.insertBefore(enemyDiv, game);

// ----- Utils -----

// Get element X and Y position
function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
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
