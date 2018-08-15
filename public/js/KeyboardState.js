const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
    constructor() {
        // holds the current state of a given key
        this.keyStates = new Map();

        // holds the callback functions for a key code
        this.keyMap = new Map();


    }

    addMapping(code, callback) {
        this.keyMap.set(code, callback);
    }

    handleEvent(e) {
        const {code} = e;

        if (!this.keyMap.has(code)) {
            // if key is not mapped, let default behavior
            return;
        }

        e.preventDefault();

        const keyState = e.type === 'keydown' ? PRESSED : RELEASED;

        if (this.keyStates.get(code) === keyState) {
            return;
        }

        this.keyStates.set(code, keyState);
        // console.log(this.keyStates);
        this.keyMap.get(code)(keyState);
    }

    listenTo(window) {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, e => {
                this.handleEvent(e)
            })
        })
    }
}