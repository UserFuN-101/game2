// Boss.js
import EnemyBullet from './enemyBullet.js';
import { collision } from './physics.js';

class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 100;
        this.health = 500;
        this.maxHealth = 500; // Для отображения индикатора здоровья
        this.alive = true;
        this.attackPattern = 0; // Индекс текущего паттерна атаки
        this.lastAttackTime = 0;
        this.attackCooldown = 3000; // Время между атаками (3 секунды)
        this.healing = false; // Флаг, показывающий, что босс лечится

        // Настройка параметров атак (примерные значения)
        this.bulletSpeed = 3;
        this.predictionFrames = 10;

    }

    takeDamage(damage) {
        if (!this.healing) { // Нельзя нанести урон, когда лечится
            this.health -= damage;
            if (this.health <= 0) {
                this.alive = false;
            }
        }
    }

    // Атака 1: Стрельба с упреждением
    attack1(player) {
        const numBullets = Math.floor(Math.random() * 3) + 5; // Случайное кол-во пуль (5-7)

        for (let i = 0; i < numBullets; i++) {
            const dx = player.x + player.speedX * this.predictionFrames - this.x;
            const dy = player.y + player.speedY * this.predictionFrames - this.y;
            const angle = Math.atan2(dy, dx);

            const bulletXSpeed = this.bulletSpeed * Math.cos(angle);
            const bulletYSpeed = this.bulletSpeed * Math.sin(angle);

            const bullet = new EnemyBullet(this.x + this.width / 2, this.y + this.height / 2, bulletXSpeed, bulletYSpeed);
            this.bullets.push(bullet);
        }
    }

    // Атака 2: Веерная атака (нужно спрятаться под платформой)
    attack2() {
        const numBullets = 16; // Кол-во пуль в веере
        for (let i = 0; i < numBullets; i++) {
            const angle = (i / numBullets) * Math.PI * 2; // Равномерно распределяем по кругу

            const bulletXSpeed = this.bulletSpeed * Math.cos(angle);
            const bulletYSpeed = this.bulletSpeed * Math.sin(angle);

            const bullet = new EnemyBullet(this.x + this.width / 2, this.y + this.height / 2, bulletXSpeed, bulletYSpeed);
            this.bullets.push(bullet);
        }
    }

    // Атака 3: Рывок (упрощенно - просто движение к игроку)
    attack3(player) {
        const numDashes = Math.floor(Math.random() * 3) + 3;
        for(let i = 0; i < numDashes; i++) {
              // Упрощенный рывок: просто меняем направление скорости, чтобы приблизиться к игроку.
              if (player.x < this.x) {
                  this.speed = -5; // Двигаемся влево
              } else {
                  this.speed = 5; // Двигаемся вправо
              }

              this.x += this.speed;
        }

        // После рывка выпускаем пули вокруг себя
        const numBullets = 8;
        for (let i = 0; i < numBullets; i++) {
            const angle = (i / numBullets) * Math.PI * 2;

            const bulletXSpeed = 2 * Math.cos(angle);
            const bulletYSpeed = 2 * Math.sin(angle);

            const bullet = new EnemyBullet(this.x + this.width / 2, this.y + this.height / 2, bulletXSpeed, bulletYSpeed);
            this.bullets.push(bullet);
        }
    }

    // Лечение
    heal() {
        if (this.health < this.maxHealth) {
            this.healing = true;
            // Восстанавливаем здоровье (не мгновенно)
            this.health = Math.min(this.health + this.maxHealth * 0.5, this.maxHealth); // Восстанавливаем 50%, но не больше максимума
        }
    }

    // Выбор атаки
    chooseAttack(player) {
        const currentTime = Date.now();
        if (currentTime - this.lastAttackTime > this.attackCooldown) {
            this.attackPattern = Math.floor(Math.random() * 4); // Случайный выбор атаки (0-3)

            switch (this.attackPattern) {
                case 0:
                    this.attack1(player);
                    break;
                case 1:
                    this.attack2();
                    break;
                case 2:
                    this.attack3(player);
                    break;
                case 3:
                     if (!this.healing) { // Если не лечится, то лечим
                         this.heal();
                     }
                    break;
            }
            this.lastAttackTime = currentTime;
        }
    }

    update(player) {
        if (!this.alive) return;

        this.chooseAttack(player);

        //Обновление пуль и их удаление за пределами экрана
        this.bullets.forEach(bullet => bullet.update());
        this.bullets = this.bullets.filter(bullet => bullet.x > 0 && bullet.x < 800 && bullet.y > 0 && bullet.y < 600);

        if(this.healing){
            //Если лечится, то перестаем через 3 секунды
            if(Date.now() - this.lastAttackTime > 3000){
                this.healing = false;
            }
        }
    }

    render(ctx) {
        if (!this.alive) return;

        ctx.fillStyle = 'darkred';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Индикатор здоровья
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y - 10, this.width * (this.health / this.maxHealth), 5);

        // Рендерим пули
        this.bullets.forEach(bullet => bullet.render(ctx));
    }
}

export default Boss;