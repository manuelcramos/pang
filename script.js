// script.js - Juego tipo Pang (Buster Bros) completo, corregido y comentado

// Obtener elementos del DOM para manipularlos durante el juego
const game = document.getElementById("game");             // Área donde se desarrolla el juego
const player = document.getElementById("player");         // Personaje controlado por el jugador
const menu = document.getElementById("menu");             // Menú inicial para seleccionar dificultad
const livesDisplay = document.getElementById("lives");    // Elemento para mostrar número de vidas
const livesContainer = document.getElementById("lives-container"); // Contenedor que agrupa el texto de vidas
const btnLeft = document.getElementById("btn-left");      // Botón táctil para mover a la izquierda
const btnRight = document.getElementById("btn-right");    // Botón táctil para mover a la derecha
const btnShoot = document.getElementById("btn-shoot");    // Botón táctil para disparar

// Variables que controlan el estado y parámetros del juego
let playerSpeed = 10;        // Velocidad horizontal del jugador (en píxeles por actualización)
let bulletSpeed = 8;         // Velocidad vertical de los disparos (suben)
let ballGravity = 0.3;       // Gravedad que afecta a las bolas para que caigan
let gameInterval;            // Variable para almacenar el intervalo principal del juego
let bullets = [];            // Array para almacenar todos los disparos activos en pantalla
let balls = [];              // Array para almacenar todas las bolas activas en pantalla
let keys = {};               // Objeto que guarda las teclas actualmente pulsadas
let lives = 3;               // Vidas iniciales del jugador
let currentLevel = 1;        // Nivel actual del juego
const maxLevels = 100;       // Número máximo de niveles
let difficultyGlobal = "";   // Dificultad elegida en el menú (easy, medium, hard)

// --- FUNCIONES PARA CONTROLAR PULSACIONES TÁCTILES (botones móviles) ---
// Esta función actualiza el objeto 'keys' para simular la pulsación de teclas en controles táctiles
function setKey(key, value) {
  keys[key] = value;
}

// Eventos para mover jugador a la izquierda mientras se mantiene pulsado botón táctil
btnLeft.addEventListener("touchstart", (e) => {
  e.preventDefault();  // Evitar desplazamiento accidental de la página
  setKey("ArrowLeft", true);
});
btnLeft.addEventListener("touchend", (e) => {
  e.preventDefault();
  setKey("ArrowLeft", false);
});
btnLeft.addEventListener("mousedown", (e) => {
  e.preventDefault();
  setKey("ArrowLeft", true);
});
btnLeft.addEventListener("mouseup", (e) => {
  e.preventDefault();
  setKey("ArrowLeft", false);
});
btnLeft.addEventListener("mouseleave", (e) => {
  e.preventDefault();
  setKey("ArrowLeft", false);
});

// Eventos para mover jugador a la derecha mientras se mantiene pulsado botón táctil
btnRight.addEventListener("touchstart", (e) => {
  e.preventDefault();
  setKey("ArrowRight", true);
});
btnRight.addEventListener("touchend", (e) => {
  e.preventDefault();
  setKey("ArrowRight", false);
});
btnRight.addEventListener("mousedown", (e) => {
  e.preventDefault();
  setKey("ArrowRight", true);
});
btnRight.addEventListener("mouseup", (e) => {
  e.preventDefault();
  setKey("ArrowRight", false);
});
btnRight.addEventListener("mouseleave", (e) => {
  e.preventDefault();
  setKey("ArrowRight", false);
});

// Evento para disparar con botón táctil (disparo instantáneo)
btnShoot.addEventListener("touchstart", (e) => {
  e.preventDefault();
  shoot();
});
btnShoot.addEventListener("mousedown", (e) => {
  e.preventDefault();
  shoot();
});

// --- FUNCIONES DE CONTROL DE TECLADO (escritorio) ---

// Detectar tecla presionada y guardar estado en objeto keys
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  // Si la tecla es espacio (" "), disparar
  if (e.key === " ") shoot();
});

