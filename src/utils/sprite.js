import { Timer } from "./timer.js";

let spritesheets = {};

export class Sprite {
  spritesheet;

  flipX = false;
  flipY = false;

  scaleX = 1;
  scaleY = 1;

  exactWidth = null;
  exactHeight = null;
  useExactSize = false;

  frames = 0;
  currentFrame = 1;

  reverse = false;
  inReverse = false;

  images = [];

  inLastFrame = false;

  timer = new Timer();
  frameDelay = 100;

  constructor(spritesheetPath, x, y, jumpers, reverse, frameDelay = 100) {
    this.x = x;
    this.y = y;

    this.reverse = reverse;
    this.frameDelay = frameDelay;

    if (!spritesheets[spritesheetPath]) {
      spritesheets[spritesheetPath] = new Image(spritesheetPath);
    }

    this.spritesheet = spritesheets[spritesheetPath];

    jumpers.forEach(jumper => {
      this.frames += jumper.imagesLength;

      for (let i = 0; i < jumper.imagesLength; i++) {
        this.images.push({
          x: jumper.imageOffsetX + (i * jumper.widthPerImage),
          y: jumper.imageOffsetY,
          offsetX: jumper.offsetX ?? 0,
          offsetY: jumper.offsetY ?? 0,
          leftOffSetX: jumper.leftOffSetX ?? 0,
          imagesLength: jumper.imagesLength,
          widthPerImage: jumper.widthPerImage,
          heightPerImage: jumper.heightPerImage,
        });
      }
    });
  }

  setScale(x, y) {
    this.scaleX = x;
    this.scaleY = y;
    this.useExactSize = false;
  }

  setSize(width, height) {
    this.exactWidth = width;
    this.exactHeight = height;
    this.useExactSize = true;
  }

  update() {
    if (this.timer.get() < this.frameDelay) return;

    this.currentFrame += this.inReverse ? -1 : 1;

    if (this.currentFrame === this.frames) {
      this.inLastFrame = true;
    } else if (this.currentFrame > this.frames) {
      if (!this.reverse) {
        this.currentFrame = 1;
      } else {
        this.inReverse = true;
        this.currentFrame = this.frames;
      }
    } else if (this.currentFrame < 1) {
      this.inReverse = false;
      this.currentFrame++;
    } else {
      this.inLastFrame = false;
    }

    this.timer.reset();
  }

  draw() {
    const frame = this.images[this.currentFrame - 1];

    let finalWidth, finalHeight;

    if (this.useExactSize) {
      finalWidth = this.exactWidth;
      finalHeight = this.exactHeight;
    } else {
      finalWidth = frame.widthPerImage * this.scaleX;
      finalHeight = frame.heightPerImage * this.scaleY;
    }

    this.spritesheet.width = this.flipX ? -Math.abs(finalWidth) : Math.abs(finalWidth);
    this.spritesheet.height = this.flipY ? -Math.abs(finalHeight) : Math.abs(finalHeight);

    this.spritesheet.startx = frame.x;
    this.spritesheet.endx = frame.x + frame.widthPerImage;

    this.spritesheet.starty = frame.y;
    this.spritesheet.endy = frame.y + frame.heightPerImage;

    this.spritesheet.draw(
      (this.flipX ? this.x + finalWidth + frame.leftOffSetX : this.x + frame.offsetX),
      (this.flipY ? this.y + finalHeight : this.y + frame.offsetY)
    );
  }

  free() {
    this.spritesheet = null;
    std.gc();
  }
}