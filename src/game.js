import { MenuPrincipal, MenuSecundario } from './scenes/menu.js';
import { GamePlay } from './scenes/gamePlay.js';
import { GameOver } from './scenes/gameOver.js';

const videoMode = Screen.getMode();
videoMode.width = 640;
videoMode.height = 448;
videoMode.double_buffering = true;
Screen.setMode(videoMode);
Screen.setVSync(true);
Screen.setFrameCounter(true);

export const gameStates = {
  menu_principal: "MenuParte1",
  menu_secundario: "MenuParte2",
  jogando: "Jogando",
  game_over: "GameOver"
};

export const gameModes = {
  normal: "normal",
  infinity: "infinite"
};

class GameManager {
  constructor() {
    this.currentStates = gameStates.menu_principal;
    this.currentModes = gameModes.normal;
    this.pad = Pads.get(0);
  }

  start() {
    while (true) {
      Screen.clear();

      this.pad.update();

      switch (this.currentStates) {
        case gameStates.menu_principal:
          MenuPrincipal.update(this.pad);
          MenuPrincipal.render();
          break;
        case gameStates.menu_secundario:
          MenuSecundario.update(this.pad);
          MenuSecundario.render();
          break;
        case gameStates.jogando:
          GamePlay.update(this.pad);
          GamePlay.render();
          break;  
        case gameStates.game_over:
          GameOver.update(this.pad);
          GameOver.render();
          break;
      }

      Screen.flip();
    }
  }
}

export const Game = new GameManager();