// Detectar tecla liberada y actualizar objeto keys
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// --- FUNCIÓN PARA DISPARAR ---

function shoot() {
  // Crear un nuevo elemento div para el disparo
  const bullet = document.createElement("div");
  bullet.classList.add("bullet");

  // Calcular posición horizontal para centrar el disparo respecto al jugador
  const playerX = player.offsetLeft + player.offsetWidth / 2 - 2.5;
  bullet.style.left = `${playerX}px`;
  bullet.style.top = `${player.offsetTop}px`;  // Sale desde la parte superior del jugador

  // Añadir el disparo al área de juego y al array de disparos activos
  game.appendChild(bullet);
  bullets.push(bullet);
}

// --- FUNCIÓN PARA MOVER AL JUGADOR SEGÚN TECLAS PULSADAS ---

function movePlayer() {
  const left = player.offsetLeft; // Posición actual horizontal del jugador

  // Mover a la izquierda solo si no está en el borde izquierdo y la tecla está pulsada
  if (keys["ArrowLeft"] && left > 0) {
    player.style.left = `${left - playerSpeed}px`;
  }

  // Mover a la derecha solo si no está en el borde derecho y la tecla está pulsada
  if (keys["ArrowRight"] && left < game.offsetWidth - player.offsetWidth) {
    player.style.left = `${left + playerSpeed}px`;
  }
}

// --- FUNCIÓN PARA ACTUALIZAR DISPAROS ---

function updateBullets() {
  bullets.forEach((bullet, index) => {
    // Mover disparo hacia arriba
    bullet.style.top = `${bullet.offsetTop - bulletSpeed}px`;

    // Si el disparo sale de pantalla por arriba, eliminarlo
    if (bullet.offsetTop < 0) {
      game.removeChild(bullet);
      bullets.splice(index, 1);
    }
  });
}

// --- FUNCIÓN PARA CREAR UNA BOLA ---

// size: tamaño en px, x: posición horizontal, y: posición vertical, speed: velocidad horizontal y vertical
function createBallWithSpeed(size, x, y, speed) {
  const ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.width = `${size}px`;
  ball.style.height = `${size}px`;
  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;
  ball.dataset.size = size;

  // Velocidad horizontal aleatoria entre -speed y speed
  ball.dataset.vx = (Math.random() * 2 * speed - speed).toFixed(2);

  // Velocidad vertical inicial hacia arriba proporcional a speed
  ball.dataset.vy = (-speed * 1.5).toFixed(2);

  game.appendChild(ball);
  balls.push(ball);
}

// --- FUNCIÓN PARA ACTUALIZAR MOVIMIENTO DE BOLAS ---

function updateBalls() {
  balls.forEach((ball) => {
    let x = ball.offsetLeft;
    let y = ball.offsetTop;
    let vx = parseFloat(ball.dataset.vx);
    let vy = parseFloat(ball.dataset.vy);

    // Aplicar gravedad para que la bola caiga
    vy += ballGravity;

    // Actualizar posiciones según velocidades
    x += vx;
    y += vy;

    // Rebote en los bordes izquierdo y derecho invirtiendo velocidad horizontal
    if (x <= 0 || x + ball.offsetWidth >= game.offsetWidth) {
      vx *= -1;
    }

    // Rebote en el suelo invirtiendo velocidad vertical
    if (y + ball.offsetHeight >= game.offsetHeight) {
      vy = -Math.abs(vy);
    }

    // Actualizar posición y velocidad en el dataset y estilo
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
    ball.dataset.vx = vx;
    ball.dataset.vy = vy;
  });
}

// --- FUNCIÓN PARA COMPROBAR COLISIONES ENTRE ELEMENTOS ---

