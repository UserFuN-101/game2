// Player.js
import { collision } from './physics.js';
import Bullet from './bullet.js';
import SpriteSheet from './SpriteSheet.js';

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 48;  // Размеры спрайта (подобрать под свой спрайт)
        this.height = 48;
        this.speedX = 0;
        this.speedY = 0;
        this.isJumping = false;
        this.gravity = 0.5;
        this.health = 100;
        this.bullets = [];
        this.lastShotTime = 0;
        this.shotDelay = 200;
        this.facingRight = true;

        this.spriteSheet = null;
        this.currentSprite = 0;
        this.animationSpeed = 0.1;

        this.loadSprites();
    }

    loadSprites() {
        const image = new Image();
        image.src = 'assets/cat_fighter_spritesheet.png';
    
        image.onload = () => {
            this.spriteSheet = new SpriteSheet(image, 48, 48);
            this.animations = {
                idle: [0],                //  Простой кадр
                run: [1, 2, 3, 2],      //  Анимация бега (кадры 1, 2, 3, 2)
                jump: [4],               //  Кадр прыжка
                shoot: [5]              //  Кадр стрельбы
            };
            this.currentAnimation = 'idle';
            console.log('Спрайтшит загружен!'); // Добавили эту строку
        };
    
        image.onerror = () => {
            console.error('Ошибка загрузки спрайтшита!'); // и эту
        };
    }
    handleKeyDown(event) {
        switch (event.key) {
            case 'a':
            case 'ArrowLeft':
                this.speedX = -5;
                this.facingRight = false;
                this.currentAnimation = 'run'; // Начинаем анимацию бега
                break;
            case 'd':
            case 'ArrowRight':
                this.speedX = 5;
                this.facingRight = true;
                this.currentAnimation = 'run'; // Начинаем анимацию бега
                break;
            case 'w':
            case 'ArrowUp':
            case ' ':
                if (!this.isJumping) {
                    this.speedY = -15;
                    this.isJumping = true;
                    this.currentAnimation = 'jump'; // Анимация прыжка
                }
                break;
            case 'j':
                this.shoot();
                this.currentAnimation = 'shoot'; // Анимация стрельбы
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.key) {
            case 'a':
            case 'ArrowLeft':
            case 'd':
            case 'ArrowRight':
                this.speedX = 0;
                this.currentAnimation = 'idle'; // Возвращаемся к простою
                break;
        }
    }

    shoot() {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime > this.shotDelay) {
            const bulletSpeed = this.facingRight ? 10 : -10;
            const bullet = new Bullet(this.x + this.width / 2, this.y + this.height / 2, bulletSpeed, 0);
            this.bullets.push(bullet);
            this.lastShotTime = currentTime;
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            console.log("Game Over!");
            gameRunning = false; // Останавливаем игру
        }
    }

    update(platforms) {
        this.x += this.speedX;
        this.y += this.speedY;

        this.speedY += this.gravity;

        platforms.forEach(platform => {
            if (collision(this.x, this.y, this.width, this.height, platform.x, platform.y, platform.width, platform.height)) {
                if (this.speedY > 0 && this.y + this.height <= platform.y) {
                    this.y = platform.y - this.height;
                    this.speedY = 0;
                    this.isJumping = false;
                } else {
                    this.x -= this.speedX;
                }
            }
        });

        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height;
            this.speedY = 0;
            this.isJumping = false;
        }

        this.bullets.forEach(bullet => bullet.update());
        this.bullets = this.bullets.filter(bullet => bullet.x > 0 && bullet.x < 800);

        // Анимация
        if (this.spriteSheet && this.spriteSheet.image.complete) {
            this.currentSprite += this.animationSpeed;
            // Получаем массив кадров для текущей анимации
            const animationFrames = this.animations[this.currentAnimation];
            // Зацикливаем анимацию
            if (this.currentSprite >= animationFrames.length) {
                this.currentSprite = 0;
            }
        }
    }

    render(ctx) {
        if (!this.spriteSheet || !this.spriteSheet.image.complete) {
            // Если спрайтшит еще не загружен, рисуем прямоугольник
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            return;
        }

        // Получаем текущий кадр анимации
        const animationFrames = this.animations[this.currentAnimation];
        const frameIndex = animationFrames[Math.floor(this.currentSprite)];
        const frame = this.spriteSheet.getFrame(frameIndex);

        // Рисуем спрайт
        ctx.drawImage(
            this.spriteSheet.image,
            frame.x, frame.y, frame.width, frame.height,
            this.x, this.y, this.width, this.height
        );

        //  Отображаем здоровье (как и раньше)
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y - 10, this.width * (this.health / 100), 5);

        this.bullets.forEach(bullet => bullet.render(ctx));
    }
}

export default Player;