import Camera from './Camera.js';
import Timer from './Timer.js';
import {loadLevel} from './Loaders.js'
import {createMario} from './Entities.js'
import {createCollisionLayer, createCameraLayer} from './Layers.js'
import {setupKeyboard} from './Input.js'
import {setupMouseControl} from './debug.js'


const canvas = document.querySelector('#screen');
const context = canvas.getContext('2d');

// Parallelizing asynchronous calls 
Promise.all([
    createMario(),
    loadLevel('1-1'),
])
.then(([mario, level]) => {
    const camera = new Camera(0, 0);
    window.camera = camera;
    mario.pos.set(64, 180);

    // debug layers
    level.comp.layers.push(
        createCollisionLayer(level), 
        createCameraLayer(camera));
    
    level.entities.add(mario);

    const input = setupKeyboard(mario);
    input.listenTo(window);

    // debugging code (click on canvas to place mario)
    setupMouseControl(canvas, mario, camera);

    const timer = new Timer(1/60)
    // redraw  at each frame
    timer.update = function update(deltaTime) {
        level.update(deltaTime);

        if (mario.pos.x > 100) {
            camera.pos.x = mario.pos.x - 100;
        }
        level.comp.draw(context, camera);
     }

    timer.start();
})
