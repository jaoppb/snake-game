export default class Game {
    constructor() {
        this.ups = 3; //updates per second
        this.running = true;
        this.pixel = {};
        this.pixel.size = 50;
        this.size = {};
        this.player = {
            head: [],
            tail: []
        };
        this.background = "grey";
        this.colors = {
            default: "black",
            head: "green",
            fruit: "red",
            tail: "lightGrey"
        };
        this.directions = {
            w: [0, -1],
            a: [-1, 0],
            s: [0, 1],
            d: [1, 0]
        };
        this.grow = false;
    }

    getRandomInt = range => Math.floor(Math.random() * range);

    getRandomVector2 = range => [this.getRandomInt(range), this.getRandomInt(range)];

    getColor = target => this.colors[target] ?? this.colors.default;

    keyboard(event) {
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

    requestDirectionChange(newDir) {
        if (!newDir.map(v => -v).every((v, i) => v !== this.direction[i])) return;

        this.requestedDirection = newDir;
    }

    clearBackground(context) {
        context.fillStyle = this.background;
        context.fillRect(0, 0, this.size.total, this.size.total);
    }

    setSize(canvas) {
        this.size.total = canvas.element.width;
        this.size.pixel = canvas.element.width / this.pixel.size;
        this.requestedDirection = this.direction = [this.getRandomInt(2) ? -1 : 1, 0].sort(() => Math.random() - .5);
        this.player.head = this.getRandomVector2(this.size.pixel);
        this.player.tail = [[...this.player.head].map((v, i) => v - this.direction[i])];
    }

    generateNewFruit() {
        do this.fruit = this.getRandomVector2(this.size.pixel);
        while ([this.player.head, ...this.player.tail].some(v => v.every((v, i) => v == this.fruit[i])));
    }

    update() {
        if (!this.running) return;
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
        if (player.head.every((v, i) => v == this.fruit[i])) this.generateNewFruit();
        else player.tail.pop();
        if (player.tail.some(v => v.every((v, i) => v == player.head[i]))) this.running = false;
    }

    render(context) {
        this.clearBackground(context);
        const {player} = this;
        const toRender = [...player.tail, this.fruit, player.head];
        if(toRender.some(value => value == undefined)) return;
        for (const index in toRender) {
            context.fillStyle = this.getColor(["head", "fruit"][toRender.length - 1 - index] ?? "tail");
            context.fillRect(...toRender[index].map(v => v * this.pixel.size), ...new Array(2).fill(this.pixel.size));
        }
    }
}