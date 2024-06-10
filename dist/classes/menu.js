import { screenManager } from "../index.js";
import { game } from "../screens/game.js";
import ScreenBase from "./screenBase.js";
const levelMeans = ["Easy", "Normal", "Hard"];
export default class Menu extends ScreenBase {
    constructor() {
        super(document.createElement("div"), ["menu"]);
        let levelIndex = 0;
        const title = this.elements.createChild("title", document.createElement("span"));
        title.innerText = "Snake";
        const buttons = this.elements.createChild("buttons", document.createElement("div"), true);
        const buttonFunctions = {
            start: () => {
                game.setDifficult(levelIndex);
                game.setGame();
                screenManager.setScreen(game);
            },
            difficult: () => {
                levelIndex++;
                level.innerText = levelMeans[levelIndex % levelMeans.length];
            }
        };
        for (const buttonText of ["Start", "Difficult: "]) {
            const button = buttons.createChild(buttonText.toLowerCase().replace(/[^a-z]/gi, ""), document.createElement("button"));
            button.innerText = buttonText;
            button.addEventListener("click", buttonFunctions[buttonText.toLowerCase().replace(/[^a-z]/gi, "")]);
        }
        ;
        const level = buttons.children.difficult.createChild("level", document.createElement("span"));
        level.innerText = levelMeans[levelIndex];
    }
}
