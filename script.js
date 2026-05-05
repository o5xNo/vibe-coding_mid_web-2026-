const canvas = document.getElementById('snake-canvas');
const scoreLabel = document.getElementById('score');
const statusLabel = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
const pauseButton = document.getElementById('pause-button');

const GRID_SIZE = 18;
const CELL_SIZE = 22;
const INITIAL_SNAKE = [
  { x: 8, y: 9 },
  { x: 7, y: 9 },
  { x: 6, y: 9 },
];

const directionMap = {
  Up: { x: 0, y: -1 },
  Down: { x: 0, y: 1 },
  Left: { x: -1, y: 0 },
  Right: { x: 1, y: 0 },
};

let snake = [...INITIAL_SNAKE];
let direction = 'Right';
let nextDirection = 'Right';
let apple = null;
let score = 0;
let isRunning = false;
let gameOver = false;
let intervalId = null;

function getRandomPoint(exclude) {
  const occupied = new Set(exclude.map((point) => `${point.x},${point.y}`));
  let next;
  do {
    next = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (occupied.has(`${next.x},${next.y}`));
  return next;
}

function updateLabels() {
  if (scoreLabel) scoreLabel.textContent = `分數: ${score}`;
  if (statusLabel)
    statusLabel.textContent = `狀態: ${gameOver ? '遊戲結束' : isRunning ? '進行中' : '準備中'}`;
}

function draw() {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#22d3ee' : '#60a5fa';
    ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
  });

  if (apple) {
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(
      apple.x * CELL_SIZE + CELL_SIZE / 2,
      apple.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

function setGameState(running) {
  isRunning = running;
  updateLabels();
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (isRunning && !gameOver) {
    intervalId = setInterval(moveSnake, 120);
  }
}

function resetGame() {
  snake = [...INITIAL_SNAKE];
  direction = 'Right';
  nextDirection = 'Right';
  apple = getRandomPoint(snake);
  score = 0;
  gameOver = false;
  setGameState(true);
  draw();
}

function moveSnake() {
  const head = snake[0];
  direction = nextDirection;
  const vector = directionMap[direction];
  const nextHead = {
    x: (head.x + vector.x + GRID_SIZE) % GRID_SIZE,
    y: (head.y + vector.y + GRID_SIZE) % GRID_SIZE,
  };

  const collided = snake.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);
  if (collided) {
    gameOver = true;
    setGameState(false);
    updateLabels();
    return;
  }

  const willGrow = apple && nextHead.x === apple.x && nextHead.y === apple.y;
  const nextSnake = [nextHead, ...snake];
  if (!willGrow) nextSnake.pop();
  snake = nextSnake;

  if (willGrow) {
    score += 1;
    apple = getRandomPoint(snake);
  }

  draw();
  updateLabels();
}

function handleKeyDown(event) {
  const key = event.key;
  const next = (() => {
    switch (key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        return 'Up';
      case 'ArrowDown':
      case 's':
      case 'S':
        return 'Down';
      case 'ArrowLeft':
      case 'a':
      case 'A':
        return 'Left';
      case 'ArrowRight':
      case 'd':
      case 'D':
        return 'Right';
      default:
        return null;
    }
  })();

  if (!next) return;
  event.preventDefault();

  if (
    (direction === 'Up' && next === 'Down') ||
    (direction === 'Down' && next === 'Up') ||
    (direction === 'Left' && next === 'Right') ||
    (direction === 'Right' && next === 'Left')
  ) {
    return;
  }

  nextDirection = next;
}

function togglePause() {
  if (gameOver) return;
  const nextState = !isRunning;
  setGameState(nextState);
  if (pauseButton) {
    pauseButton.textContent = nextState ? '暫停' : '繼續';
  }
}

window.addEventListener('keydown', handleKeyDown);
resetButton.addEventListener('click', resetGame);
pauseButton.addEventListener('click', togglePause);

resetGame();
