import Camera from './Camera.js';
import Timer from './Timer.js';
import Entity from './Entity.js';
import PlayerController from './traits/PlayerController.js';
import {createLevelLoader} from './loaders/level.js'
import {loadEntities} from './Entities.js'

import {createCollisionLayer, createCameraLayer} from './Layers.js'
import {setupKeyboard} from './Input.js'
import {setupMouseControl} from './debug.js'

function createPlayerEnv(playerEntity) {
    const playerEnv = new Entity();
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64, 64);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);

    return playerEnv;
}

async function main(canvas) {
    const context = canvas.getContext('2d');

    const entityFactory = await loadEntities();
    const loadLevel = await createLevelLoader(entityFactory);
    const level = await loadLevel('1-1');

    const camera = new Camera(0, 0);
    window.camera = camera;

    const player = entityFactory.player();
    // const mario = entityFactory.mario();
    // mario.pos.set(64, 180);
    // level.entities.add(mario);

    // const goomba = entityFactory.goomba();
    // goomba.pos.set(220, 180);
    // level.entities.add(goomba);

    // const koopa = entityFactory.koopa();
    // koopa.pos.set(280, 180);
    // level.entities.add(koopa);

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
        createCollisionLayer(level));
        // createCameraLayer(camera));
    

    const playerEnv = createPlayerEnv(player);
    // const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);

    const input = setupKeyboard(player);
    // const input = setupKeyboard(mario);
    input.listenTo(window);

    // debugging code (click on canvas to place mario)
    setupMouseControl(canvas, player, camera);
    // setupMouseControl(canvas, mario, camera);

    const timer = new Timer(1/60)
    // redraw  at each frame
    timer.update = function update(deltaTime) {
        level.update(deltaTime);

        camera.pos.x = Math.max(0, player.pos.x - 100);
        // camera.pos.x = Math.max(0, mario.pos.x - 100);
        level.comp.draw(context, camera);
     }

    timer.start();
}

const canvas = document.querySelector('#screen');
main(canvas);