// Comprueba si dos elementos DOM están chocando entre sí (colisión rectangular)
function isColliding(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  // Devuelve true si no están separados en ninguna dirección
  return !(
    aRect.top > bRect.bottom ||
    aRect.bottom < bRect.top ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

// --- FUNCIÓN PARA COMPROBAR COLISIONES DE DISPAROS CON BOLAS Y JUGADOR CON BOLAS ---

function checkCollisions() {
  // Para cada disparo
  bullets.forEach((bullet, bIndex) => {
    // Para cada bola
    balls.forEach((ball, ballIndex) => {
      // Si disparo choca con bola
      if (isColliding(bullet, ball)) {
        // Eliminar disparo
        game.removeChild(bullet);
        bullets.splice(bIndex, 1);

        // Obtener tamaño de bola para decidir si dividirla
        const size = parseInt(ball.dataset.size);
        if (size > 30) {
          // Crear dos bolas más pequeñas
          createBallWithSpeed(size / 2, ball.offsetLeft, ball.offsetTop, Math.abs(parseFloat(ball.dataset.vx)));
          createBallWithSpeed(size / 2, ball.offsetLeft + size / 2, ball.offsetTop, Math.abs(parseFloat(ball.dataset.vx)));
        }

        // Eliminar bola original
        game.removeChild(ball);
        balls.splice(ballIndex, 1);
      }
    });
  });

  // Comprobar si alguna bola choca con el jugador
  balls.forEach((ball, index) => {
    if (isColliding(player, ball)) {
      // Eliminar bola que chocó con el jugador
      game.removeChild(ball);
      balls.splice(index, 1);

      // Restar una vida
      lives--;
      livesDisplay.textContent = lives;
    }
  });
}

// --- FUNCIÓN PARA ACTUALIZAR TODO EL JUEGO ---

function updateGame() {
  movePlayer();
  updateBullets();
  updateBalls();
  checkCollisions();
  checkGameOver();
}

// --- FUNCIONES PARA GESTIONAR MENSAJES EN PANTALLA (SIN ALERTAS) ---

function showMessage(text, callback) {
  // Crear overlay para mensaje modal
  let overlay = document.createElement("div");
  overlay.id = "overlay-message";
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0,0,0,0.7)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = 1000;

  // Caja con el mensaje y botón
  let box = document.createElement("div");
  box.style.backgroundColor = "white";
  box.style.padding = "30px 50px";
  box.style.borderRadius = "10px";
  box.style.textAlign = "center";
  box.style.fontSize = "24px";
  box.style.color = "#333";
  box.textContent = text;

  // Botón aceptar para cerrar mensaje
  let btn = document.createElement("button");
  btn.textContent = "Aceptar";
  btn.style.marginTop = "20px";
  btn.style.padding = "10px 20px";
  btn.style.fontSize = "18px";
  btn.style.cursor = "pointer";

  btn.addEventListener("click", () => {
    document.body.removeChild(overlay);
    if (callback) callback();
  });

  box.appendChild(document.createElement("br"));
  box.appendChild(btn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

// --- FUNCIÓN PARA COMPROBAR SI EL JUEGO TERMINÓ O SUBIR NIVEL ---

function checkGameOver() {
  // Si se acaban las vidas, termina el juego
  if (lives <= 0) {
    clearInterval(gameInterval);
    showMessage("¡Juego terminado!", () => {
      resetGame();
    });
  }
  // Si no quedan bolas, subir nivel o ganar juego
  else if (balls.length === 0) {
    clearInterval(gameInterval);

    if (currentLevel >= maxLevels) {
      showMessage("¡Has completado todos los niveles! ¡Enhorabuena!", () => {
        resetGame();
      });
    } else {
      showMessage(`¡Has completado el nivel ${currentLevel}! Preparando siguiente nivel...`, () => {
        currentLevel++;
        showDifficultyAndLevel();
        createBallsForLevel(currentLevel);
        gameInterval = setInterval(updateGame, 20);
      });
    }
  }
}

// --- FUNCIONES DE INICIO Y REINICIO DEL JUEGO ---

// Mostrar dificultad y nivel en pantalla
function showDifficultyAndLevel() {
  // Eliminar texto anterior si existe
  const prevLabel = document.getElementById("difficulty-label");
  if (prevLabel) prevLabel.remove();

  const label = document.createElement("div");
  label.id = "difficulty-label";
  label.style.position = "absolute";
  label.style.top = "10px";
  label.style.left = "50%";
  label.style.transform = "translateX(-50%)";
  label.style.fontSize = "28px";
  label.style.fontWeight = "bold";
  label.style.color = "white";
  label.style.backgroundColor = "rgba(0,0,0,0.6)";
  label.style.padding = "5px 15px";
  label.style.borderRadius = "10px";
  label.textContent = `DIFICULTAD: ${difficultyGlobal.toUpperCase()} - NIVEL: ${currentLevel}`;

  game.appendChild(label);
}

// Crear bolas según dificultad y nivel
function createBallsForLevel(level) {
  // Eliminar bolas viejas
  balls.forEach(ball => game.removeChild(ball));
  balls = [];

  let size, speed, count;

  if (difficultyGlobal === "easy") {
    size = Math.max(100 - level, 20);
    speed = Math.min(3 + level * 0.05, 8);
    count = 1 + Math.floor(level / 10);
    for (let i = 0; i < count; i++) {
      let x = 150 + i * (size + 20);
      let y = 100;
      createBallWithSpeed(size, x, y, speed);
    }
  } else if (difficultyGlobal === "medium") {
    size = 40;
    speed = Math.min(5 + level * 0.1, 12);
    count = Math.min(1 + Math.floor(level / 5), 10);
    for (let i = 0; i < count; i++) {
      let x = 100 + i * (size + 15);
      let y = 100;
      createBallWithSpeed(size, x, y, speed);
    }
  } else if (difficultyGlobal === "hard") {
    size = 30;
    speed = Math.min(7 + level * 0.15, 15);
    count = Math.min(2 + Math.floor(level / 3), 15);
    for (let i = 0; i < count; i++) {
      let x = 80 + i * (size + 10);
      let y = 100;
      createBallWithSpeed(size, x, y, speed);
    }
  }
}

// Función para iniciar el juego con la dificultad seleccionada
function startGame(difficulty) {
  difficultyGlobal = difficulty;

  // Limpiar intervalos anteriores para evitar duplicados
  if (gameInterval) clearInterval(gameInterval);

  // Ocultar menú y mostrar elementos del juego
  menu.style.display = "none";
  game.style.display = "block";
  livesContainer.style.display = "block";

  // Reiniciar variables básicas
  lives = 3;
  currentLevel = 1;
  livesDisplay.textContent = lives;

  // Ajustar velocidad jugador según dificultad y nivel (puedes modificar valores)
  switch (difficulty) {
    case "easy":
      playerSpeed = 10 + currentLevel * 0.2;
      break;
    case "medium":
      playerSpeed = 14 + currentLevel * 0.3;
      break;
    case "hard":
      playerSpeed = 18 + currentLevel * 0.5;
      break;
    default:
      playerSpeed = 10;
  }

  // Mostrar texto con dificultad y nivel
  showDifficultyAndLevel();

  // Crear bolas iniciales para nivel 1
  createBallsForLevel(currentLevel);

  // Posicionar jugador al centro horizontal
  player.style.left = "375px";

  // Iniciar el bucle del juego (50 fps)
  gameInterval = setInterval(updateGame, 20);
}

// Función para reiniciar el juego y volver al menú sin recargar página
function resetGame() {
  if (gameInterval) clearInterval(gameInterval);

  // Eliminar disparos y bolas del DOM
  bullets.forEach(b => game.removeChild(b));
  balls.forEach(b => game.removeChild(b));

  // Vaciar arrays y estado
  bullets = [];
  balls = [];
  keys = {};
  lives = 3;
  currentLevel = 1;
  difficultyGlobal = "";

  // Ocultar juego y vidas
  game.style.display = "none";
  livesContainer.style.display = "none";

  // Mostrar menú de selección de dificultad
  menu.style.display = "block";

  // Eliminar etiqueta de dificultad y nivel si existe
  const prevLabel = document.getElementById("difficulty-label");
  if (prevLabel) prevLabel.remove();
}











