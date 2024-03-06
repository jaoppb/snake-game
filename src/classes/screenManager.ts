import ScreenBase from "./screenBase";

export default class ScreenManager {
    rendering: boolean;
    screens: ScreenBase[];
    current: ScreenBase;
    mainElement: HTMLElement;
    tick: number;
    constructor(mainElement) {
        this.rendering = true;
        this.screens = [];
        this.mainElement = mainElement;
        this.tick = 0;
    }

    subscribe(screen: ScreenBase) {
        this.screens.push(screen);
        if (this.screens.length == 1) this.setScreen(screen)
    }

    unsubscribe(screen: ScreenBase) {
        if (!this.screens.includes(screen)) return;
        this.screens = this.screens.filter(e => e != screen);
    }

    setSize() {
        if (!(this.rendering && this.current)) return;
        if (this.current.setSize) this.current.setSize();
    }

    setScreen(screen: ScreenBase) {
        const { screens } = this;
        if (!screens.includes(screen)) return;
        this.current?.removeElement();
        this.current = screens[screens.indexOf(screen)];
        this.current.load(this.mainElement);
        this.setSize();
    }

    update() {
        this.tick++;
        if (!this.current) return;
        const { current, tick } = this;
        if (current.update && tick % Math.round(100 / current.ups) == 0) current.update();
        if (current.render) current.render();
    }

    keyboard(event: KeyboardEvent) {
        this.current?.keyboard(event);
    }
}