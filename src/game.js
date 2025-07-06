import { fontScala1, fontScala2 } from "./systems/fonts.js";
import { SoundManager } from "./systems/soundmanager.js";
import { Sprite } from "./systems/sprite.js";

const videoMode = Screen.getMode();
videoMode.width = 640;
videoMode.height = 448;
videoMode.double_buffering = true;
Screen.setMode(videoMode);
Screen.setVSync(true);
Screen.setFrameCounter(true);

const pad = Pads.get(0);

const estados = {
  menu_principal: "MenuParte1",
  menu_secundario: "MenuParte2",
  jogando: "Jogando",
  game_over: "GameOver"
};

const gameModes = {
  normal: "normal",
  infinity: "infinite"
};

let estadoAtual = estados.menu_principal;
let currentGameMode = gameModes.normal;

const player = {
  x: 105,
  y: 384,
  floor: 384,
  largura: 32,
  altura: 36,
  velocidadeX: 0,
  velocidadeY: 0,
  gravidade: 0.5,
  forcaPulo: -10
};

let parallaxLayes = [
  {
    image: new Image("assets/bg/bg1.png"),
    speed: 1,
    width: 783,
    x: 0,
    y: 0,
  },

  {
    image: new Image("assets/bg/bg2.png"),
    speed: 3,
    width: 640,
    x: 0,
    y: 384,
  },
];

let gameSpeed = 1;
let scoreMultiplier = 1;
let difficultyInterval = 3000000;
let timer = Timer.new();
let lastDifficultyIncrease = Timer.getTime(timer);

function resetGame() {
  ringsColetadas = 0;
  player.x = 105;
  player.y = 384;
  parallaxLayes[0].speed = 1;
  parallaxLayes[1].speed = 3;
  gameSpeed = 1;
  selectedOptions = 0;
  scoreMultiplier = 1;
    
  inimigos.forEach(inimigo => {
    inimigo.x = 500 + Math.random() * 400;
    inimigo.vivo = true;
  });
    
  rings.forEach((ring, i) => {
    ring.x = 729 - (i * 130);
    ring.coletada = false;
  });
}

function increaseDifficulty() {
  if (currentGameMode === gameModes.infinity) {
    gameSpeed += 0.05;
    scoreMultiplier += 0.1;

    parallaxLayes[0].speed = 1 * gameSpeed;
    parallaxLayes[1].speed = 3 * gameSpeed;

    inimigos.forEach(inimigo => {
      inimigo.velocidade = 3 * gameSpeed;
    });
  }
}

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

  ringsAnim: new Sprite("assets/sprites/items/ring.png", 566, 384, [
    {
      imageOffsetX: 0,
      imageOffsetY: 0,
      widthPerImage: 17,
      heightPerImage: 16,
      imagesLength: 16
    }
  ], false, 50),

  motoBugAnim: new Sprite("assets/sprites/enemies/motobug.png", 566, 384, [
    {
      imageOffsetX: 0,
      imageOffsetY: 1,
      widthPerImage: 48,
      heightPerImage: 29,
      imagesLength: 5
    }
  ], false, 100),
};

const parallaxRenderer = {
  update() {
    parallaxLayes.forEach(layer => {
      layer.x -= layer.speed;
      if (layer.x <= -layer.width) {
        layer.x = 0;
      }
    });
  },

  draw() {
    parallaxLayes.forEach(layer => {
      layer.image.draw(layer.x, layer.y);
      layer.image.draw(layer.x + layer.width, layer.y);
    });
  }
}

let ringsColetadas = 0;
let current = "sonicRun";

let rings = [
  { x: 729, y: 360, coletada: false },
  { x: 599, y: 360, coletada: false },
  { x: 469, y: 360, coletada: false },
  { x: 339, y: 360, coletada: false }
];

