export default class ScreenBase {
    element;
    classes = [];
    ups = 10;

    constructor(element, classes) {
        this.element = element;
        this.elements = new ElementHolder(this.element);
        this.classes = classes;
        this.element.classList.add(...this.classes);
    }

    keyboard(event) {
        const {keyboardEvents} = this;
        if(!keyboardEvents) return;

        if(keyboardEvents.any) keyboardEvents.any(event);
        if(keyboardEvents[event.key]) keyboardEvents[event.key](event);
    }

    load(parent) {
        const current = document.querySelector(this.classes.map(value => `#${parent.id} .${value}`).join(","));
        if (current && current == this.element) return;

        parent.appendChild(this.element)
    }

    removeElement() {
        this.element.remove();
    }
}

export class ElementHolder {
    constructor(element) {
        this.element = element;
        this.children = {};
    }

    createChild(name, child, returnHolder = false) {
        this.children[name] = new ElementHolder(child);
        this.element.appendChild(child);
        child.classList.add(name);

        return returnHolder ? this.children[name] : child;
    }

    removeChild(name) {
        if(!this.children[name]) return;

        this.children[name].element.remove();
        this.children.delete(name);
    }
}