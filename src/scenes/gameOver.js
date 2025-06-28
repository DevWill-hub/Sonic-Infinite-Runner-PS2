import { ringsColetadas, scoreMultiplier, resetGame } from "./gamePlay.js";
import { SoundManager } from "../systems/SoundManager.js";
import { fontScala1, fontScala2 } from "../systems/fonts.js";
import { posXTitle, posYTitle } from "./menu.js";
import { Game, gameStates } from "../game.js";

class GameOverClass {
    constructor() {

    }

    update(pad) {
        SoundManager.stopMusic();

        if (pad.justPressed(Pads.START)) {
            resetGame();
            Game.currentStates = gameStates.jogando;
        }
    }

    render() {
        const finalScore = Math.floor(ringsColetadas * scoreMultiplier);

        Draw.rect(50, 150, 160, 160, Color.new(255, 255, 255));
        Draw.rect(430, 150, 160, 160, Color.new(255, 255, 255));

        Draw.rect(54, 154, 152, 152, Color.new(0, 0, 0));
        Draw.rect(434, 154, 152, 152, Color.new(0, 0, 0));
            
        fontScala1.print(posXTitle + 20, posYTitle, "GAME OVER");

        fontScala1.print(45, 120, `BEST SCORE : 0`);
        fontScala1.print(405, 120, `CURRENT SCORE : ${finalScore}`);

        fontScala2.print(320 - 96, 300, "Press Start/Touch to Play Again");
    }
}

export const GameOver = new GameOverClass();