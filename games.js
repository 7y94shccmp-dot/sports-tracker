// Mini Games Module

let currentGame = null;
let gameState = {
    score: 0,
    gameActive: false,
    canvas: null,
    ctx: null
};

function startFlappyBall() {
    currentGame = 'flappy';
    initGameArea('Flappy Ball', 'Press SPACE to jump!');
    playFlappyBall();
}

function startPong() {
    currentGame = 'pong';
    initGameArea('Pong Battle', 'Arrow keys to move paddle');
    playPong();
}

function startDunk() {
    currentGame = 'dunk';
    initGameArea('Basketball Dunk', 'Click to jump and dunk!');
    playDunk();
}

function startFootball() {
    currentGame = 'football';
    initGameArea('Football Pass', 'Arrow keys to move and catch!');
    playFootballGame();
}

function initGameArea(title, instructions) {
    const gameArea = document.getElementById('gameArea');
    gameArea.classList.remove('hidden');
    document.getElementById('gameTitle').textContent = title;
    document.getElementById('gameInstructions').textContent = instructions;
    
    const canvas = document.getElementById('gameCanvas');
    gameState.canvas = canvas;
    gameState.ctx = canvas.getContext('2d');
    gameState.score = 0;
    gameState.gameActive = true;
    
    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;
}

function updateScore(score) {
    gameState.score = score;
    document.getElementById('gameScore').textContent = `Score: ${score}`;
}

function closeGame() {
    gameState.gameActive = false;
    currentGame = null;
    document.getElementById('gameArea').classList.add('hidden');
}

// Flappy Ball Game
function playFlappyBall() {
    const canvas = gameState.canvas;
    const ctx = gameState.ctx;
    
    let bird = {
        x: 50,
        y: 150,
        width: 20,
        height: 20,
        velocityY: 0,
        gravity: 0.4,
        jump: -8
    };
    
    let pipes = [];
    let frameCount = 0;
    updateScore(0);
    
    function createPipe() {
        const minHeight = 50;
        const maxHeight = canvas.height - 150;
        const pipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        
        pipes.push({
            x: canvas.width,
            topHeight: pipeHeight,
            width: 40,
            gap: 100
        });
    }
    
    function drawBird() {
        ctx.fillStyle = '#FFC107';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    }
    
    function drawPipes() {
        pipes.forEach(pipe => {
            // Top pipe
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
            
            // Bottom pipe
            const bottomStart = pipe.topHeight + pipe.gap;
            ctx.fillRect(pipe.x, bottomStart, pipe.width, canvas.height - bottomStart);
        });
    }
    
    function update() {
        bird.velocityY += bird.gravity;
        bird.y += bird.velocityY;
        
        // Remove off-screen pipes
        pipes = pipes.filter(pipe => {
            pipe.x -= 5;
            return pipe.x + pipe.width > 0;
        });
        
        // Add new pipes
        if (frameCount % 100 === 0) {
            createPipe();
        }
        
        frameCount++;
    }
    
    function checkCollisions() {
        // Check ground collision
        if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
            return true;
        }
        
        // Check pipe collision
        for (let pipe of pipes) {
            if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width) {
                if (bird.y < pipe.topHeight || bird.y + bird.height > pipe.topHeight + pipe.gap) {
                    return true;
                }
                if (pipe.x + pipe.width === bird.x) {
                    updateScore(gameState.score + 1);
                }
            }
        }
        
        return false;
    }
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawPipes();
        drawBird();
    }
    
    function gameLoop() {
        update();
        
        if (checkCollisions()) {
            gameState.gameActive = false;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        draw();
        
        if (gameState.gameActive) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && gameState.gameActive) {
            bird.velocityY = bird.jump;
        }
    }, { once: false });
    
    gameLoop();
}

