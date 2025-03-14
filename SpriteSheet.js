// SpriteSheet.js
class SpriteSheet {
    constructor(image, frameWidth, frameHeight) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.framesPerRow = Math.floor(image.width / frameWidth);
    }

    getFrame(frameIndex) {
        const row = Math.floor(frameIndex / this.framesPerRow);
        const col = frameIndex % this.framesPerRow;
        const x = col * this.frameWidth;
        const y = row * this.frameHeight;

        return { x, y, width: this.frameWidth, height: this.frameHeight };
    }
}

export default SpriteSheet;