export default class Keyboard {
    constructor(targets) {
        this.listeners = targets ?? []
    }

    subscribe(target) {
        if(typeof target != Object) return

        this.listeners.push(target)
    }

    unsubscribe(target) {
        if(!this.listeners.includes(target)) return

        delete this.listeners[target]
    }

    listener(event) {
        for(const target of this.listeners) {
            target.keyboard(event)
        }
    }
}