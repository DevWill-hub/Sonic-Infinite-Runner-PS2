/*******************************************************************************
 * 
 * SONIC INFINITY RUNNER - PS2
 * 
 * SOURCE CODE
 * 
 * DEVOLOPED WITH: AthenaEnv Engine
 * DEVELOPED BY: Dev Will
 * BASED ON: Sonic Run by JSLegendDev
 * SONIC CHARACTER © SEGA
 * 
 * FAN GAME - NOT FOR COMMERCIAL USE
 * 
 ******************************************************************************/

// === IMPORTS ===
import { SceneManager } from "./src/core/scenemanager.js";
import { getText, font } from "./src/utils/getFont.js";
import { Sprite } from "./src/utils/sprite.js";
import { canvas } from "./src/core/canvas.js";

// === INITIALIZATION ===
canvas.init();

// === GAME CONSTANTS ===
const GAME_CONSTANTS = {
    PLAYER_JUMP_FORCE: -10,
    GRAVITY: 0.3,
    FLOOR_Y: 369,
    RING_SIZE: { width: 20, height: 20 },
    DIFFICULTY_INCREASE_INTERVAL: 3000000,
    DAY_NIGHT_CYCLE: 120000000,
    TRANSITION_DURATION: 5000000,
    SCREEN_WIDTH: 640,
    SCREEN_HEIGHT: 448
};

// === SOUND SYSTEM ===
class SoundManager {
    constructor() {
        this.music = {
            city: Sound.Stream("assets/sounds/music/city.wav")
        };
        
        this.sfx = {
            destroy: Sound.Sfx("assets/sounds/sfx/destroy.adp"),
            jump: Sound.Sfx("assets/sounds/sfx/jump.adp"),
            ring: Sound.Sfx("assets/sounds/sfx/ring.adp")
        };
        
        this.isMuted = false;
    }
    
    playMusic(track) {
        if (!this.isMuted && this.music[track]) {
            this.music[track].play();
        }
    }
    
    playSfx(sound) {
        if (!this.isMuted && this.sfx[sound]) {
            this.sfx[sound].play();
        }
    }
    
    pauseMusic() {
        Object.values(this.music).forEach(track => track.pause());
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.pauseMusic();
        }
    }
}

const soundManager = new SoundManager();

// === INPUT MANAGER ===
const pad = Pads.get();

// === PLAYER CONFIGURATION ===
const player = {
    x: 60,
    y: 322,
    floor: GAME_CONSTANTS.FLOOR_Y,
    width: 42,
    height: 47,
    velocityX: 0,
    velocityY: 0,
    gravity: GAME_CONSTANTS.GRAVITY,
    jumpForce: GAME_CONSTANTS.PLAYER_JUMP_FORCE,
    isGrounded: true
};

// === GAME MODES ===
const GAME_MODES = {
    NORMAL: "normal",
    INFINITE: "infinite"
};

// === ANIMATION MANAGER ===
class AnimationManager {
    constructor() {
        this.animations = {
            sonicRun: this.createSonicRun(),
            sonicJump: this.createSonicJump(),
            ringsAnim: this.createRingsAnim(),
            motoBugAnim: this.createMotoBugAnim()
        };
    }
    
    createSonicRun() {
        const sprite = new Sprite("assets/sprites/sonic/sonic.png", player.x, player.y, [
            {
                imageOffsetX: 0,
                imageOffsetY: 8,
                widthPerImage: 32,
                heightPerImage: 36,
                imagesLength: 8
            }
        ], false, 50);
        sprite.setSize(42, 47);
        return sprite;
    }
    
    createSonicJump() {
        const sprite = new Sprite("assets/sprites/sonic/sonic.png", player.x, player.y, [
            {
                imageOffsetX: 0,
                imageOffsetY: 53,
                widthPerImage: 32,
                heightPerImage: 31,
                imagesLength: 8
            }
        ], false, 50);
        sprite.setSize(42, 42);
        return sprite;
    }
    
