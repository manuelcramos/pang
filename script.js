// script.js COMPLETAMENTE COMENTADO LÍNEA A LÍNEA

// Obtenemos los elementos del DOM necesarios para controlar el juego
const game = document.getElementById("game");           // Área donde se juega
const player = document.getElementById("player");       // El personaje que controla el jugador
const menu = document.getElementById("menu");           // El menú principal con opciones de dificultad
const livesDisplay = document.getElementById("lives");  // Texto que muestra las vidas que quedan
const livesContainer = document.getElementById("lives-container"); // Contenedor donde está el texto de vidas

// Variables que controlan diferentes aspectos del juego
let playerSpeed = 10;        // Velocidad a la que se mueve el jugador (en píxeles por actualización)
let bulletSpeed = 8;         // Velocidad a la que viajan los disparos hacia arriba
let ballSpeedY = -6;         // Velocidad vertical inicial con la que la bola "rebota" hacia arriba
let ballGravity = 0.3;       // "Fuerza" de gravedad que hace que la bola caiga hacia abajo poco a poco
let ballSize = 60;           // Tamaño (ancho y alto) por defecto de la bola
let gameInterval;            // Variable para controlar el bucle principal del juego (intervalo de actualización)
let bullets = [];            // Array donde guardamos todos los disparos activos en pantalla
let balls = [];              // Array donde guardamos todas las bolas activas en el juego
let keys = {};               // Objeto que guarda qué teclas están siendo pulsadas ahora mismo
let lives = 3;               // Número de vidas que tiene el jugador al empezar

// Función para iniciar el juego al seleccionar dificultad
function startGame(difficulty) {
  // Cambia el tamaño inicial de la bola según la dificultad seleccionada
  if (difficulty === "easy") ballSize = 30;     // Bola pequeña para fácil
  else if (difficulty === "medium") ballSize = 60; // Bola mediana para medio
  else if (difficulty === "hard") ballSize = 100;  // Bola grande para difícil

  // Esconde el menú para que no se vea durante el juego
  menu.style.display = "none";
  // Muestra el área donde se juega
  game.style.display = "block";
  // Muestra el contador de vidas en pantalla
  livesContainer.style.display = "block";

  // Crea un cuadro en pantalla que muestra la dificultad actual (ejemplo: DIFICULTAD: EASY)
  const difficultyText = document.createElement("div");  // Crea un nuevo div para mostrar el texto
  difficultyText.textContent = `DIFICULTAD: ${difficulty.toUpperCase()}`; // Texto en mayúsculas
  difficultyText.style.position = "absolute";           // Posición absoluta para poder moverlo a cualquier lugar
  difficultyText.style.top = "10px";                     // A 10 píxeles desde arriba del área del juego
  difficultyText.style.left = "50%";                     // Centrado horizontalmente
  difficultyText.style.transform = "translateX(-50%)";  // Ajusta para que quede centrado exactamente
  difficultyText.style.fontSize = "32px";                // Tamaño de letra grande para que se note
  difficultyText.style.fontWeight = "bold";              // Letra en negrita
  difficultyText.style.color = "white";                   // Color blanco para que se vea bien
  difficultyText.style.backgroundColor = "rgba(0, 0, 0, 0.6)"; // Fondo semitransparente negro para que destaque
  difficultyText.style.padding = "5px 15px";              // Espacio interno para que no quede muy pegado
  difficultyText.style.borderRadius = "10px";             // Bordes redondeados para estilo agradable
  difficultyText.id = "difficulty-label";                  // Le damos un id para identificarlo fácilmente si hace falta
  game.appendChild(difficultyText);                        // Lo añadimos al área del juego para que se vea

  // Reseteamos las variables para iniciar una partida nueva
  bullets = [];              // Vaciamos el array de disparos
  balls = [];                // Vaciamos el array de bolas
  lives = 3;                 // Reiniciamos las vidas a 3
  livesDisplay.textContent = lives;  // Actualizamos el texto de vidas para mostrar 3

  // Coloca al jugador en la posición inicial horizontal (en el centro casi)
  player.style.left = "375px";

  // Creamos la primera bola del juego, con tamaño definido según dificultad
  createBall(ballSize, 200, 100);

  // Iniciamos el bucle del juego que se ejecuta cada 20 milisegundos (50 veces por segundo)
  gameInterval = setInterval(updateGame, 20);
}

