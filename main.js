import { SceneManager } from "./src/core/scenemanager.js";
import { getText, font } from "./src/utils/getFont.js";
import { Sprite } from "./src/utils/sprite.js";
import { canvas } from "./src/core/canvas.js";

canvas.init();

// ===> sounds <===

// Stream
const city = Sound.Stream("assets/sounds/music/city.wav");

// Sfx
const destroy = Sound.Sfx("assets/sounds/sfx/destroy.adp");
const jumpSfx = Sound.Sfx("assets/sounds/sfx/jump.adp");
const ringSfx = Sound.Sfx("assets/sounds/sfx/ring.adp");

// ===> const <===

const GAME_CONSTANTS = {
    PLAYER_JUMP_FORCE: -10,
    GRAVITY: 0.3f,
    FROOR_Y: 369,
    RING_SIZE: { width: 20, height: 20 },
    DIFFICULTY_INCREASE_INTERVAL: 3000000,
    DAY_NIGHT_CYCLE: 120000000,
    TRANSITION_DURATION: 5000000
};

const pad = Pads.get();

const player = {
    x: 60,
    y: 322,
    floor: GAME_CONSTANTS.FROOR_Y,
    largura: 42,
    altura: 47,
    velocidadeX: 0,
    velocidadeY: 0,
    gravidade: GAME_CONSTANTS.GRAVITY,
    forcaPulo: GAME_CONSTANTS.PLAYER_JUMP_FORCE
};

const gameModes = {
    normal: "normal",
    infinity: "infinite"
};

const animations = {
  sonicRun: new Sprite("assets/sprites/sonic/sonic.png", player.x, player.y, [
    {
      imageOffsetX: 0,
      imageOffsetY: 8,
      widthPerImage: 32,
      heightPerImage: 36,
      imagesLength: 8
    }
  ], false, 50),

  sonicJump: new Sprite("assets/sprites/sonic/sonic.png", player.x, player.y, [
    {
        imageOffsetX: 0,
        imageOffsetY: 53,
        widthPerImage: 32,
        heightPerImage: 31,
        imagesLength: 8
    }
  ], false, 50),

  ringsAnim: new Sprite("assets/sprites/items/ring.png", 0, 0, [
    {
        imageOffsetX: 0,
        imageOffsetY: 0,
        widthPerImage: 17,
        heightPerImage: 16,
        imagesLength: 16
    }
  ], false, 50),

  motoBugAnim: new Sprite("assets/sprites/enemies/motobug.png", 0, 0, [
    {
        imageOffsetX: 0,
        imageOffsetY: 1,
        widthPerImage: 48,
        heightPerImage: 29,
        imagesLength: 5
    }
  ], false, 100),
};

animations.sonicRun.setSize(42, 47);
animations.sonicJump.setSize(42, 42);

animations.ringsAnim.setSize(20, 19);
animations.motoBugAnim.setSize(53, 32);

const dayNightSystem = {
    dayBackground: new Image("assets/bg/bg1.png"),
    nightBackground: new Image("assets/bg/bg3.png"),
    
    cycleDuration: 60000000,
    
    timer: null,
    startTime: 0,
    isNightTime: false,
    
    transitioning: false,
    transitionAlpha: 0,
    transitionSpeed: 0.5,
    transitionDuration: GAME_CONSTANTS.TRANSITION_DURATION,
    
    init() {
        this.dayBackground.width = 1163;
        this.dayBackground.height = 448;
        this.nightBackground.width = 1163;
        this.nightBackground.height = 448;

        this.timer = Timer.new();
        this.startTime = Timer.getTime(this.timer);
    },
    
    update() {
        const currentTime = Timer.getTime(this.timer);
        const elapsedTime = currentTime - this.startTime;
        
        if (elapsedTime >= this.cycleDuration) {
            this.isNightTime = !this.isNightTime;
            this.transitioning = true;
            this.transitionAlpha = 0;

            this.startTime = currentTime;
        }
        
        if (this.transitioning) {
            const transitionProgress = Math.min(1, (currentTime - this.startTime) / this.transitionDuration);
            this.transitionAlpha = Math.floor(transitionProgress * 125);
            
            if (transitionProgress >= 1) {
                this.transitioning = false;
            }
        }
    },
    
    draw(x, y) {
        if (this.isNightTime) {
            this.nightBackground.draw(x, y);
            
            if (this.transitioning) {
                this.dayBackground.color = Color.new(125, 125, 125, 125 - this.transitionAlpha);
                this.dayBackground.draw(x, y);
                this.dayBackground.color = Color.new(125, 125, 125);
            }
        } else {
            this.dayBackground.draw(x, y);
            
            if (this.transitioning) {
                this.nightBackground.color = Color.new(125, 125, 125, this.transitionAlpha);
                this.nightBackground.draw(x, y);
                this.nightBackground.color = Color.new(125, 125, 125);
            }
        }
    },

    drawRepeated(x, y, width) {
        this.draw(x, y);
        this.draw(x + width, y);
        
        if (x < -width/2) {
            this.draw(x + (width * 2), y);
        }
    }
};

