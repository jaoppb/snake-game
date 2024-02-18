import Keyboard from "./classes/keyboard.js";
import Game from "./classes/game.js";

const mainElement = document.querySelector('main');
const canvas = {};
canvas.element = document.querySelector('main > canvas');
canvas.context = canvas.element.getContext('2d')

const game = new Game(canvas);
const keyboardHandler = new Keyboard([game])

function load() {
    const { element } = canvas
    const size = (() => {
        let temp = Math.min(mainElement.offsetHeight, mainElement.offsetWidth) * 0.9
        return temp - temp % 50
    })()
    element.width = element.height = size
    game.setSize(canvas)
}

window.addEventListener("load", load);
window.addEventListener("resize", () => {
    load()
    game.setSize(canvas);
});
window.addEventListener("keydown", e => keyboardHandler.listener(event))

const intervalId = setInterval(() => game.interval(), 300)