var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var mouseX = 0;
var mouseY = 0;

var mousePressed = false;

var ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 35,
  height: 35,
  speed: 5,
  angle: 0,
  dx: 0,
  dy: 0
};

var projectiles = [];  // Array para armazenar os projéteis
var projectileSpeed = 15;  // Velocidade dos projéteis
var projectileWidth = 5;  // Largura dos projéteis
var projectileHeight = 10;  // Altura dos projéteis
var canShoot = true;  // Variável para controlar se é possível disparar um projétil no momento
var projectileDelay = 200;  // Atraso entre cada disparo (em milissegundos)

var shipImage = new Image();
shipImage.src = "Assets/Nave_1_Teste.png";

function drawShip() {
  context.save();
  context.translate(ship.x, ship.y);
  context.rotate(ship.angle);
  context.beginPath();
  context.rect(-ship.width / 2, -ship.height / 2, ship.width, ship.height);
  context.fillStyle = "#007bff";
  context.fill();
  context.closePath();
  context.restore();
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}


function moveShip() {
  ship.x += ship.dx;
  ship.y += ship.dy;
  var dx = ship.x - mouseX;
  var dy = ship.y - mouseY;
  ship.angle = Math.atan2(dy, dx);
}

function handleMouseMove(event) {
  var rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
}

function handleKeyDown(event) {
  if (event.key === "a") {
    ship.dx = -ship.speed;
  } else if (event.key === "w") {
    ship.dy = -ship.speed;
  } else if (event.key === "d") {
    ship.dx = ship.speed;
  } else if (event.key === "s") {
    ship.dy = ship.speed;
  }
}

function handleMouseDown(event) {
  mousePressed = true;

  shoot();  // Dispara o projétil quando o botão do mouse é pressionado
}

function handleMouseUp(event) {
  mousePressed = false;

  // Faça algo caso necessário quando o botão do mouse é solto
}

function shoot() {
  if (canShoot) {
    var projectile = {
      x: ship.x + Math.cos(ship.angle),  // Calcula a posição x do projétil
      y: ship.y + Math.sin(ship.angle),  // Calcula a posição y do projétil
      angle: ship.angle
    };
    projectiles.push(projectile);
    
    canShoot = false;  // Desativa a possibilidade de disparar novamente
    setTimeout(function() {
      canShoot = true;  // Ativa a possibilidade de disparar novamente após o atraso
    }, projectileDelay);
  }
}
function handleKeyUp(event) {
  if (event.key === "a" || event.key === "d") {
    ship.dx = 0;
  } else if (event.key === "w" || event.key === "s") {
    ship.dy = 0;
  }
}

function update() {
  resizeCanvas();
  draw();
  moveShip();

  if (mousePressed) {
    shoot();
  }

  moveProjectiles();
  requestAnimationFrame(update);
}

function draw() {
  clearCanvas();
  drawProjectiles();
  drawShip();
}

function drawShip() {
  context.save();
  context.translate(ship.x, ship.y);
  context.rotate(ship.angle);
  context.drawImage(shipImage, -ship.width / 2, -ship.height / 2, ship.width, ship.height);
  context.restore();
}

function drawProjectiles() {
  var projectileImage = document.getElementById("projectile-image");
  for (var i = 0; i < projectiles.length; i++) {
    var projectile = projectiles[i];
    context.save();
    context.translate(projectile.x, projectile.y);
    context.rotate(projectile.angle);
    context.drawImage(projectileImage, -projectileHeight / 2, -projectileWidth / 2, projectileHeight, projectileWidth);
    context.restore();
  }
}

async function moveProjectiles() {
  for (var i = projectiles.length - 1; i >= 0; i--) {
    var projectile = projectiles[i];
    projectile.x -= Math.cos(projectile.angle) * projectileSpeed;
    projectile.y -= Math.sin(projectile.angle) * projectileSpeed;

    // Remove o projétil se sair da tela
    if (projectile.x < 0 || projectile.x > canvas.width || projectile.y < 0 || projectile.y > canvas.height) {
      projectiles.splice(i, 1);
    }
  }
  await sleep(500)
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch(err => {
      console.log(`Erro ao entrar em tela cheia: ${err.message}`);
    });
    canvas.removeEventListener('click', toggleFullScreen)
  } else {
    document.exitFullscreen();
    
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para redimensionar o canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Função para atualizar o tamanho do canvas quando a janela for redimensionada
function handleWindowResize() {
  resizeCanvas();
  
  // Resto do código de atualização relacionado ao redimensionamento
}

// Adiciona um evento de redimensionamento da janela
//window.addEventListener("resize", handleWindowResize);



document.addEventListener("mousemove", handleMouseMove);
//document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
document.addEventListener("keypress", handleKeyDown);
//canvas.addEventListener("click", toggleFullScreen);

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", handleMouseUp);


// Inicialize o jogo
update();