// Pong Game
function playPong() {
    const canvas = gameState.canvas;
    const ctx = gameState.ctx;
    
    const paddleHeight = 80;
    const paddleWidth = 10;
    const ballSize = 8;
    
    let gameData = {
        player: { x: 10, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight },
        ai: { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight },
        ball: { x: canvas.width / 2, y: canvas.height / 2, vx: 4, vy: 4, size: ballSize },
        keys: { up: false, down: false },
        playerScore: 0,
        aiScore: 0
    };
    
    updateScore(0);
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw dashed line
        ctx.strokeStyle = '#0f3460';
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw paddles
        ctx.fillStyle = '#0f3460';
        ctx.fillRect(gameData.player.x, gameData.player.y, gameData.player.width, gameData.player.height);
        ctx.fillRect(gameData.ai.x, gameData.ai.y, gameData.ai.width, gameData.ai.height);
        
        // Draw ball
        ctx.fillStyle = '#e94560';
        ctx.beginPath();
        ctx.arc(gameData.ball.x, gameData.ball.y, gameData.ball.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw scores
        ctx.fillStyle = '#16c784';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('P: ' + gameData.playerScore, 20, 30);
        ctx.textAlign = 'right';
        ctx.fillText('AI: ' + gameData.aiScore, canvas.width - 20, 30);
    }
    
    function update() {
        // Player movement
        if (gameData.keys.up && gameData.player.y > 0) {
            gameData.player.y -= 6;
        }
        if (gameData.keys.down && gameData.player.y < canvas.height - paddleHeight) {
            gameData.player.y += 6;
        }
        
        // AI movement
        const aiCenter = gameData.ai.y + paddleHeight / 2;
        if (aiCenter < gameData.ball.y - 35) {
            gameData.ai.y += 4;
        } else if (aiCenter > gameData.ball.y + 35) {
            gameData.ai.y -= 4;
        }
        gameData.ai.y = Math.max(0, Math.min(canvas.height - paddleHeight, gameData.ai.y));
        
        // Ball movement
        gameData.ball.x += gameData.ball.vx;
        gameData.ball.y += gameData.ball.vy;
        
        // Ball collision with walls
        if (gameData.ball.y - ballSize < 0 || gameData.ball.y + ballSize > canvas.height) {
            gameData.ball.vy *= -1;
        }
        
        // Ball collision with paddles
        if (gameData.ball.x - ballSize < gameData.player.x + gameData.player.width &&
            gameData.ball.y > gameData.player.y &&
            gameData.ball.y < gameData.player.y + paddleHeight) {
            gameData.ball.vx *= -1;
            gameData.ball.x = gameData.player.x + gameData.player.width + ballSize;
        }
        
        if (gameData.ball.x + ballSize > gameData.ai.x &&
            gameData.ball.y > gameData.ai.y &&
            gameData.ball.y < gameData.ai.y + paddleHeight) {
            gameData.ball.vx *= -1;
            gameData.ball.x = gameData.ai.x - ballSize;
        }
        
        // Score points
        if (gameData.ball.x < 0) {
            gameData.aiScore++;
            updateScore(gameData.playerScore + gameData.aiScore);
            resetBall();
        }
        if (gameData.ball.x > canvas.width) {
            gameData.playerScore++;
            updateScore(gameData.playerScore + gameData.aiScore);
            resetBall();
        }
    }
    
    function resetBall() {
        gameData.ball.x = canvas.width / 2;
        gameData.ball.y = canvas.height / 2;
        gameData.ball.vx = (Math.random() > 0.5 ? 1 : -1) * 4;
        gameData.ball.vy = (Math.random() - 0.5) * 4;
    }
    
    function gameLoop() {
        draw();
        update();
        
        if (gameState.gameActive) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') gameData.keys.up = true;
        if (e.key === 'ArrowDown') gameData.keys.down = true;
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp') gameData.keys.up = false;
        if (e.key === 'ArrowDown') gameData.keys.down = false;
    });
    
    gameLoop();
}

