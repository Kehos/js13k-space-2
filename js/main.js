// onmousemove = function(e){console.log("mouse location:", e.clientX, e.clientY)}

var game = document.getElementById('game');

// Player
var playerDiv = document.createElement('div');
playerDiv.setAttribute('id', 'player');
playerDiv.classList.add('player-character');
playerDiv.style.position = "absolute";
playerDiv.style.left = '100px';
playerDiv.style.top = '100px';

// Pointer
var cursorDiv = document.createElement('div');
cursorDiv.setAttribute('id', 'pointer');
cursorDiv.classList.add('player-pointer');
cursorDiv.style.position = "absolute";

document.body.insertBefore(playerDiv, game);
document.body.insertBefore(cursorDiv, game);

// Pointer move
onmousemove = function(e) {
  cursorDiv.style.left = e.clientX - 10 + 'px';
  cursorDiv.style.top = e.clientY - 10 + 'px';
}

// Shoot
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
  bullet.style.left = bulletX;
  bullet.style.top = bulletY;

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

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}
