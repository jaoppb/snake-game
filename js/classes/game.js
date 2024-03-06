import { screenManager } from "../index.js";
import { menu } from "../screens/menu.js";
import ScreenBase from "./screenBase.js";

export default class Game extends ScreenBase {
    constructor() {
        super(document.createElement("div"), ["game"]);

        const HUD = this.elements.createChild(
            "HUD",
            document.createElement("div"),
            true
        )
        const back = HUD.createChild(
            "back",
            document.createElement("div"),
            true
        )
        for (let i = 0; i < 3; i++) back.createChild(`span-${i}`, document.createElement("span"));
        back.element.addEventListener("click", () => screenManager.setScreen(menu));
        this.score = {};
        this.score.element = HUD.createChild(
            "score",
            document.createElement("span")
        )

        const canvas = this.elements.createChild(
            "canvas",
            document.createElement("canvas")
        )

        this.ups = 3; //updates per second
        this.pixel = {};
        this.pixel.size = 50;
        this.size = {};
        this.background = "#3f3f3f";
        this.colors = {
            default: "black",
            head: "#0e0e0e",
            fruit: "#1ef11d",
            tail: "#dfdfdf"
        };
        this.directions = {
            w: [0, -1],
            a: [-1, 0],
            s: [0, 1],
            d: [1, 0]
        };
        this.canvas = {};
        this.canvas.element = canvas;
        this.canvas.context = this.canvas.element.getContext('2d');

        this.keyboardEvents = {
            any: event => {
                const key = event.key.toLowerCase();
                switch (key) {
                    case "w":
                    case "a":
                    case "s":
                    case "d":
                        this.requestDirectionChange(this.directions[key]);
                        break;
                }
            }
        }
    }

    setGame() {
        this.player = {
            head: [],
            tail: []
        };
        this.running = true;
        
        this.changeScore(0);
        this.setSize();
    }

    getRandomInt = range => Math.floor(Math.random() * range);

    getRandomVector2 = range => [this.getRandomInt(range), this.getRandomInt(range)];

    getColor = target => this.colors[target] ?? this.colors.default;

    setDifficult(level) {
        switch (level) {
            default:
            case 0:
                this.ups = 3
                this.pixel.size = 50
                break;
            case 1:
                this.ups = 3.5
                this.pixel.size = 40
                break;
            case 2:
                this.ups = 4.5
                this.pixel.size = 30
                break;
        }
    }

    requestDirectionChange(newDir) {
        if (!newDir.map(v => -v).every((v, i) => v !== this.direction[i])) return;

        this.requestedDirection = newDir;
    }

    clearBackground(context) {
        context.fillStyle = this.background;
        context.fillRect(0, 0, this.size.total, this.size.total);
    }

    setSize() {
        const newSize = {};
        newSize.total = (() => {
            let temp = Math.min(this.element.offsetWidth, this.element.offsetHeight) * .9
            return Math.max(150, temp - temp % this.pixel.size)
        })()
        newSize.pixel = newSize.total / this.pixel.size

        const { size } = this;
        if (Object.keys(newSize).every(key => size[key] != undefined)
            && newSize.total == size.total
            && newSize.pixel == size.pixel) return;
        const { player, canvas } = this;
        const { element } = canvas;
        for (const key of Object.keys(newSize)) size[key] = newSize[key];
        element.width = element.height = size.total
        this.elements.children.HUD.element.style.width = `${size.total}px`
        this.requestedDirection = this.direction = [this.getRandomInt(2) ? -1 : 1, 0].sort(() => Math.random() - .5);
        player.head = this.getRandomVector2(this.size.pixel);
        player.tail = [[...player.head].map((v, i) => v - this.direction[i])];
        this.generateNewFruit();
    }

    generateNewFruit() {
        do this.fruit = this.getRandomVector2(this.size.pixel);
        while ([this.player.head, ...this.player.tail].some(v => v.every((v, i) => v == this.fruit[i])));
    }

    changeScore(value) {
        let final;
        if (typeof value == "number") final = value
        else final = this.score.value + 1
        this.score.value = this.score.element.innerText = final
    }

    update() {
        if (!this.running) {
            return screenManager.setScreen(menu)
        };
        if (this.fruit == undefined) this.generateNewFruit();

        this.direction = this.requestedDirection;

        const { player } = this;
        const headCopy = [...player.head];
        player.head = player.head.map((v, i) => {
            let value = v + this.direction[i];
            if (value > this.size.pixel - 1) value %= this.size.pixel;
            else if (value < 0) value += this.size.pixel;
            return value;
        })
        player.tail.unshift(headCopy);
        if (player.head.every((v, i) => v == this.fruit[i])) {
            this.changeScore();
            this.generateNewFruit()
        } else player.tail.pop();
        if (player.tail.some(v => v.every((v, i) => v == player.head[i]))) this.running = false;
    }

    render() {
        const { context } = this.canvas

        this.clearBackground(context);
        const { player } = this;
        const toRender = [...player.tail, this.fruit, player.head];
        if (toRender.some(value => value == undefined)) return;
        for (const index in toRender) {
            context.fillStyle = this.getColor(["head", "fruit"][toRender.length - 1 - index] ?? "tail");
            context.fillRect(...toRender[index].map(v => v * this.pixel.size), ...new Array(2).fill(this.pixel.size));
        }
    }
}