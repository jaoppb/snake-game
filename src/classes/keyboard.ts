import ScreenBase from "./screenBase";
import ScreenManager from "./screenManager";

export default class Keyboard {
    listeners: Array<ScreenManager | ScreenBase>;
    constructor(targets: Array<ScreenManager | ScreenBase>) {
        this.listeners = targets ?? [];
    }

    subscribe(target: ScreenBase) {
        if(!target.keyboard) return;

        this.listeners.push(target);
    }

    unsubscribe(target: ScreenBase) {
        if(!this.listeners.includes(target)) return;

        this.listeners.splice(this.listeners.indexOf(target), 1);
    }

    listener(event: KeyboardEvent) {
        for(const target of this.listeners) {
            target.keyboard(event);
        }
    }
}