const parallaxLayers = [
    {
        useDayNightSystem: true,
        speed: 0.5,
        x: 0,         
        y: 0,
        width: 1163
    },
    {
        image: new Image("assets/bg/bg2.png"),
        speed: 1.5,  
        x: 0,         
        y: 369,
        width: 790
    }
];

parallaxLayers[1].image.width = 790;
parallaxLayers[1].image.height = 79;

dayNightSystem.init();

const parallaxRenderer = {
    update() {
        dayNightSystem.update();
        
        parallaxLayers.forEach(layer => {
            layer.x -= layer.speed;
            layer.x = layer.x % layer.width;
        });
    },

    draw() {
        parallaxLayers.forEach(layer => {
            if (layer.useDayNightSystem) {
                dayNightSystem.drawRepeated(layer.x, layer.y, layer.width);
            } else {
                layer.image.draw(layer.x, layer.y);
                layer.image.draw(layer.x + layer.width, layer.y);
                
                if (layer.x < -layer.width/2) {
                    layer.image.draw(layer.x + (layer.width * 2), layer.y);
                }
            }
        });
    }
}

dayNightSystem.cycleDuration = GAME_CONSTANTS.DAY_NIGHT_CYCLE;

const titleScreen = "SONIC RING RUN";
const titleWidth = font.getTextSize(titleScreen);
const posXTitle = (640 - titleWidth.width) / 2;
const posYTitle = 100;

// ===> let <===

let gameSpeed = 1.0;
let scoreMultiplier = 1;
let difficultyInterval = GAME_CONSTANTS.DIFFICULTY_INCREASE_INTERVAL;
let timer = Timer.new();
let lastDifficultyIncrease = Timer.getTime(timer);

let selection = 0;
let ringsColetadas = 0;
let current = "sonicRun";

let currentGameMode = gameModes.normal;

let rings = [
    { x: 182, y: 326, coletada: false },
    { x: 340, y: 326, coletada: false },
    { x: 486, y: 326, coletada: false }
];

let inimigos = [
    { x: 640, y: 337, largura: 53, altura: 32, velocidade: 1.9, vivo: true },
    { x: 815, y: 337, largura: 53, altura: 32, velocidade: 1.9, vivo: true },
    { x: 990, y: 337, largura: 53, altura: 32, velocidade: 1.9, vivo: true }
];

// ===> game scenes <===

const MainMenu = {
    buttons: [],

    init() {
        this.buttons = ["Start Infinite", "Start Normal"];
    },
    
    update() {
        if (!pad) return;

        pad.update();

        if (pad.justPressed(Pads.UP)) {
            selection = (selection - 1 + this.buttons.length) % this.buttons.length;
        }

        if (pad.justPressed(Pads.DOWN)) {
            selection = (selection + 1) % this.buttons.length;
        }
        
        if (pad.justPressed(Pads.CROSS)) {
            if (selection === 0) {
                currentGameMode = gameModes.infinity;
            } else {
                currentGameMode = gameModes.normal;
            }

            SceneManager.change("menu-secondary");
        }
    },

    render() {
        getText("Sonic is by SEGA", 0, 0, {
            scale: 0.5f,
        });

        getText("This is a fangame made by Dev Will using by expiration Sonic Run made by JSLegandDev", 0, 15, {
            scale: 0.5f,
        });

        drawMenu(font, this.buttons, selection, 362);
    },
    
    exit() {
        selection = 0;
    }
};

