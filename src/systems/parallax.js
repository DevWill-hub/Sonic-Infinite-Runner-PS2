class ParallaxClass {
    constructor() {
        this.bg1 = new Image("assets/bg/bg1.png");
        this.velocidade1 = 1.5;
        this.pos1X = 0;
        this.pos1Y = 0;

        this.bg2 = new Image("assets/bg/bg2.png");
        this.velocidade2 = 2.5;
        this.pos2X = 0;
        this.pos2Y = 384;
    }

    draw() {
        this.pos1X -= this.velocidade1;
        if (this.pos1X <= -this.bg1.width) {
            this.pos1X = 0;
        }
        this.bg1.draw(this.pos1X, this.pos1Y);
        this.bg1.draw(this.pos1X + this.bg1.width, this.pos1Y);

        this.pos2X -= this.velocidade2;
        if (this.pos2X <= -this.bg2.width) {
            this.pos2X = 0;
        }
        this.bg2.draw(this.pos2X, this.pos2Y);
        this.bg2.draw(this.pos2X + this.bg2.width, this.pos2Y);
    }
}

export const Parallax = new ParallaxClass();