let inimigos = [
  { x: 500, y: 384 - 29, largura: 39, altura: 28, velocidade: 3, vivo: true },
  { x: 700, y: 384 - 29, largura: 39, altura: 28, velocidade: 3, vivo: true },
  { x: 900, y: 384 - 29, largura: 39, altura: 28, velocidade: 3, vivo: true }
];

const titleScreen = "SONIC RING RUN";
const titleWidth = fontScala1.getTextSize(titleScreen);
const posXTitle = (640 - titleWidth.width) / 2;
const posYTitle = 100;

let selectedOptions = 0;

const menuPrincipalItems = ["Start Infinite", "Start Normal"];
const menuSecundarioItems = ["Jogar", "Voltar"];

function drawMenu(fontScala1, items, selectedIndex, startY) {
  const itemSpacing = 40;
    
  items.forEach((item, index) => {
    const yPos = startY + (index * itemSpacing);
    const textWidth = fontScala1.getTextSize(item).width;
    const xPos = 640 / 2 - textWidth / 2;

    if (index === selectedIndex) {
      const marker = ">";
      const markerWidth = fontScala1.getTextSize(marker).width;
      fontScala1.print(xPos - markerWidth - 15, yPos, marker);
      fontScala1.print(xPos + textWidth + 10, yPos, "<");
    }

    fontScala1.print(xPos, yPos, item);
  });
}

function respawnInimigo(inimigo) {
  inimigo.x = 900 + Math.random() * 200;
  inimigo.vivo = true;
}

const menuPrincipalDraw = () => {
  pad.update();

  fontScala2.print(0, 0, "Sonic is by SEGA");
  fontScala2.print(0, 15, "This is a fangame made by Dev Will using by expiration Sonic Run made by JSLegandDev");

  drawMenu(fontScala1, menuPrincipalItems, selectedOptions, 350);

  if (pad.justPressed(Pads.UP)) {
    selectedOptions = Math.max(0, selectedOptions - 1);
  }
  else if (pad.justPressed(Pads.DOWN)) {
    selectedOptions = Math.min(menuPrincipalItems.length - 1, selectedOptions + 1);
  }

  if (pad.justPressed(Pads.START)) {
    switch (selectedOptions) {
      case 0:
        currentGameMode = gameModes.infinity;
        estadoAtual = estados.menu_secundario;
        selectedOptions = 0;
        break;
      case 1:
        currentGameMode = gameModes.normal;
        estadoAtual = estados.menu_secundario;
        selectedOptions = 0;
        break;
    }
  }
}

const menuSecundarioDraw = () => {
  pad.update();
    
  player.velocidadeY += player.gravidade;

  player.x += player.velocidadeX;
  player.y += player.velocidadeY;

  if (player.y + player.altura > player.floor) {
    player.y = player.floor - player.altura;
    player.velocidadeY = 0;
  }

  parallaxRenderer.update();
  parallaxRenderer.draw();

  animations[current].x = player.x;
  animations[current].y = player.y;

  animations[current].update();
  animations[current].draw();
    
  drawMenu(fontScala1, menuSecundarioItems, selectedOptions, 350);
    
  if (pad.justPressed(Pads.UP)) {
    selectedOptions = Math.max(0, selectedOptions - 1);
  }
  else if (pad.justPressed(Pads.DOWN)) {
    selectedOptions = Math.min(menuSecundarioItems.length - 1, selectedOptions + 1);
  }
    
  if (pad.justPressed(Pads.START)) {
    switch (selectedOptions) {
       case 0:
        estadoAtual = estados.jogando;
        break;
      case 1:
        estadoAtual = estados.menu_principal;
        selectedOptions = 0;
        break;
    }
  }

  fontScala1.print(posXTitle, posYTitle, titleScreen);
  
  fontScala2.print(240, 125, "Press Start/Touch to Play");
  fontScala2.print(249, 150, "Press X/Touch to Jump!");
}

