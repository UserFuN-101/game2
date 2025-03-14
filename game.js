// game.js
import Player from './player.js';
import Level from './level.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player;
let level;
let gameRunning = true;

const levelData = {
    platforms: [
        {x: 0, y: canvas.height - 20, width: canvas.width, height: 20},
        {x: 300, y: canvas.height - 150, width: 200, height: 20},
        {x: 100, y: canvas.height - 250, width: 150, height: 20}
    ],
    enemies: [
        {type: 'standard', x: 400, y: canvas.height - 50},
        {type: 'sniper', x: 700, y: canvas.height - 50},
        {type: 'standard', x: 150, y: canvas.height - 300}
    ],
    boss: {  // Добавляем босса
        x: 400,
        y: 100
    }
};

function init() {
    player = new Player(100, canvas.height - 100);
    level = new Level(levelData);

    document.addEventListener('keydown', player.handleKeyDown.bind(player));
    document.addEventListener('keyup', player.handleKeyUp.bind(player));

    gameLoop();
}

function update() {
    player.update(level.platforms);
    level.update(player);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    level.render(ctx);
    player.render(ctx);
}

function gameLoop() {
    if (!gameRunning) return;

    update();
    render();

    requestAnimationFrame(gameLoop);
}

init();