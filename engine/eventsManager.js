class eventsManager {
    constructor() {
        this.bind = [];
        this.action = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = null;
    }

    setup(canvas) {
        this.canvas = canvas;
        this.bind[87] = 'up';
        this.bind[65] = 'left';
        this.bind[83] = 'down';
        this.bind[68] = 'right';
        this.bind[32] = 'fire';
        this.bind[82] = 'restart';
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.body.addEventListener('keydown', this.onKeyDown);
        document.body.addEventListener('keyup', this.onKeyUp);
    }

    // Расстояние до курсора
    getMouseDelta() {
        let mouseDeltaX = this.mouse.x - getGameManager().playerPosOnScreen().x;
        let mouseDeltaY = this.mouse.y - getGameManager().playerPosOnScreen().y;
        return { x: mouseDeltaX, y: mouseDeltaY };
    }

    onMouseDown(event) {
        getEventsManager().action['fire'] = true;
    }

    onMouseUp(event) {
        getEventsManager().action['fire'] = false;
    }

    onMouseMove(event) {
        console.log('mouse move');
        this.mouse = { x: event.clientX, y: event.clientY };
        console.log(this.mouse.x + " " + this.mouse.y);
    }


    onKeyDown(event) {
        let action = getEventsManager().bind[event.keyCode];

        if(action) {
            getEventsManager().action[action] = true;
        }
    }

    onKeyUp(event) {
        let action = getEventsManager().bind[event.keyCode];

        if(action) {
            getEventsManager().action[action] = false;

        }
    }
}