    createRingsAnim() {
        const sprite = new Sprite("assets/sprites/items/ring.png", 0, 0, [
            {
                imageOffsetX: 0,
                imageOffsetY: 0,
                widthPerImage: 17,
                heightPerImage: 16,
                imagesLength: 16
            }
        ], false, 50);
        sprite.setSize(20, 19);
        return sprite;
    }
    
    createMotoBugAnim() {
        const sprite = new Sprite("assets/sprites/enemies/motobug.png", 0, 0, [
            {
                imageOffsetX: 0,
                imageOffsetY: 1,
                widthPerImage: 48,
                heightPerImage: 29,
                imagesLength: 5
            }
        ], false, 100);
        sprite.setSize(53, 32);
        return sprite;
    }
    
    getAnimation(name) {
        return this.animations[name];
    }
    
    updateAnimation(name, x, y) {
        const anim = this.animations[name];
        if (anim) {
            anim.x = x;
            anim.y = y;
            anim.update();
        }
    }
    
    drawAnimation(name) {
        const anim = this.animations[name];
        if (anim) {
            anim.draw();
        }
    }
}

const animationManager = new AnimationManager();

// === DAY/NIGHT SYSTEM ===
class DayNightSystem {
    constructor() {
        this.dayBackground = new Image("assets/bg/bg1.png");
        this.nightBackground = new Image("assets/bg/bg3.png");
        
        this.cycleDuration = GAME_CONSTANTS.DAY_NIGHT_CYCLE;
        this.transitionDuration = GAME_CONSTANTS.TRANSITION_DURATION;
        
        this.timer = Timer.new();
        this.startTime = Timer.getTime(this.timer);
        
        this.isNightTime = false;
        this.transitioning = false;
        this.transitionAlpha = 0;
        
        this.initBackgrounds();
    }
    
    initBackgrounds() {
        this.dayBackground.width = 1163;
        this.dayBackground.height = 448;
        this.nightBackground.width = 1163;
        this.nightBackground.height = 448;
    }
    
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
    }
    
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
    }
    
    drawRepeated(x, y, width) {
        this.draw(x, y);
        this.draw(x + width, y);
        
        if (x < -width / 2) {
            this.draw(x + (width * 2), y);
        }
    }
    
    setCycleDuration(duration) {
        this.cycleDuration = duration;
    }
    
    reset() {
        this.isNightTime = false;
        this.transitioning = false;
        this.startTime = Timer.getTime(this.timer);
        this.cycleDuration = GAME_CONSTANTS.DAY_NIGHT_CYCLE;
    }
}

const dayNightSystem = new DayNightSystem();

// === PARALLAX SYSTEM ===
class ParallaxSystem {
    constructor() {
        this.layers = [
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
        
        this.initLayers();
    }
    
    initLayers() {
        // Configure second layer
        this.layers[1].image.width = 790;
        this.layers[1].image.height = 79;
    }
    
    update() {
        dayNightSystem.update();
        
        this.layers.forEach(layer => {
            layer.x -= layer.speed;
            layer.x = layer.x % layer.width;
        });
    }
    
    draw() {
        this.layers.forEach(layer => {
            if (layer.useDayNightSystem) {
                dayNightSystem.drawRepeated(layer.x, layer.y, layer.width);
            } else {
                layer.image.draw(layer.x, layer.y);
                layer.image.draw(layer.x + layer.width, layer.y);
                
                if (layer.x < -layer.width / 2) {
                    layer.image.draw(layer.x + (layer.width * 2), layer.y);
                }
            }
        });
    }
    
    setLayerSpeed(layerIndex, speed) {
        if (this.layers[layerIndex]) {
            this.layers[layerIndex].speed = speed;
        }
    }
    
    reset() {
        this.layers.forEach(layer => {
            layer.x = 0;
        });
        this.setLayerSpeed(0, 0.5);
        this.setLayerSpeed(1, 1.5);
    }
}

const parallaxSystem = new ParallaxSystem();

// === UI CONSTANTS ===
const UI = {
    TITLE: "SONIC RING RUN",
    TITLE_WIDTH: font.getTextSize("SONIC RING RUN").width,
    getTitleX: () => (GAME_CONSTANTS.SCREEN_WIDTH - UI.TITLE_WIDTH) / 2,
    TITLE_Y: 100
};

// === GAME STATE ===
class GameState {
    constructor() {
        this.gameSpeed = 1.0;
        this.scoreMultiplier = 1;
        this.difficultyInterval = GAME_CONSTANTS.DIFFICULTY_INCREASE_INTERVAL;
        this.timer = Timer.new();
        this.lastDifficultyIncrease = Timer.getTime(this.timer);
        
        this.selection = 0;
        this.ringsCollected = 0;
        this.currentAnimation = "sonicRun";
        this.currentGameMode = GAME_MODES.NORMAL;
        
        this.rings = this.createInitialRings();
        this.enemies = this.createInitialEnemies();
        this.highScore = this.loadHighScore();
    }
    
