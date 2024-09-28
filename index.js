const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const tileCount = 20;
const tileSize = width / tileCount - 2;

let xVelocity = 0;
let yVelocity = 0;

let headX = 10;
let headY = 10;

let appleX = 5;
let appleY = 5;

let speed = 4;
let snakeLength = 2;
let snakeParts = [];

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let timeOut = null;

const renderGame = () => {
  console.log("rendering game");
  changeSnakePosition();

  if (isGameOver()) {
    playSoundGameOver();
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";

    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 3);
    ctx.font = "20px Verdana";
    ctx.fillText(
      "Press Enter to restart",
      canvas.width / 4.5,
      canvas.height / 2
    );
    return;
  }

  resetCanvas();
  checkAppleCollision();
  drawApple();
  drawSnake();

  timeOut = setTimeout(renderGame, 1000 / speed);
};

const resetCanvas = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
};

const isGameOver = () => {
  if (yVelocity === 0 && xVelocity === 0) return false;

  if (headX < 0 || headY < 0 || headX >= tileCount || headY >= tileCount) {
    return true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      return true;
    }
  }

  return false;
};

const drawSnake = () => {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY));
  if (snakeParts.length > snakeLength) {
    snakeParts.shift();
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
};

const changeSnakePosition = () => {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
};

const drawApple = () => {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
};

const checkAppleCollision = () => {
  if (appleX === headX && appleY === headY) {
    playSoundEat();
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    snakeLength++;
    speed += 0.5;
  }
};

const restartGame = () => {
  headX = 10;
  headY = 10;
  snakeLength = 2;
  snakeParts = [];

  xVelocity = 0;
  yVelocity = 0;
  clearTimeout(timeOut);
  renderGame();
};

const stopGame = () => {
  clearTimeout(timeOut);
};

const playSoundEat = () => {
  const audio = new Audio("Nyam.mp3");
  audio.play();
};

const playSoundGameOver = () => {
  const audio = new Audio("Babah.mp3");
  audio.play();
};

document.addEventListener("keydown", keyDown);

function keyDown(event) {
  console.log(event.keyCode);

  if (event.key === "ArrowUp") {
    if (yVelocity === 1) return;

    xVelocity = 0;
    yVelocity = -1;
  }
  if (event.key === "ArrowDown") {
    if (yVelocity === -1) return;

    xVelocity = 0;
    yVelocity = 1;
  }
  if (event.key === "ArrowLeft") {
    if (xVelocity === 1) return;

    xVelocity = -1;
    yVelocity = 0;
  }

  if (event.key === "ArrowRight") {
    if (xVelocity === -1) return;
    xVelocity = 1;
    yVelocity = 0;
  }

  if (event.key === "Enter") {
    restartGame();
  }

  if (event.keyCode === 32) {
    if (timeOut) {
      stopGame();
    } else {
      renderGame();
    }
  }
}

renderGame();
