import { useEffect, useMemo, useRef, useState } from 'react';

type Point = { x: number; y: number };

type Direction = 'Up' | 'Down' | 'Left' | 'Right';

const GRID_SIZE = 18;
const CELL_SIZE = 22;
const INITIAL_SNAKE: Point[] = [
  { x: 8, y: 9 },
  { x: 7, y: 9 },
  { x: 6, y: 9 },
];

const getRandomPoint = (exclude: Point[]): Point => {
  const occupied = new Set(exclude.map((point) => `${point.x},${point.y}`));
  let next: Point;
  do {
    next = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (occupied.has(`${next.x},${next.y}`));
  return next;
};

const directionMap: Record<Direction, Point> = {
  Up: { x: 0, y: -1 },
  Down: { x: 0, y: 1 },
  Left: { x: -1, y: 0 },
  Right: { x: 1, y: 0 },
};

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>('Right');
  const [apple, setApple] = useState<Point>(() => getRandomPoint(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const nextDirection = useRef<Direction>('Right');
  const intervalRef = useRef<number | null>(null);

  const draw = (snakeCells: Point[], appleCell: Point) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#38bdf8';
    snakeCells.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#22d3ee' : '#60a5fa';
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(
      appleCell.x * CELL_SIZE + CELL_SIZE / 2,
      appleCell.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection('Right');
    nextDirection.current = 'Right';
    setApple(getRandomPoint(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setIsRunning(true);
  };

  const moveSnake = () => {
    const head = snake[0];
    const vector = directionMap[nextDirection.current];
    const nextHead = {
      x: (head.x + vector.x + GRID_SIZE) % GRID_SIZE,
      y: (head.y + vector.y + GRID_SIZE) % GRID_SIZE,
    };

    const collided = snake.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);
    if (collided) {
      setIsRunning(false);
      setGameOver(true);
      return;
    }

    const willGrow = nextHead.x === apple.x && nextHead.y === apple.y;
    const nextSnake = [nextHead, ...snake];
    if (!willGrow) nextSnake.pop();

    setSnake(nextSnake);

    if (willGrow) {
      setScore((current) => current + 1);
      setApple(getRandomPoint(nextSnake));
    }
  };

  useEffect(() => {
    draw(snake, apple);
  }, [snake, apple]);

  useEffect(() => {
    if (!isRunning) return;
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => moveSnake(), 120);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isRunning, snake, apple]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isRunning) return;

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
            return undefined;
        }
      })();

      if (!next) return;
      event.preventDefault();

      const current = nextDirection.current;
      if (
        (current === 'Up' && next === 'Down') ||
        (current === 'Down' && next === 'Up') ||
        (current === 'Left' && next === 'Right') ||
        (current === 'Right' && next === 'Left')
      ) {
        return;
      }
      nextDirection.current = next;
      setDirection(next);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning]);

  const instructions = useMemo(
    () => '使用方向鍵操作，吃掉紅色果實即可得分。撞到自己會遊戲結束。',
    []
  );

  return (
    <div className="snake-wrapper">
      <div className="game-panel">
        <h2>小遊戲：貪吃蛇</h2>
        <p>{instructions}</p>
        <div className="game-info">
          <span>分數: {score}</span>
          <span>狀態: {gameOver ? '遊戲結束' : isRunning ? '進行中' : '準備中'}</span>
        </div>
        <div className="game-actions">
          <button className="primary" type="button" onClick={resetGame}>
            {gameOver || !isRunning ? '開始/重新開始' : '重新開始'}
          </button>
          <button className="secondary" type="button" onClick={() => setIsRunning((v) => !v)}>
            {isRunning ? '暫停' : '繼續'}
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE} aria-label="貪吃蛇遊戲畫布" />
    </div>
  );
};

export default SnakeGame;
