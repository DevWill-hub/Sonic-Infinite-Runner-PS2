import { animations } from "../systems/animationsManager.js";
import { SoundManager } from "../systems/SoundManager.js";
import { Game, gameModes, gameStates } from "../game.js";
import { fontScala1 } from "../systems/fonts.js";
import { Parallax } from "../systems/parallax.js";
import { player } from "../entities/player.js";

let current = "sonicRun";
export let ringsColetadas = 0;

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


export let scoreMultiplier = 1;
let gameSpeed = 1.0;
let difficultyInterval = 3000000;
let timer = Timer.new();
let lastDifficultyIncrease = Timer.getTime(timer);

export function resetGame() {
  ringsColetadas = 0;
  player.x = 105;
  player.y = 384;
  Parallax.velocidade1 = 1.5;
  Parallax.velocidade2 = 2.5;
  gameSpeed = 1.0;
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
  if (Game.currentModes === gameModes.infinity) {
    gameSpeed += 0.05;
    scoreMultiplier += 0.1;

    Parallax.velocidade1 = 1.5 * gameSpeed;
    Parallax.velocidade2 = 2.5 * gameSpeed;

    inimigos.forEach(inimigo => {
      inimigo.velocidade = 3 * gameSpeed;
    });
  }
}

function respawnInimigo(inimigo) {
  inimigo.x = 900 + Math.random() * 200;
  inimigo.vivo = true;
}


class GamePlayClass {
    constructor() {

    }

    update(pad) {
        if (Game.currentModes === gameModes.infinity && 
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

        animations[current].x = player.x;
        animations[current].y = player.y;
    }

    render() {
        animations[current].update();

        Parallax.draw();
        
        animations[current].draw();

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

            ring.x -= Parallax.velocidade2;

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
                        SoundManager.playEffect("assets/sounds/sfx/destroy.adp");
                    } else {
                        Game.currentStates = gameStates.game_over;
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

        SoundManager.playMusic("assets/sounds/music/city.wav", 70, true);
    }
}

export const GamePlay = new GamePlayClass();