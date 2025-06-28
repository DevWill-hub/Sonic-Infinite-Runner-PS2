import { animations } from "../systems/animationsManager.js";
import { fontScala1, fontScala2 } from "../systems/fonts.js";
import { Game, gameModes, gameStates } from "../game.js";
import { Parallax } from "../systems/parallax.js";
import { player } from "../entities/player.js";

let current = "sonicRun";

const titleScreen = "SONIC RING RUN";
const titleWidth = fontScala1.getTextSize(titleScreen);
export const posXTitle = (640 - titleWidth.width) / 2;
export const posYTitle = 100;

const menuPrincipalItems = ["Start Infinite", "Start Normal"];
const menuSecundarioItems = ["Jogar", "Voltar"];

let selectedOptions = 0;

export function drawMenu(fontScala1, items, selectedIndex, startY) {
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

class MenuPrincipalClass {
    constructor() {

    }

    update(pad) {
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
                Game.currentModes = gameModes.infinity;
                Game.currentStates = gameStates.menu_secundario;
                selectedOptions = 0;
                break;
            case 1:
                Game.currentModes = gameModes.normal;
                Game.currentStates = gameStates.menu_secundario;
                selectedOptions = 0;
                break;
            }
        }
    }

    render() {
        fontScala2.print(0, 0, "Sonic is by SEGA");
        fontScala2.print(0, 15, "This is a fangame made by Dev Will using by expiration Sonic Run made by JSLegandDev");
    }
}

class MenuSecundarioClass {
    constructor() {

    }

    update(pad) {
        if (pad.justPressed(Pads.UP)) {
            selectedOptions = Math.max(0, selectedOptions - 1);
        }
        else if (pad.justPressed(Pads.DOWN)) {
            selectedOptions = Math.min(menuSecundarioItems.length - 1, selectedOptions + 1);
        }
            
        if (pad.justPressed(Pads.START)) {
            switch (selectedOptions) {
            case 0:
                Game.currentStates = gameStates.jogando;
                selectedOptions = 0;
                break;
            case 1:
                Game.currentStates = gameStates.menu_principal;
                break;
            }
        }
    }

    render() {
        player.velocidadeY += player.gravidade;

        player.x += player.velocidadeX;
        player.y += player.velocidadeY;

        if (player.y + player.altura > player.floor) {
            player.y = player.floor - player.altura;
            player.velocidadeY = 0;
        }

        Parallax.draw();

        animations[current].x = player.x;
        animations[current].y = player.y;

        animations[current].update();
        animations[current].draw();
            
        drawMenu(fontScala1, menuSecundarioItems, selectedOptions, 350);

        fontScala1.print(posXTitle, posYTitle, titleScreen);
        
        fontScala2.print(240, 125, "Press Start/Touch to Play");
        fontScala2.print(249, 150, "Press X/Touch to Jump!");
    }
}


export const MenuSecundario = new MenuSecundarioClass();
export const MenuPrincipal = new MenuPrincipalClass();