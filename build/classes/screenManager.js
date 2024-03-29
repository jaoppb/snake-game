export default class ScreenManager {
    rendering;
    screens;
    current;
    mainElement;
    tick;
    constructor(mainElement) {
        this.rendering = true;
        this.screens = [];
        this.mainElement = mainElement;
        this.tick = 0;
    }
    subscribe(screen) {
        this.screens.push(screen);
        if (this.screens.length == 1)
            this.setScreen(screen);
    }
    unsubscribe(screen) {
        if (!this.screens.includes(screen))
            return;
        this.screens = this.screens.filter(e => e != screen);
    }
    setSize() {
        if (!(this.rendering && this.current))
            return;
        if (this.current.setSize)
            this.current.setSize();
    }
    setScreen(screen) {
        const { screens } = this;
        if (!screens.includes(screen))
            return;
        this.current?.removeElement();
        this.current = screens[screens.indexOf(screen)];
        this.current.load(this.mainElement);
        this.setSize();
    }
    update() {
        this.tick++;
        if (!this.current)
            return;
        const { current, tick } = this;
        if (current.update && tick % Math.round(100 / current.ups) == 0)
            current.update();
        if (current.render)
            current.render();
    }
    keyboard(event) {
        this.current?.keyboard(event);
    }
}
