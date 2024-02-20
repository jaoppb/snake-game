export default class ScreenManager {
    constructor(canvas) {
        this.rendering = true
        this.screens = []
        this.canvas = canvas
        this.tick = 0
    }

    subscribe(screen) {
        this.screens.push(screen)
        if(this.screens.length == 1) this.current = this.screens[0]
    }

    unsubscribe(screen) {
        if(!this.screens.includes(screen)) return
        this.screens = this.screens.filter(e=>e!=screen)
    }

    setSize() {
        if(!(this.rendering && this.current)) return
        this.current.setSize(this.canvas);
    }

    update() {
        this.tick++
        if(!this.current) return
        const {current, tick, canvas} = this
        if(tick % Math.round(100 / current.ups) == 0) current.update()
        current.render(canvas.context)
    }

    keyboard(event) {
        this.current?.keyboard(event);
    }
}