import Camera from './Camera.js';
import Timer from './Timer.js';
import {loadLevel} from './loaders/level.js'
import {loadMario} from './entities/Mario.js'
import {loadGoomba} from './entities/Goomba.js'
import {createCollisionLayer, createCameraLayer} from './Layers.js'
import {setupKeyboard} from './Input.js'
import {setupMouseControl} from './debug.js'


const canvas = document.querySelector('#screen');
const context = canvas.getContext('2d');

// Parallelizing asynchronous calls 
Promise.all([
    loadMario(),
    loadGoomba(),
    loadLevel('1-1'),
])
.then(([createMario, createGoomba, level]) => {
    const camera = new Camera(0, 0);
    window.camera = camera;

    const mario = createMario();
    mario.pos.set(64, 180);


    const goomba = createGoomba();
    goomba.pos.set(220, 180);
    level.entities.add(goomba);

    // adds more mario on jump (looks like particles)
    // test to create synchronous entities
    // mario.addTrait({
    //     NAME: 'hacktrait',
    //     spawnTimeout: 0,
    //     obstruct() {},
    //     update(mario, deltaTime) {
    //         if (this.spawnTimeout > 0.1 && mario.vel.y < 0) {
    //             const spawn = createMario();
    //             spawn.pos.x = mario.pos.x;
    //             spawn.pos.y = mario.pos.y;
    //             spawn.vel.y = mario.vel.y - 200;
    //             level.entities.add(spawn);
    //             this.spawnTimeout = 0;
    //             if (spawn.pos.x < camera.pos.x) {
    //                 level.entities.remove(spawn);
    //             }
    //         }
    //         this.spawnTimeout += deltaTime;
    //     }
    // });
    // level.entities.add(mario);


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
