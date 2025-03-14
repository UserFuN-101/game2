// level.js
import Platform from './platform.js';
import StandardEnemy from './StandardEnemy.js';
import SniperEnemy from './SniperEnemy.js';
import Boss from './Boss.js';
import { collision } from './physics.js';

class Level {
    constructor(levelData) {
        this.platforms = [];
        this.enemies = [];
        this.boss = null; // Добавляем босса
        this.loadLevel(levelData);
    }

    loadLevel(levelData) {
        levelData.platforms.forEach(platformData => {
            this.platforms.push(new Platform(platformData.x, platformData.y, platformData.width, platformData.height));
        });

        if (levelData.enemies) {
            levelData.enemies.forEach(enemyData => {
                let enemy;
                switch (enemyData.type) {
                    case 'standard':
                        enemy = new StandardEnemy(enemyData.x, enemyData.y);
                        break;
                    case 'sniper':
                        enemy = new SniperEnemy(enemyData.x, enemyData.y);
                        break;
                    default:
                        console.warn('Unknown enemy type:', enemyData.type);
                        return; // Пропускаем неизвестного врага
                }
                this.enemies.push(enemy);
            });
        }

        // Загрузка босса
        if (levelData.boss) {
            this.boss = new Boss(levelData.boss.x, levelData.boss.y);
        }
    }

    update(player) {
        this.enemies.forEach(enemy => enemy.update(player));

        // Обновляем босса, если он есть
        if (this.boss) {
            this.boss.update(player);

            // Проверяем столкновения пуль игрока с боссом
            player.bullets.forEach(bullet => {
                if (this.boss.alive && collision(bullet.x, bullet.y, bullet.radius * 2, bullet.radius * 2, this.boss.x, this.boss.y, this.boss.width, this.boss.height)) {
                    this.boss.takeDamage(20);
                    bullet.x = -100; // Удаляем пулю
                }
            });

            // Проверяем столкновения босса с игроком
             if (this.boss.alive && collision(player.x, player.y, player.width, player.height, this.boss.x, this.boss.y, this.boss.width, this.boss.height)) {
                 player.takeDamage(30); // Более сильный урон от босса
             }

             // Проверяем столкновения пуль босса с игроком
             this.boss.bullets.forEach(bullet => {
                  if (collision(player.x, player.y, player.width, player.height, bullet.x - bullet.radius, bullet.y - bullet.radius, bullet.radius * 2, bullet.radius * 2)) {
                      player.takeDamage(10); // Урон от пули босса
                      bullet.x = -100; // Удаляем пулю
                  }
             });


            if (!this.boss.alive) {
              console.log("Boss defeated! You win!");
                gameRunning = false;
            }
        }


        this.enemies = this.enemies.filter(enemy => enemy.alive);
    }

    render(ctx) {
        this.platforms.forEach(platform => platform.render(ctx));
        this.enemies.forEach(enemy => enemy.render(ctx));

        // Рендерим босса, если он есть
        if (this.boss) {
            this.boss.render(ctx);
        }
    }
}

export default Level;