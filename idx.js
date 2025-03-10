const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const radius = 8; 
const canvasWidth = canvas.width - radius;
const canvasHeight = canvas.height - radius;

let snake = [{x : canvasWidth / 2, y : canvasHeight / 2}];
let food  = {};
let score = 0;
let direction = 'right';

const scoreHtml = document.getElementById('score');

const drawFood = (xOrdinate, yOrdinate) => {
    ctx.beginPath();
    ctx.arc(xOrdinate, yOrdinate, radius, 0, Math.PI * 2, false); 
    ctx.fillStyle = 'blue'; 
    ctx.fill();  
    ctx.stroke(); 
};

const generateFood = () => {
    const xOrdinate = Math.floor(Math.random() * (canvasWidth - 2 * radius)) + radius;
    const yOrdinate = Math.floor(Math.random() * (canvasHeight - 2 * radius)) + radius;

    food.x = xOrdinate;
    food.y = yOrdinate;

    drawFood(xOrdinate, yOrdinate);
};

const drawSnake = () => {
    for(let i = 0; i < snake.length; i++) {
        ctx.beginPath();
        ctx.arc(snake[i].x, snake[i].y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.stroke();
    }
};

const checkOut = () => {
    let head = snake[0];
    if(head.x < 0 || head.y < 0 || head.x >= canvasWidth || head.y >= canvasHeight)
        return true;

    for(let i = 1; i < snake.length; i++) {
        const dx = head.x - snake[i].x;
        const dy = head.y - snake[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if(distance < 2 * radius) { 
            return true;
        }
    }
    return false;
};

const moveSnake = () => {
    const curHead = snake[0];
    let newHead = {};

    switch(direction) {
        case 'right':
            newHead.x = curHead.x + 2 * radius; 
            newHead.y = curHead.y; 
            break;
        case 'left':
            newHead.x = curHead.x - 2 * radius;
            newHead.y = curHead.y; 
            break;
        case 'down':  
            newHead.x = curHead.x; 
            newHead.y = curHead.y + 2 * radius; 
            break;
        case 'up':  
            newHead.x = curHead.x; 
            newHead.y = curHead.y - 2 * radius; 
            break;
    }

    snake.unshift(newHead); 

    const dx = newHead.x - food.x;
    const dy = newHead.y - food.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 2 * radius) { 
        score++; 
        scoreHtml.innerText = score;
        generateFood(); 
    } 
    else {
        snake.pop(); 
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSnake(); 
    drawFood(food.x, food.y); 
};

const changeDirection = (event) => {
    if (event.key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } 
    else if (event.key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    } 
    else if (event.key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } 
    else if (event.key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    }
};

document.addEventListener('keydown', changeDirection);

const gameLoop = () => {
    moveSnake();
    if(checkOut()) {
        clearInterval(gameInterval);
        finishGame();
        return;
    }
}

let gameInterval;
const startBtn = document.getElementById('startBtn');

const finishGame = () => {
    const finishDiv = document.createElement("div");
    finishDiv.classList.add("reStart");  

    const finishH2 = document.createElement('h2');
    finishH2.innerHTML = `Game Over! Your Score is ${score}`;
    finishDiv.appendChild(finishH2);

    const playBtn = document.createElement('button');
    playBtn.innerText = "Play Again";  
    playBtn.onclick = () => {
        document.body.removeChild(finishDiv);
        startGame();
    };
    finishDiv.appendChild(playBtn);
    document.body.appendChild(finishDiv);
};

function startGame() {
    snake = [{x: canvasWidth / 2, y: canvasHeight / 2}];
    direction = 'right';
    score = 0;
    scoreHtml.innerText = score;
    
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    
    generateFood();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood(food.x, food.y);

    startBtn.style.display = 'none';
    gameInterval = setInterval(gameLoop, 100);
}

startBtn.style.display = 'block';
startBtn.addEventListener('click', startGame);
