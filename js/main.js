// ----- Element declarations -----
var game = document.getElementById('game');

// Player object definition
var playerDiv = document.createElement('div');
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
    }, 10
  );

  setTimeout(
    function() {
      clearInterval(bulletInterval);
      bullet.parentElement.removeChild(bullet);
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

// ----- Utils -----

// Get element X and Y position
function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}