const SecondaryMenu = {
    buttons: [],

    init() {
        this.buttons = ["Play", "Back"];
        parallaxLayers[1].speed = 4.1;
    },
    
    update() {
        if (!pad) return;

        pad.update();

        if (pad.justPressed(Pads.UP)) {
            selection = (selection - 1 + this.buttons.length) % this.buttons.length;
        }

        if (pad.justPressed(Pads.DOWN)) {
            selection = (selection + 1) % this.buttons.length;
        }
        
        if (pad.justPressed(Pads.CROSS)) {
            if (selection === 0) {
                SceneManager.change("game-play");
            } else {
                SceneManager.change("menu-main");
            }
        }
    },

    render() {
        parallaxRenderer.update();
        parallaxRenderer.draw();

        animations[current].x = player.x;
        animations[current].y = player.y;

        animations[current].update();
        animations[current].draw();

        getText("Press Start to Play", 256, 140, {
            scale: 0.5f,
        });

        getText("Press X to Jump!", 262, 154, {
            scale: 0.5f,
        });

        getText(titleScreen, posXTitle - 40, posYTitle, {
            scale: 1.4f,
        });

        drawMenu(font, this.buttons, selection, 362);
    },
    
    exit() {
        parallaxLayers[1].speed = 1.5;

        selection = 0;
    }
};

const GameScene = {
    
    init() {},
    
    update() {
        if (!pad) return;

        pad.update();
        
        city.play();

        if (currentGameMode === gameModes.infinity && 
            Timer.getTime(timer) - lastDifficultyIncrease > difficultyInterval) {
            increaseDifficulty();
            lastDifficultyIncrease = Timer.getTime(timer);
        }

        if ((pad.btns & Pads.CROSS) && player.y + player.altura >= player.floor) {
            player.velocidadeY = player.forcaPulo;
            jumpSfx.play();
        }

        player.velocidadeY += player.gravidade;
        player.x += player.velocidadeX * gameSpeed;
        player.y += player.velocidadeY;

        if (player.y + player.altura > player.floor) {
            player.y = player.floor - player.altura;
            player.velocidadeY = 0;
        }

        if (player.y + player.altura < player.floor) {
            current = "sonicJump";
        } else {
            current = "sonicRun";
        }
    },

    render() {
        parallaxRenderer.update();
        parallaxRenderer.draw();

        font.print(10, 10, `SCORE : ${ringsColetadas}`);

        for (let i = 0; i < rings.length; i++) {
            let ring = rings[i];

            if (!ring.coletada) {
                animations.ringsAnim.x = ring.x;
                animations.ringsAnim.y = ring.y;

                animations.ringsAnim.update();
                animations.ringsAnim.draw();

                if (checkCollision(
                    player, 
                    ring, 
                    { width: player.largura, height: player.altura },
                    GAME_CONSTANTS.RING_SIZE
                )) {
                    ring.coletada = true;
                    ringsColetadas++;
                    ringSfx.play();
                }
            }

            ring.x -= parallaxLayers[1].speed;
            if (ring.x < -20) {
                respawnRings(ring);
            }
        }

        for (let i = 0; i < inimigos.length; i++) {
            let inimigo = inimigos[i];

            if (inimigo.vivo) {
                animations.motoBugAnim.x = inimigo.x;
                animations.motoBugAnim.y = inimigo.y;

                animations.motoBugAnim.update();
                animations.motoBugAnim.draw();

                inimigo.x -= inimigo.velocidade;

                if (inimigo.x < -50) {
                    inimigo.vivo = false;
                    respawnInimigo(inimigo);
                }

                if (checkCollision(
                    player, 
                    inimigo, 
                    { width: player.largura, height: player.altura },
                    { width: inimigo.largura, height: inimigo.altura }
                )) {
                    if (player.y + player.altura - 10 < inimigo.y) {
                        destroy.play();
                        ringsColetadas += 10;
                        inimigo.vivo = false;
                        player.velocidadeY = player.forcaPulo * 0.9f;
                        respawnInimigo(inimigo);
                    } else {
                        SceneManager.change("game-over");
                    }
                }
            }
        }

        animations[current].x = player.x;
        animations[current].y = player.y;

        animations[current].update();
        animations[current].draw();
    },

    exit() {
        city.pause();

        if (typeof std !== "undefined" && std.gc) {
            std.gc();
        }
    }
};

