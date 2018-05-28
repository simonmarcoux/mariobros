import Compositor from './Compositor.js'
import Entity from './Entity.js'
import {loadLevel} from './Loaders.js'
import {createMario} from './Entities.js'
import {loadBackgroundSprite} from './Sprites.js'
import {createBackgroundLayer, createSpriteLayer} from './Layers.js'
import Timer from './Timer.js';

import Keyboard from './KeyboardState.js';

const canvas = document.querySelector('#screen');
const context = canvas.getContext('2d');

// Parallelizing asynchronous calls 
Promise.all([
    createMario(),
    loadBackgroundSprite(), 
    loadLevel('1-1'),
])
.then(([mario, backgroundSprites, level]) => {
    const comp = new Compositor();

    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites)
    comp.layers.push(backgroundLayer);
    
    const gravity = 2000;
    mario.pos.set(64, 180);
    // mario.vel.set(200, -600);

    const SPACE = 32;
    const input = new Keyboard();
    input.addMapping(SPACE, keyState => {
        if (keyState) {
            mario.jump.start();
        } else {
            mario.jump.cancel();
        }
    });
    input.listenTo(window)

    const spriteLayer = createSpriteLayer(mario);
    comp.layers.push(spriteLayer);

    const timer = new Timer(1/60)

    // redraw compositor at each frame
    timer.update = function update(deltaTime) {
        mario.update(deltaTime);
        comp.draw(context);
        mario.vel.y += gravity * deltaTime;
    }

    timer.start();
})
