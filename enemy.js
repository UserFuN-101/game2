// enemy.js (базовый класс)
import EnemyBullet from './enemyBullet.js';

class Enemy {
    constructor(x, y, width, height, speed, health, shotDelay, bulletSpeed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.health = health;
        this.alive = true;
        this.agroRange = 200;
        this.bullets = [];
        this.lastShotTime = 0;
        this.shotDelay = shotDelay;
        this.bulletSpeed = bulletSpeed;
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.alive = false;
        }
    }

    shoot(player) {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime > this.shotDelay) {
            // Предсказание позиции игрока
            const predictionFrames = 10;
            const dx = player.x + player.speedX * predictionFrames - this.x;
            const dy = player.y + player.speedY * predictionFrames - this.y;
            const angle = Math.atan2(dy, dx);

            const bulletXSpeed = this.bulletSpeed * Math.cos(angle);
            const bulletYSpeed = this.bulletSpeed * Math.sin(angle);

            const bullet = new EnemyBullet(this.x + this.width / 2, this.y + this.height / 2, bulletXSpeed, bulletYSpeed);
            this.bullets.push(bullet);
            this.lastShotTime = currentTime;
        }
    }

    update(player) {
        if (!this.alive) return;

        const distance = Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));

        if (distance < this.agroRange) {
            if (player.x < this.x) {
                this.speed = -Math.abs(this.speed);
            } else {
                this.speed = Math.abs(this.speed);
            }
            this.x += this.speed;

            // Стрельба
            this.shoot(player);
        } else {
            this.x += this.speed;
            if (this.x < 0 || this.x + this.width > 800) {
                this.speed = -this.speed;
            }
        }

        // Обновление пуль
        this.bullets.forEach(bullet => bullet.update());
        this.bullets = this.bullets.filter(bullet => bullet.x > 0 && bullet.x < 800 && bullet.y > 0 && bullet.y < 600);
    }

    render(ctx) {
        if (!this.alive) return;

        ctx.fillStyle = 'purple';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Отрисовка пуль
        this.bullets.forEach(bullet => bullet.render(ctx));
    }
}

export default Enemy;