const GameOverScene = {
    init() {

    },

    update() {
        if (!pad) return;

        pad.update()

        if (pad.justPressed(Pads.START)) {
            resetGame();
            SceneManager.change("game-play");
        }

        if (pad.justPressed(Pads.SELECT)) {
            resetGame();
            SceneManager.change("menu-main");
        }
    },

    render() {
        const finalScore = Math.floor(ringsColetadas * scoreMultiplier);

        Draw.rect(50, 150, 160, 160, Color.new(255, 255, 255));
        Draw.rect(430, 150, 160, 160, Color.new(255, 255, 255));

        Draw.rect(54, 154, 152, 152, Color.new(0, 0, 0));
        Draw.rect(434, 154, 152, 152, Color.new(0, 0, 0));        

        font.print(posXTitle + 20, posYTitle, "GAME OVER");

        font.print(45, 120, `BEST SCORE : 0`);
        font.print(405, 120, `CURRENT SCORE : ${finalScore}`);

        getText("B                        F", 120, 210, {
            scale: 1.5f,
        });

        getText("Press START to Play Again", 320 - 70, 300, {
            scale: 0.5f,
        });

        getText("Press SELECT for Menu-Main", 320 - 77, 320, {
            scale: 0.5f,
        });
    },

    exit() {
        city.pause();
    }
};

// ===> functions <===

function drawMenu(font, items, selectedIndex, startY) {
  const itemSpacing = 40;

  items.forEach((item, index) => {
    const yPos = startY + (index * itemSpacing);
    const textWidth = font.getTextSize(item).width;
    const xPos = 640 / 2 - textWidth / 2;

    if (index === selectedIndex) {
        const marker = ">";
        const markerWidth = font.getTextSize(marker).width;
        font.print(xPos - markerWidth - 15, yPos, marker);
        font.print(xPos + textWidth + 10, yPos, "<");
    }

    font.print(xPos, yPos, item);
  });
}

function increaseDifficulty() {
  if (currentGameMode === gameModes.infinity) {
    gameSpeed += 0.11;
    scoreMultiplier += 0.1;

    parallaxLayers[0].speed = 0.5 * gameSpeed;
    parallaxLayers[1].speed = 1.5 * gameSpeed;
    
    inimigos.forEach(inimigo => {
      inimigo.velocidade = 1.8 * gameSpeed;
    });

    dayNightSystem.cycleDuration = Math.max(30000000, 120000000 - (gameSpeed * 10000000));
  }
}

function respawnInimigo(inimigo) {
    if (!inimigo) return;

    inimigo.x = 900 + Math.random() * 200;
    inimigo.vivo = true;   
}

function respawnRings(ring) {
    if (!ring) return;

    ring.x = 640 + 50 + (Math.random() * 400)
    ring.coletada = false;
}

function resetGame() {
    player.x = 60;
    player.y = 322;
    player.velocidadeX = 0;
    player.velocidadeY = 0;

    ringsColetadas = 0;
    gameSpeed = 1.0f;
    selection = 0;
    scoreMultiplier = 1;
    current = "sonicRun";

    parallaxLayers[0].speed = 0.5f;
    parallaxLayers[1].speed = 1.5f;
    
    if (dayNightSystem.timer) {
        dayNightSystem.isNightTime = false;
        dayNightSystem.transitioning = false;
        dayNightSystem.startTime = Timer.getTime(dayNightSystem.timer);
        dayNightSystem.cycleDuration = GAME_CONSTANTS.DAY_NIGHT_CYCLE;
    }
    
    inimigos.forEach((inimigo, index) => {
        inimigo.x = 640 + (index * 175);
        inimigo.vivo = true;
        inimigo.velocidade = 1.8f;
    });

    rings.forEach((ring, index) => {
        ring.x = 182 + (index * 158);
        ring.coletada = false;
    });
    
    if (timer) {
        lastDifficultyIncrease = Timer.getTime(timer);
    }
}

function checkCollision(obj1, obj2, size1, size2) {
    return (
        obj1.x < obj2.x + size2.width &&
        obj1.x + size1.width > obj2.x &&
        obj1.y < obj2.y + size2.height &&
        obj1.y + size1.height > obj2.y
    );
}

// ===> SceneManager <===

SceneManager.register("menu-main", MainMenu);
SceneManager.register("menu-secondary", SecondaryMenu);
SceneManager.register("game-play", GameScene);
SceneManager.register("game-over", GameOverScene);

SceneManager.change("menu-main");

// -------------------------------------

Screen.display(() => {
    SceneManager.update();
    SceneManager.render();
});