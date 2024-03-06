export default class ScreenBase {
    element: HTMLElement;
    elements: ElementHolder;
    classes: string[] = [];
    keyboardEvents: Record<string, Function>;
    ups = 10;

    constructor(element: HTMLElement, classes: string[]) {
        this.element = element;
        this.elements = new ElementHolder(this.element);
        this.classes = classes;
        this.element.classList.add(...this.classes);
    }

    keyboard(event: KeyboardEvent) {
        const { keyboardEvents } = this;
        if (!keyboardEvents) return;

        if (keyboardEvents.any) keyboardEvents.any(event);
        if (keyboardEvents[event.key]) keyboardEvents[event.key](event);
    }

    load(parent: HTMLElement) {
        const current = document.querySelector(this.classes.map(value => `#${parent.id} .${value}`).join(","));
        if (current && current == this.element) return;

        parent.appendChild(this.element)
    }

    removeElement() {
        this.element.remove();
    }

    update() {}

    render() {}

    setSize() {}
}

export class ElementHolder {
    element: HTMLElement;
    children: Record<string, ElementHolder>;
    constructor(element: HTMLElement) {
        this.element = element;
        this.children = {};
    }

    createChild(name: string, child: HTMLElement, returnHolder: boolean = false): HTMLElement | ElementHolder {
        this.children[name] = new ElementHolder(child);
        this.element.appendChild(child);
        child.classList.add(name);

        return returnHolder ? this.children[name] : child;
    }

    removeChild(name: string) {
        if (!this.children[name]) return;

        this.children[name].element.remove();
        delete this.children[name];
    }
}