// Función para crear una bola nueva
// size = tamaño de la bola en píxeles (ancho y alto)
// x = posición horizontal donde aparece
// y = posición vertical donde aparece
function createBall(size, x, y) {
  const ball = document.createElement("div");  // Creamos un nuevo div para la bola
  ball.classList.add("ball");                   // Le damos la clase CSS "ball" para que tenga estilo
  ball.style.width = `${size}px`;                // Ancho de la bola
  ball.style.height = `${size}px`;               // Alto de la bola
  ball.style.left = `${x}px`;                     // Posición horizontal inicial
  ball.style.top = `${y}px`;                      // Posición vertical inicial

  // Guardamos datos para controlar su movimiento
  ball.dataset.size = size;        // Guardamos tamaño para saber si dividir bola luego
  ball.dataset.vx = "4";           // Velocidad horizontal inicial (va a la derecha inicialmente)
  ball.dataset.vy = "-6";          // Velocidad vertical inicial (sube un poco por el rebote)

  // Añadimos la bola al área de juego (se hace visible)
  game.appendChild(ball);
  // La añadimos al array para poder manejarla en el bucle principal
  balls.push(ball);
}

// Detecta cuando se presiona una tecla y guarda su estado en el objeto keys
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;  // Guarda que la tecla está pulsada

  // Si la tecla es la barra espaciadora (" "), el jugador dispara
  if (e.key === " ") shoot();
});

// Detecta cuando se suelta una tecla y actualiza el estado en keys
document.addEventListener("keyup", (e) => {
  keys[e.key] = false; // Marca la tecla como no pulsada
});

// Función para disparar un disparo desde el jugador
function shoot() {
  const bullet = document.createElement("div"); // Creamos un nuevo div para el disparo
  bullet.classList.add("bullet");                // Le damos la clase CSS "bullet"
  
  // Calculamos la posición horizontal para centrar el disparo con respecto al jugador
  const playerX = player.offsetLeft + player.offsetWidth / 2 - 2.5;
  bullet.style.left = `${playerX}px`;            // Posición horizontal del disparo
  bullet.style.top = `${player.offsetTop}px`;    // Posición vertical (sale desde arriba del jugador)

  // Añadimos el disparo al área de juego para que se vea
  game.appendChild(bullet);
  // Lo añadimos al array para controlarlo en el juego
  bullets.push(bullet);
}

// Función que se ejecuta cada 20 ms para actualizar todo el juego
function updateGame() {
  movePlayer();       // Mueve el jugador según teclas pulsadas
  updateBullets();    // Actualiza posición y estado de los disparos
  updateBalls();      // Actualiza posición y rebotes de las bolas
  checkCollisions();  // Comprueba si hay colisiones entre disparos, bolas y jugador
  checkGameOver();    // Comprueba si el juego ha terminado (vidas o bolas)
}

// Función para mover al jugador según las teclas pulsadas (izquierda y derecha)
function movePlayer() {
  const left = player.offsetLeft; // Posición actual del jugador

  // Si la flecha izquierda está pulsada y el jugador no está en el borde izquierdo
  if (keys["ArrowLeft"] && left > 0) {
    player.style.left = `${left - playerSpeed}px`;  // Mueve el jugador a la izquierda
  }
  // Si la flecha derecha está pulsada y el jugador no está en el borde derecho
  if (keys["ArrowRight"] && left < game.offsetWidth - player.offsetWidth) {
    player.style.left = `${left + playerSpeed}px`;  // Mueve el jugador a la derecha
  }
}

// Función para actualizar la posición de todos los disparos activos
function updateBullets() {
  bullets.forEach((bullet, index) => {
    // Mueve el disparo hacia arriba restando la velocidad vertical
    bullet.style.top = `${bullet.offsetTop - bulletSpeed}px`;

    // Si el disparo ha salido por arriba de la pantalla, lo eliminamos
    if (bullet.offsetTop < 0) {
      game.removeChild(bullet);    // Quita el disparo del DOM
      bullets.splice(index, 1);    // Lo quita del array para no procesarlo más
    }
  });
}