    createInitialRings() {
        return [
            { x: 182, y: 326, collected: false },
            { x: 340, y: 326, collected: false },
            { x: 486, y: 326, collected: false }
        ];
    }
    
    createInitialEnemies() {
        return [
            { x: 640, y: 337, width: 53, height: 32, speed: 1.9, alive: true },
            { x: 815, y: 337, width: 53, height: 32, speed: 1.9, alive: true },
            { x: 990, y: 337, width: 53, height: 32, speed: 1.9, alive: true }
        ];
    }
    
    loadHighScore() {
        // Implement high score loading logic here
        return 0;
    }
    
    saveHighScore() {
        // Implement high score saving logic here
    }
    
    getFinalScore() {
        return Math.floor(this.ringsCollected * this.scoreMultiplier);
    }
    
    reset() {
        player.x = 60;
        player.y = 322;
        player.velocityX = 0;
        player.velocityY = 0;
        
        this.ringsCollected = 0;
        this.gameSpeed = 1.0;
        this.selection = 0;
        this.scoreMultiplier = 1;
        this.currentAnimation = "sonicRun";
        
        parallaxSystem.reset();
        dayNightSystem.reset();
        
        this.enemies.forEach((enemy, index) => {
            enemy.x = 640 + (index * 175);
            enemy.alive = true;
            enemy.speed = 1.8;
        });
        
        this.rings.forEach((ring, index) => {
            ring.x = 182 + (index * 158);
            ring.collected = false;
        });
        
        this.lastDifficultyIncrease = Timer.getTime(this.timer);
    }
}

const gameState = new GameState();

// === UTILITY FUNCTIONS ===
function drawMenu(font, items, selectedIndex, startY) {
    const itemSpacing = 40;
    
    items.forEach((item, index) => {
        const yPos = startY + (index * itemSpacing);
        const textWidth = font.getTextSize(item).width;
        const xPos = GAME_CONSTANTS.SCREEN_WIDTH / 2 - textWidth / 2;
        
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
    if (gameState.currentGameMode === GAME_MODES.INFINITE) {
        gameState.gameSpeed += 0.11;
        gameState.scoreMultiplier += 0.1;
        
        parallaxSystem.setLayerSpeed(0, 0.5 * gameState.gameSpeed);
        parallaxSystem.setLayerSpeed(1, 1.5 * gameState.gameSpeed);
        
        gameState.enemies.forEach(enemy => {
            enemy.speed = 1.8 * gameState.gameSpeed;
        });
        
        const newCycleDuration = Math.max(30000000, 120000000 - (gameState.gameSpeed * 10000000));
        dayNightSystem.setCycleDuration(newCycleDuration);
    }
}

function respawnEnemy(enemy) {
    if (!enemy) return;
    
    enemy.x = 900 + Math.random() * 200;
    enemy.alive = true;
}

function respawnRing(ring) {
    if (!ring) return;
    
    ring.x = 640 + 50 + (Math.random() * 400);
    ring.collected = false;
}

function checkCollision(obj1, obj2, size1, size2) {
    return (
        obj1.x < obj2.x + size2.width &&
        obj1.x + size1.width > obj2.x &&
        obj1.y < obj2.y + size2.height &&
        obj1.y + size1.height > obj2.y
    );
}

// === GAME SCENES ===
const MainMenu = {
    buttons: [],
    
    init() {
        this.buttons = ["Start Infinite", "Start Normal"];
    },
    
    update() {
        if (!pad) return;
        
        pad.update();
        
        if (pad.justPressed(Pads.UP)) {
            gameState.selection = (gameState.selection - 1 + this.buttons.length) % this.buttons.length;
        }
        
        if (pad.justPressed(Pads.DOWN)) {
            gameState.selection = (gameState.selection + 1) % this.buttons.length;
        }
        
        if (pad.justPressed(Pads.START)) {
            gameState.currentGameMode = gameState.selection === 0 ? GAME_MODES.INFINITE : GAME_MODES.NORMAL;
            SceneManager.change("menu-secondary");
        }
    },
    
    render() {
        getText("Sonic is by SEGA", 0, 0, { scale: 0.5 });
        getText("This is a fangame made by Dev Will based on Sonic Run by JSLegendDev", 0, 15, { scale: 0.5 });
        
        drawMenu(font, this.buttons, gameState.selection, 362);
    },
    
    exit() {
        gameState.selection = 0;
    }
};

const SecondaryMenu = {
    buttons: [],
    
    init() {
        this.buttons = ["Play", "Back"];
        parallaxSystem.setLayerSpeed(1, 4.1);
    },
    
    update() {
        if (!pad) return;
        
        pad.update();
        
        if (pad.justPressed(Pads.UP)) {
            gameState.selection = (gameState.selection - 1 + this.buttons.length) % this.buttons.length;
        }
        
        if (pad.justPressed(Pads.DOWN)) {
            gameState.selection = (gameState.selection + 1) % this.buttons.length;
        }
        
        if (pad.justPressed(Pads.START)) {
            if (gameState.selection === 0) {
                SceneManager.change("game-play");
            } else {
                SceneManager.change("menu-main");
            }
        }
    },
    
    render() {
        parallaxSystem.update();
        parallaxSystem.draw();
        
        animationManager.updateAnimation(gameState.currentAnimation, player.x, player.y);
        animationManager.drawAnimation(gameState.currentAnimation);
        
        getText("Press Start to Play", 256, 140, { scale: 0.5 });
        getText("Press X to Jump!", 262, 154, { scale: 0.5 });
        getText(UI.TITLE, UI.getTitleX() - 40, UI.TITLE_Y, { scale: 1.4 });
        
        drawMenu(font, this.buttons, gameState.selection, 362);
    },
    
    exit() {
        parallaxSystem.setLayerSpeed(1, 1.5);
        gameState.selection = 0;
    }
};

const GameScene = {
    init() {},
    
    update() {
        if (!pad) return;
        
        pad.update();
        
        soundManager.playMusic("city");
        
        // Increase difficulty in infinite mode
        if (gameState.currentGameMode === GAME_MODES.INFINITE && 
            Timer.getTime(gameState.timer) - gameState.lastDifficultyIncrease > gameState.difficultyInterval) {
            increaseDifficulty();
            gameState.lastDifficultyIncrease = Timer.getTime(gameState.timer);
        }
        
        // Handle jumping
        if ((pad.btns & Pads.CROSS) && player.y + player.height >= player.floor) {
            player.velocityY = player.jumpForce;
            soundManager.playSfx("jump");
        }
        
        // Update player physics
        player.velocityY += player.gravity;
        player.x += player.velocityX * gameState.gameSpeed;
        player.y += player.velocityY;
        
        // Ground collision
        if (player.y + player.height > player.floor) {
            player.y = player.floor - player.height;
            player.velocityY = 0;
            player.isGrounded = true;
        } else {
            player.isGrounded = false;
        }
        
        // Update animation based on state
        gameState.currentAnimation = player.isGrounded ? "sonicRun" : "sonicJump";
    },
    
    render() {
        parallaxSystem.update();
        parallaxSystem.draw();
        
        // Display score
        font.print(10, 10, `SCORE: ${gameState.ringsCollected}`);
        
        // Update and draw rings
        gameState.rings.forEach(ring => {
            if (!ring.collected) {
                animationManager.updateAnimation("ringsAnim", ring.x, ring.y);
                animationManager.drawAnimation("ringsAnim");
                
                if (checkCollision(
                    player, 
                    ring, 
                    { width: player.width, height: player.height },
                    GAME_CONSTANTS.RING_SIZE
                )) {
                    ring.collected = true;
                    gameState.ringsCollected++;
                    soundManager.playSfx("ring");
                }
            }
            
            ring.x -= parallaxSystem.layers[1].speed;
            if (ring.x < -20) {
                respawnRing(ring);
            }
        });
        
        // Update and draw enemies
        gameState.enemies.forEach(enemy => {
            if (enemy.alive) {
                animationManager.updateAnimation("motoBugAnim", enemy.x, enemy.y);
                animationManager.drawAnimation("motoBugAnim");
                
                enemy.x -= enemy.speed;
                
                if (enemy.x < -50) {
                    enemy.alive = false;
                    respawnEnemy(enemy);
                }
                
                // Handle collision with enemy
                if (checkCollision(
                    player, 
                    enemy, 
                    { width: player.width, height: player.height },
                    { width: enemy.width, height: enemy.height }
                )) {
                    if (player.y + player.height - 10 < enemy.y) {
                        // Jump on enemy
                        soundManager.playSfx("destroy");
                        gameState.ringsCollected += 10;
                        enemy.alive = false;
                        player.velocityY = player.jumpForce * 0.9;
                        respawnEnemy(enemy);
                    } else {
                        // Game over
                        SceneManager.change("game-over");
                    }
                }
            }
        });
        
        // Draw player
        animationManager.updateAnimation(gameState.currentAnimation, player.x, player.y);
        animationManager.drawAnimation(gameState.currentAnimation);
    },
    
    exit() {
        soundManager.pauseMusic();

        // Optional garbage collection
        if (typeof std !== "undefined" && std.gc) {
            std.gc();
        }
    }
};

const GameOverScene = {
    init() {
        const finalScore = gameState.getFinalScore();
        if (finalScore > gameState.highScore) {
            gameState.highScore = finalScore;
            gameState.saveHighScore();
        }
    },
    
    update() {
        if (!pad) return;
        
        pad.update();
        
        if (pad.justPressed(Pads.START)) {
            gameState.reset();
            SceneManager.change("game-play");
        }
        
        if (pad.justPressed(Pads.SELECT)) {
            gameState.reset();
            SceneManager.change("menu-main");
        }
    },
    
    render() {
        const finalScore = gameState.getFinalScore();
        
        // Draw score panels
        Draw.rect(50, 150, 160, 160, Color.new(255, 255, 255));
        Draw.rect(430, 150, 160, 160, Color.new(255, 255, 255));
        
        Draw.rect(54, 154, 152, 152, Color.new(0, 0, 0));
        Draw.rect(434, 154, 152, 152, Color.new(0, 0, 0));        
        
        // Draw text
        font.print(UI.getTitleX() + 20, UI.TITLE_Y, "GAME OVER");
        font.print(45, 120, `BEST SCORE: ${gameState.highScore}`);
        font.print(405, 120, `CURRENT SCORE: ${finalScore}`);
        
        getText("B                        F", 120, 210, { scale: 1.5 });
        getText("Press START to Play Again", 320 - 70, 300, { scale: 0.5 });
        getText("Press SELECT for Main Menu", 320 - 77, 320, { scale: 0.5 });
    },
    
    exit() {
        soundManager.pauseMusic();
    }
};

// === SCENE REGISTRATION ===
SceneManager.register("menu-main", MainMenu);
SceneManager.register("menu-secondary", SecondaryMenu);
SceneManager.register("game-play", GameScene);
SceneManager.register("game-over", GameOverScene);

// === GAME INITIALIZATION ===
SceneManager.change("menu-main");

// === MAIN GAME LOOP ===
Screen.display(() => {
    SceneManager.update();
    SceneManager.render();
});
