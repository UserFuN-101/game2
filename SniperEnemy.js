// SniperEnemy.js
import Enemy from './enemy.js';

class SniperEnemy extends Enemy {
    constructor(x, y) {
        super(x, y, 20, 30, 0, 30, 3000, 5); // x, y, width, height, speed, health, shotDelay, bulletSpeed
        this.agroRange = 400; // Большая дальность атаки
    }

    update(player) {
        if (!this.alive) return;

        const distance = Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));

        if (distance < this.agroRange) {
            // Стрельба
            this.shoot(player);
        }

        // Обновление пуль
        this.bullets.forEach(bullet => bullet.update());
        this.bullets = this.bullets.filter(bullet => bullet.x > 0 && bullet.x < 800 && bullet.y > 0 && bullet.y < 600);
    }

    render(ctx) {
        if (!this.alive) return;

        ctx.fillStyle = 'darkgreen';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Отрисовка пуль
        this.bullets.forEach(bullet => bullet.render(ctx));
    }
}

export default SniperEnemy;