// Función para mover las bolas y simular rebotes en los bordes y suelo
function updateBalls() {
  balls.forEach((ball) => {
    let x = ball.offsetLeft;           // Posición horizontal actual
    let y = ball.offsetTop;            // Posición vertical actual
    let vx = parseFloat(ball.dataset.vx);  // Velocidad horizontal actual
    let vy = parseFloat(ball.dataset.vy);  // Velocidad vertical actual

    // Aplica la gravedad para hacer que la bola caiga
    vy += ballGravity;
    // Actualiza posición vertical y horizontal
    y += vy;
    x += vx;

    // Rebote en los bordes izquierdo y derecho (invierte velocidad horizontal)
    if (x <= 0 || x + ball.offsetWidth >= game.offsetWidth) {
      vx *= -1;
    }

    // Rebote en el suelo (invierte velocidad vertical para subir)
    if (y + ball.offsetHeight >= game.offsetHeight) {
      vy = -Math.abs(vy);
    }

    // Actualiza la posición y velocidad guardada en los datos del elemento
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
    ball.dataset.vx = vx;
    ball.dataset.vy = vy;
  });
}

// Función que comprueba colisiones entre disparos y bolas, y entre jugador y bolas
function checkCollisions() {
  // Por cada disparo
  bullets.forEach((bullet, bIndex) => {
    // Por cada bola
    balls.forEach((ball, ballIndex) => {
      // Si el disparo choca con la bola
      if (isColliding(bullet, ball)) {
        // Eliminamos el disparo
        game.removeChild(bullet);
        bullets.splice(bIndex, 1);

        // Obtenemos el tamaño actual de la bola para saber si puede dividirse
        const size = parseInt(ball.dataset.size);
        if (size > 30) {
          // Si la bola es grande, se divide en dos bolas más pequeñas
          createBall(size / 2, ball.offsetLeft, ball.offsetTop);
          createBall(size / 2, ball.offsetLeft + size / 2, ball.offsetTop);
        }

        // Eliminamos la bola original (que fue golpeada)
        game.removeChild(ball);
        balls.splice(ballIndex, 1);
      }
    });
  });

  // También comprobamos si alguna bola choca con el jugador
  balls.forEach((ball, index) => {
    if (isColliding(player, ball)) {
      // Eliminamos la bola que chocó con el jugador
      game.removeChild(ball);
      balls.splice(index, 1);

      // El jugador pierde una vida
      lives--;
      // Actualizamos el contador de vidas en pantalla
      livesDisplay.textContent = lives;
    }
  });
}

// Función que verifica si el juego terminó por vidas o porque se acabaron las bolas
function checkGameOver() {
  // Si se acabaron las vidas
  if (lives <= 0) {
    clearInterval(gameInterval);   // Para el bucle principal del juego
    alert("¡Juego terminado!");     // Muestra mensaje de que perdiste
    location.reload();              // Recarga la página para reiniciar
  }

  // Si no quedan bolas en pantalla, ganaste
  if (balls.length === 0) {
    clearInterval(gameInterval);   // Para el bucle principal
    alert("¡Has ganado!");          // Muestra mensaje de victoria
    location.reload();              // Recarga para empezar otra partida
  }
}

// Función que devuelve true si dos elementos (a y b) están chocando entre sí
function isColliding(a, b) {
  // Obtenemos las posiciones y tamaños (rectángulos) de ambos elementos
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  // Comprobamos si NO se cumplen las condiciones de que estén separados
  return !(
    aRect.top > bRect.bottom ||   // a está debajo de b
    aRect.bottom < bRect.top ||   // a está arriba de b
    aRect.right < bRect.left ||   // a está a la izquierda de b
    aRect.left > bRect.right      // a está a la derecha de b
  );
}

// Variables globales nuevas
let currentLevel = 1;      // Nivel actual
let maxLevels = 100;       // Máximo nivel por dificultad
let difficultyGlobal = ""; // Guardamos la dificultad elegida