const jogandoDraw = () => {
  pad.update();

  if (currentGameMode === gameModes.infinity && 
    Timer.getTime(timer) - lastDifficultyIncrease > difficultyInterval) {
    increaseDifficulty();
    lastDifficultyIncrease = Timer.getTime(timer);
  }

  if ((pad.btns & Pads.CROSS) && player.y + player.altura >= player.floor) {
    player.velocidadeY = player.forcaPulo;
    SoundManager.playEffect("assets/sounds/sfx/jump.adp");
  }

  player.velocidadeY += player.gravidade;
  player.x += player.velocidadeX * gameSpeed;
  player.y += player.velocidadeY;

  if (player.y + player.altura > player.floor) {
    player.y = player.floor - player.altura;
    player.velocidadeY = 0;
  }

  parallaxRenderer.update();
  parallaxRenderer.draw();

  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];

    if (!ring.coletada) {
      animations.ringsAnim.x = ring.x;
      animations.ringsAnim.y = ring.y;

      animations.ringsAnim.update();
      animations.ringsAnim.draw();

      if (
        player.x < ring.x + 16 &&
        player.x + player.largura > ring.x &&
        player.y < ring.y + 16 &&
        player.y + player.altura > ring.y
      ) {
        ring.coletada = true;
        ringsColetadas++;
        SoundManager.playEffect("assets/sounds/sfx/ring.adp");
      }
    }

    ring.x -= parallaxLayes[1].speed;

    if (ring.x < -16) {
      ring.x = rings[rings.length - 4].x + 640;
      ring.coletada = false;
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

      if (
        player.x < inimigo.x + inimigo.largura &&
        player.x + player.largura > inimigo.x &&
        player.y < inimigo.y + inimigo.altura &&
        player.y + player.altura > inimigo.y
      ) {
        if (player.y + player.altura - 5 < inimigo.y) {
          SoundManager.playEffect("assets/sounds/sfx/destroy.adp");
          ringsColetadas += 10;
          inimigo.vivo = false;
          player.velocidadeY = player.forcaPulo * 0.7;
          respawnInimigo(inimigo);
        } else {
          estadoAtual = estados.game_over;
        }
      }
    }
  }

  fontScala1.print(10, 10, `SCORE : ${ringsColetadas}`);

  if (player.y + player.altura < player.floor) {
    current = "sonicJump";
  } else {
    current = "sonicRun";
  }

  animations[current].x = player.x;
  animations[current].y = player.y;

  animations[current].update();
  animations[current].draw();

  SoundManager.playMusic("assets/sounds/music/city.wav", 70, true);
};

const gameOverDraw = () => {
  pad.update();

  const finalScore = Math.floor(ringsColetadas * scoreMultiplier);

  Draw.rect(50, 150, 160, 160, Color.new(255, 255, 255));
  Draw.rect(430, 150, 160, 160, Color.new(255, 255, 255));

  Draw.rect(54, 154, 152, 152, Color.new(0, 0, 0));
  Draw.rect(434, 154, 152, 152, Color.new(0, 0, 0));

  fontScala1.print(posXTitle + 20, posYTitle, "GAME OVER");

  fontScala1.print(45, 120, `BEST SCORE : 0`);
  fontScala1.print(405, 120, `CURRENT SCORE : ${finalScore}`);

  fontScala2.print(320 - 96, 300, "Press Start/Touch to Play Again");

  if (pad.justPressed(Pads.START)) {
    estadoAtual = estados.jogando;
    resetGame();
  }
};

class GameClass {
  constructor() {
  }

  update() {
    Screen.display(() => {
      switch (estadoAtual) {
        case estados.menu_principal:
          menuPrincipalDraw();
          break;
        case estados.menu_secundario:
          menuSecundarioDraw();
          break;
        case estados.jogando:
          jogandoDraw();
          break;  
        case estados.game_over:
          gameOverDraw();
          break;
      }
    });
  }
}

export const game = new GameClass();