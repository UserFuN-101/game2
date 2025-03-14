// StandardEnemy.js
import Enemy from './enemy.js';

class StandardEnemy extends Enemy {
    constructor(x, y) {
        super(x, y, 20, 30, 2, 50, 1500, 3); // x, y, width, height, speed, health, shotDelay, bulletSpeed
    }
}

export default StandardEnemy;