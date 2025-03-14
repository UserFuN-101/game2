// enemyBullet.js
class EnemyBullet {
    constructor(x, y, speedX, speedY) {
      this.x = x;
      this.y = y;
      this.speedX = speedX;
      this.speedY = speedY;
      this.radius = 5;
    }
  
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
    }
  
    render(ctx) {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  export default EnemyBullet;