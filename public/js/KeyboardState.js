const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
    constructor() {
        // holds the current state of a given key
        this.keyStates = new Map();

        // holds the callback functions for a key code
        this.keyMap = new Map();


    }

    addMapping(keyCode, callback) {
        this.keyMap.set(keyCode, callback);
    }

    handleEvent(e) {
        const {keyCode} = e;

        if (!this.keyMap.has(keyCode)) {
            // if key is not mapped, let default behavior
            return;
        }

        e.preventDefault();

        const keyState = e.type === 'keydown' ? PRESSED : RELEASED;

        if (this.keyStates.get(keyCode) === keyState) {
            return;
        }

        this.keyStates.set(keyCode, keyState);
        console.log(this.keyStates);
        this.keyMap.get(keyCode)(keyState);
    }

    listenTo(window) {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, e => {
                this.handleEvent(e)
            })
        })
    }
}