// Modificamos startGame para que reciba dificultad y arranque nivel 1
function startGame(difficulty) {
  difficultyGlobal = difficulty; // Guardamos la dificultad

  // Ocultamos menú y mostramos juego y vidas
  menu.style.display = "none";
  game.style.display = "block";
  livesContainer.style.display = "block";

  // Reseteamos vidas y nivel
  lives = 3;
  currentLevel = 1;
  livesDisplay.textContent = lives;

  // Mostramos la dificultad y nivel en pantalla
  showDifficultyAndLevel();

  // Creamos las bolas iniciales según dificultad y nivel 1
  createBallsForLevel(currentLevel);

  // Posicionamos jugador en el centro
  player.style.left = "375px";

  // Iniciamos bucle juego
  gameInterval = setInterval(updateGame, 20);
}

// Función para mostrar texto de dificultad y nivel
function showDifficultyAndLevel() {
  // Elimina etiqueta anterior si existe
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

// Función que crea las bolas para cada nivel y dificultad
function createBallsForLevel(level) {
  // Primero limpia bolas anteriores
  balls.forEach(ball => game.removeChild(ball));
  balls = [];

  // Variables que definiremos según dificultad y nivel
  let size, speed, count;

  // Ajustes para dificultad fácil
  if (difficultyGlobal === "easy") {
    // Tamaño inicial grande que va disminuyendo con niveles (mín 20)
    size = Math.max(100 - level, 20);
    // Velocidad baja que aumenta con nivel (máx 8)
    speed = Math.min(3 + level * 0.05, 8);
    // Número de bolas (empieza 1, aumenta poco cada 10 niveles)
    count = 1 + Math.floor(level / 10);

    // Creamos las bolas (mismo tamaño y velocidad)
    for (let i = 0; i < count; i++) {
      // Posiciones repartidas para que no se solapen
      let x = 150 + i * (size + 20);
      let y = 100;
      createBallWithSpeed(size, x, y, speed);
    }
  }
  // Ajustes para dificultad media
  else if (difficultyGlobal === "medium") {
    // Tamaño medio fijo (40)
    size = 40;
    // Velocidad más alta que aumenta más rápido (hasta 12)
    speed = Math.min(5 + level * 0.1, 12);
    // Número de bolas aumenta con nivel (hasta 10)
    count = Math.min(1 + Math.floor(level / 5), 10);

    for (let i = 0; i < count; i++) {
      let x = 100 + i * (size + 15);
      let y = 100;
      createBallWithSpeed(size, x, y, speed);
    }
  }
  // Ajustes para dificultad difícil
  else if (difficultyGlobal === "hard") {
    // Tamaño pequeño fijo (30)
    size = 30;
    // Velocidad alta que sube rápido (hasta 15)
    speed = Math.min(7 + level * 0.15, 15);
    // Más bolas (hasta 15)
    count = Math.min(2 + Math.floor(level / 3), 15);

    for (let i = 0; i < count; i++) {
      let x = 80 + i * (size + 10);
      let y = 100;
      createBallWithSpeed(size, x, y, speed);
    }
  }
}

// Función auxiliar que crea una bola con tamaño, posición y velocidad personalizados
function createBallWithSpeed(size, x, y, speed) {
  const ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.width = `${size}px`;
  ball.style.height = `${size}px`;
  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;
  ball.dataset.size = size;

  // Velocidad horizontal aleatoria entre -speed y speed (para movimiento lateral)
  ball.dataset.vx = (Math.random() * 2 * speed - speed).toFixed(2);

  // Velocidad vertical inicial hacia arriba, proporcional a velocidad
  ball.dataset.vy = (-speed * 1.5).toFixed(2);

  game.appendChild(ball);
  balls.push(ball);
}

// Modificamos checkGameOver para pasar al siguiente nivel o terminar juego
function checkGameOver() {
  // Si se acabaron vidas, game over
  if (lives <= 0) {
    clearInterval(gameInterval);
    alert("¡Juego terminado!");
    location.reload();
  }

  // Si no quedan bolas, subimos de nivel o ganamos juego
  if (balls.length === 0) {
    clearInterval(gameInterval);

    if (currentLevel >= maxLevels) {
      alert("¡Has completado todos los niveles! ¡Enhorabuena!");
      location.reload();
      return;
    }

    alert(`¡Has completado el nivel ${currentLevel}! Preparando siguiente nivel...`);
    currentLevel++;
    showDifficultyAndLevel();
    createBallsForLevel(currentLevel);

    // Volvemos a iniciar el bucle del juego
    gameInterval = setInterval(updateGame, 20);
  }
}