// Basketball Dunk Game
function playDunk() {
    const canvas = gameState.canvas;
    const ctx = gameState.ctx;
    
    let dunk = {
        player: { x: canvas.width / 2, y: canvas.height - 80, width: 40, height: 60 },
        ball: { x: canvas.width / 2 + 20, y: canvas.height - 100, width: 20, height: 20, velocityY: 0 },
        hoop: { x: canvas.width / 2 - 50, y: 50, width: 100, height: 20 },
        jumping: false,
        jumpForce: 0,
        score: 0
    };
    
    updateScore(0);
    
    function draw() {
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw hoop
        ctx.strokeStyle = '#FF6347';
        ctx.lineWidth = 3;
        ctx.strokeRect(dunk.hoop.x, dunk.hoop.y, dunk.hoop.width, dunk.hoop.height);
        
        // Draw player
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(dunk.player.x, dunk.player.y, dunk.player.width, dunk.player.height);
        
        // Draw ball
        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        ctx.arc(dunk.ball.x, dunk.ball.y, dunk.ball.width, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw score
        ctx.fillStyle = 'black';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Score: ${dunk.score}`, canvas.width / 2, 30);
    }
    
    function update() {
        // Ball physics
        dunk.ball.velocityY += 0.3;
        dunk.ball.y += dunk.ball.velocityY;
        
        // Ball position relative to player
        dunk.ball.x = dunk.player.x + 20;
        
        // Check if ball in hoop
        if (dunk.ball.x > dunk.hoop.x && dunk.ball.x < dunk.hoop.x + dunk.hoop.width &&
            dunk.ball.y > dunk.hoop.y && dunk.ball.y < dunk.hoop.y + dunk.hoop.height) {
            dunk.score++;
            updateScore(dunk.score);
            dunk.ball.y = canvas.height - 100;
            dunk.ball.velocityY = 0;
        }
        
        // Reset if ball goes too low
        if (dunk.ball.y > canvas.height) {
            dunk.ball.y = canvas.height - 100;
            dunk.ball.velocityY = 0;
        }
    }
    
    function gameLoop() {
        draw();
        update();
        
        if (gameState.gameActive) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    canvas.addEventListener('click', () => {
        if (!dunk.jumping && gameState.gameActive) {
            dunk.ball.velocityY = -15;
            dunk.jumping = true;
            setTimeout(() => { dunk.jumping = false; }, 500);
        }
    });
    
    gameLoop();
}

// Football Pass Game
function playFootballGame() {
    const canvas = gameState.canvas;
    const ctx = gameState.ctx;
    
    let football = {
        catcher: { x: canvas.width / 2, y: canvas.height - 40, width: 40, height: 40 },
        balls: [],
        score: 0,
        gameTime: 30,
        keys: { left: false, right: false }
    };
    
    updateScore(0);
    let gameStartTime = Date.now();
    
    function createBall() {
        football.balls.push({
            x: Math.random() * (canvas.width - 30),
            y: 0,
            width: 30,
            height: 30,
            velocityY: Math.random() * 2 + 2
        });
    }
    
    function draw() {
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw catcher
        ctx.fillStyle = '#FF4500';
        ctx.fillRect(football.catcher.x, football.catcher.y, football.catcher.width, football.catcher.height);
        
        // Draw balls
        football.balls.forEach(ball => {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
        });
        
        // Draw time
        const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        const timeLeft = Math.max(0, football.gameTime - elapsed);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Time: ${timeLeft}s`, 10, 30);
    }
    
    function update() {
        // Player movement
        if (football.keys.left && football.catcher.x > 0) {
            football.catcher.x -= 5;
        }
        if (football.keys.right && football.catcher.x < canvas.width - football.catcher.width) {
            football.catcher.x += 5;
        }
        
        // Update balls
        football.balls = football.balls.filter(ball => {
            ball.y += ball.velocityY;
            
            // Check collision with catcher
            if (ball.x < football.catcher.x + football.catcher.width &&
                ball.x + ball.width > football.catcher.x &&
                ball.y < football.catcher.y + football.catcher.height &&
                ball.y + ball.height > football.catcher.y) {
                football.score++;
                updateScore(football.score);
                return false;
            }
            
            return ball.y < canvas.height;
        });
        
        // Check game over
        const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        if (elapsed >= football.gameTime) {
            gameState.gameActive = false;
        }
    }
    
    function gameLoop() {
        draw();
        update();
        
        if (gameState.gameActive) {
            requestAnimationFrame(gameLoop);
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Time Over!', canvas.width / 2, canvas.height / 2);
        }
    }
    
    // Spawn balls
    const spawnInterval = setInterval(() => {
        if (gameState.gameActive) createBall();
        else clearInterval(spawnInterval);
    }, 1500);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') football.keys.left = true;
        if (e.key === 'ArrowRight') football.keys.right = true;
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') football.keys.left = false;
        if (e.key === 'ArrowRight') football.keys.right = false;
    });
    
    gameLoop();
}
