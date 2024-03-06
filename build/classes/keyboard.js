export default class Keyboard {
    listeners;
    constructor(targets) {
        this.listeners = targets ?? [];
    }
    subscribe(target) {
        if (!target.keyboard)
            return;
        this.listeners.push(target);
    }
    unsubscribe(target) {
        if (!this.listeners.includes(target))
            return;
        this.listeners.splice(this.listeners.indexOf(target), 1);
    }
    listener(event) {
        for (const target of this.listeners) {
            target.keyboard(event);
        }
    }
}
