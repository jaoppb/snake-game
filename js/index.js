import Keyboard from "./classes/keyboard.js";
import ScreenManager from "./classes/screenManager.js";
import { game } from "./screens/game.js";

const mainElement = document.querySelector('main');
const canvas = {};
canvas.element = document.querySelector('main > canvas');
canvas.context = canvas.element.getContext('2d');

export const screenManager = new ScreenManager(canvas);
export const keyboardHandler = new Keyboard([screenManager]);
screenManager.subscribe(game);

window.addEventListener("load", setSize);
window.addEventListener("resize", setSize);
window.addEventListener("keydown", e => keyboardHandler.listener(e));

function setSize() {
    const { element } = canvas;
    const size = (() => {
        let temp = Math.min(mainElement.offsetHeight, mainElement.offsetWidth) * 0.9;
        return temp - temp % 50;
    })()
    element.width = element.height = Math.max(size, 100);
    screenManager.setSize();
}

const intervalId = setInterval(() => {
    screenManager.update();
}, 10)