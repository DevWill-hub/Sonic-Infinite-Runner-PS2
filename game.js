import { Sprite } from "./src/Modules/sprite.js";

let fontScala1 = new Font("src/Fonts/mania.ttf");
fontScala1.color = Color.new(255, 255, 255);
fontScala1.scale = 1.0;

let fontScala2 = new Font("src/Fonts/mania.ttf");
fontScala2.color = Color.new(255, 255, 255);
fontScala2.scale = 0.5;

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

let gameSpeed = 1.0;
let scoreMultiplier = 1;
let difficultyInterval = 3000000;
let timer = Timer.new();
let lastDifficultyIncrease = Timer.getTime(timer);

function resetGame() {
  ringsColetadas = 0;
  player.x = 105;
  player.y = 384;
  velocidade1 = 1.5;
  velocidade2 = 2.5;
  gameSpeed = 1.0;
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

    velocidade1 = 1.5 * gameSpeed;
    velocidade2 = 2.5 * gameSpeed;

    inimigos.forEach(inimigo => {
      inimigo.velocidade = 3 * gameSpeed;
    });
  }
}

let animations = {
  sonicRun: new Sprite("src/Assets/Sonic/sonic.png", player.x, player.y, [
    {
      imageOffsetX: 0,
      imageOffsetY: 8,
      widthPerImage: 32,
      heightPerImage: 36,
      imagesLength: 8
    }
  ], false, 50),

  sonicJump: new Sprite("src/Assets/Sonic/sonic.png", player.x, player.y, [
    {
      imageOffsetX: 0,
      imageOffsetY: 53,
      widthPerImage: 32,
      heightPerImage: 31,
      imagesLength: 8
    }
  ], false, 50),

  ringsAnim: new Sprite("src/Assets/Ring/ring.png", 566, 384, [
    {
      imageOffsetX: 0,
      imageOffsetY: 0,
      widthPerImage: 17,
      heightPerImage: 16,
      imagesLength: 16
    }
  ], false, 50),

  motoBugAnim: new Sprite("src/Assets/Inimigos/motobug.png", 566, 384, [
    {
      imageOffsetX: 0,
      imageOffsetY: 1,
      widthPerImage: 48,
      heightPerImage: 29,
      imagesLength: 5
    }
  ], false, 100),
};

let bg1 = new Image("src/Assets/bg/bg1.png");
let velocidade1 = 1.5;
let pos1X = 0;
let pos1Y = 0;

let bg2 = new Image("src/Assets/bg/bg2.png");
let velocidade2 = 2.5;
let pos2X = 0;
let pos2Y = 384;

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

  pos1X -= velocidade1;
  if (pos1X <= -bg1.width) {
    pos1X = 0;
  }
  bg1.draw(pos1X, pos1Y);
  bg1.draw(pos1X + bg1.width, pos1Y);

  pos2X -= velocidade2;
  if (pos2X <= -bg2.width) {
    pos2X = 0;
  }
  bg2.draw(pos2X, pos2Y);
  bg2.draw(pos2X + bg2.width, pos2Y);

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
  }

  player.velocidadeY += player.gravidade;
  player.x += player.velocidadeX * gameSpeed;
  player.y += player.velocidadeY;

  if (player.y + player.altura > player.floor) {
    player.y = player.floor - player.altura;
    player.velocidadeY = 0;
  }

  pos1X -= velocidade1;
  if (pos1X <= -bg1.width) {
    pos1X = 0;
  }
  bg1.draw(pos1X, pos1Y);
  bg1.draw(pos1X + bg1.width, pos1Y);

  pos2X -= velocidade2;
  if (pos2X <= -bg2.width) {
    pos2X = 0;
  }
  bg2.draw(pos2X, pos2Y);
  bg2.draw(pos2X + bg2.width, pos2Y);

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
      }
    }

    ring.x -= velocidade2;

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
};


const gameOverDraw = () => {
  pad.update();
    
  const finalScore = Math.floor(ringsColetadas * scoreMultiplier);
    
  fontScala1.print(posXTitle, posYTitle, "GAME OVER");
  fontScala1.print(320 - 100, 150, `SCORE FINAL: ${finalScore}`);

/*
  if (currentGameMode === gameModes.INFINITE) {
    fontScala1.print(320 - 150, 180, `RECORDE: ${getHighScore()}`);
  }
*/

  fontScala2.print(320 - 111, 200, "Press Start/Touch to Play Again");

  if (pad.justPressed(Pads.START)) {
    estadoAtual = estados.jogando;
    resetGame();
  }
};

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