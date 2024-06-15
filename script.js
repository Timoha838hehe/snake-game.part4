class Snake {
  constructor() {
    this.segments = [
      [0, 0]
    ];
    this.direction = 'right'; // possible values: 'up', 'down', 'left', 'right'
  }

  move() {
    const head = this.segments[0].slice();
    switch (this.direction) {
      case 'up':
        head[0]--;
        break;
      case 'down':
        head[0]++;
        break;
      case 'left':
        head[1]--;
        break;
      case 'right':
        head[1]++;
        break;
    }
    this.segments.unshift(head);
    this.segments.pop();
  }

  grow() {
    const tail = this.segments[this.segments.length - 1].slice();
    this.segments.push(tail);
  }
}

class GameStats {
  constructor() {
    this.snakeLength = 1;
    this.freeCells = 99; // 100 - initial snake length
    this.difficultyLevel = 'Easy'; // можна змінювати рівень складності
    this.timeElapsed = 0; // Час з початку гри у секундах
  }

  updateFreeCells() {
    this.freeCells = 100 - this.snakeLength;
  }

  updateTime() {
    this.timeElapsed += 1;
  }

  incrementSnakeLength() {
    this.snakeLength += 1;
    this.updateFreeCells();
  }
}

function updateTimer(stats) {
  stats.updateTime();
  document.getElementById('timer').innerText = `Time: ${stats.timeElapsed}s`;
}

function initGameBoard() {
  const gameBoard = document.getElementById('game-board');

  // Створити 10x10 сітку
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gameBoard.appendChild(cell);
  }
}

function placeSnake(snake) {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => cell.classList.remove('snake'));
  snake.segments.forEach(([row, col]) => {
    const index = row * 10 + col;
    cells[index].classList.add('snake');
  });
}

function generateFood(snake) {
  const cells = document.querySelectorAll('.cell');
  let foodPosition;

  do {
    foodPosition = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10)
    ];
  } while (snake.segments.some(segment => segment[0] === foodPosition[0] && segment[1] === foodPosition[1]));

  const [foodRow, foodCol] = foodPosition;
  const foodIndex = foodRow * 10 + foodCol;
  cells.forEach(cell => cell.classList.remove('food'));
  cells[foodIndex].classList.add('food');
}

function checkCollision(snake) {
  const head = snake.segments[0];
  const body = snake.segments.slice(1);
  const cells = document.querySelectorAll('.cell');
  const foodIndex = Array.from(cells).findIndex(cell => cell.classList.contains('food'));
  const foodRow = Math.floor(foodIndex / 10);
  const foodCol = foodIndex % 10;

  if (head[0] < 0 || head[0] >= 10 || head[1] < 0 || head[1] >= 10) {
    return 'wall';
  }

  if (body.some(segment => segment[0] === head[0] && segment[1] === head[1])) {
    return 'self';
  }

  if (head[0] === foodRow && head[1] === foodCol) {
    return 'food';
  }

  return null;
}

function handleArrowKeyPress(event, snake) {
  const { key } = event;
  switch (key) {
    case 'ArrowUp':
      if (snake.direction !== 'down') {
        snake.direction = 'up';
      }
      break;
    case 'ArrowDown':
      if (snake.direction !== 'up') {
        snake.direction = 'down';
      }
      break;
    case 'ArrowLeft':
      if (snake.direction !== 'right') {
        snake.direction = 'left';
      }
      break;
    case 'ArrowRight':
      if (snake.direction !== 'left') {
        snake.direction = 'right';
      }
      break;
  }
}

function updateGame(snake, stats) {
  snake.move();
  const collision = checkCollision(snake);

  if (collision === 'wall' || collision === 'self') {
    alert('Game Over');
    clearInterval(gameInterval);
  } else if (collision === 'food') {
    snake.grow();
    stats.incrementSnakeLength();
    generateFood(snake);
    document.getElementById('snake-length').innerText = `Snake Length: ${stats.snakeLength}`;
    document.getElementById('free-cells').innerText = `Free Cells: ${stats.freeCells}`;
  }

  placeSnake(snake);
}

function initGame() {
  initGameBoard();

  const snake = new Snake();
  const gameStats = new GameStats();

  placeSnake(snake);

  generateFood(snake);

  document.getElementById('snake-length').innerText = `Snake Length: ${gameStats.snakeLength}`;
  document.getElementById('free-cells').innerText = `Free Cells: ${gameStats.freeCells}`;
  document.getElementById('difficulty-level').innerText = `Difficulty Level: ${gameStats.difficultyLevel}`;

  setInterval(() => updateTimer(gameStats), 1000);

  document.addEventListener('keydown', event => handleArrowKeyPress(event, snake));
  window.gameInterval = setInterval(() => updateGame(snake, gameStats), 500); // Інтервал оновлення гри - 500мс
}

window.onload = initGame;
