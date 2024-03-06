import Keyboard from "./classes/keyboard.js";
import ScreenManager from "./classes/screenManager.js";
import { game } from "./screens/game.js";
import { menu } from "./screens/menu.js";

const mainElement = document.querySelector('#main');

export const screenManager = new ScreenManager(mainElement);
export const keyboardHandler = new Keyboard([screenManager]);
const screens = [menu, game];
for(const screen of screens) screenManager.subscribe(screen);

window.addEventListener("load", setSize);
window.addEventListener("resize", setSize);
window.addEventListener("keydown", e => keyboardHandler.listener(e));

function setSize() {
    screenManager.setSize();
}

const intervalId = setInterval(() => {
    screenManager.update();
}, 10)