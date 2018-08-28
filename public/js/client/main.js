import Camera from './Camera.js';
import Timer from './Timer.js';
import Entity from './Entity.js';
import PlayerController from './traits/PlayerController.js';
import {createLevelLoader} from './loaders/level.js'
import {loadEntities} from './Entities.js'
import { loadFont } from './loaders/Font.js';
import {createDashboardLayer} from './layers/Dashboard.js'
import {createCollisionLayer} from './layers/Collisions.js'
import {createCameraLayer} from './layers/Camera.js'
import {setupKeyboard} from './Input.js'
import {setupMouseControl} from './debug.js'
import PlayerManager from './client/PlayerManager.js';

// function createPlayerEnv(playerEntity) {
//     const playerEnv = new Entity();
//     const playerControl = new PlayerController();
//     playerControl.checkpoint.set(64, 64);
//     playerControl.setPlayer(playerEntity);
//     playerEnv.addTrait(playerControl);

//     return playerEnv;
// }

const connectionManager = new ConnectionManager();
connectionManager.connect('ws://localhost:9000');

async function main(canvas) {
    const context = canvas.getContext('2d');

    const [entityFactory, font] = await Promise.all([
        loadEntities(),
        loadFont()
    ]);

    const loadLevel = await createLevelLoader(entityFactory);
    const level = await loadLevel('1-1');

    const camera = new Camera(0, 0);
    window.camera = camera;

    const playerManager = new PlayerManager();
    const firstPlayer = playerManager.createPlayer(entityFactory, level, 'mario');
    const secondPlayer = playerManager.createPlayer(entityFactory, level, 'player');
    const playerInstances = playerManager.instances;

    // const player = entityFactory.player();
    // const player = entityFactory.mario();
    // const player2 = entityFactory.player();

    // debug layers
    level.comp.layers.push(
        createCollisionLayer(level));
        // createCameraLayer(camera));
    level.comp.layers.push(createDashboardLayer);
    

    // const playerEnv = createPlayerEnv(player);
    // // const playerEnv = createPlayerEnv(mario);
    // level.entities.add(playerEnv);
    
    // const playerEnv2 = createPlayerEnv(player2);
    // level.entities.add(playerEnv2);

    // const input = setupKeyboard(player);
    // const input2 = setupKeyboard(player2);
    // const input = setupKeyboard(mario);
    // input.listenTo(window);
    // input2.listenTo(window);

    // debugging code (click on canvas to place mario)
    // setupMouseControl(canvas, player, camera);
    // setupMouseControl(canvas, mario, camera);d

    const timer = new Timer(1/60)
    // redraw  at each frame
    timer.update = function update(deltaTime) {
        level.update(deltaTime);

        camera.pos.x = Math.max(0, firstPlayer.pos.x - 100);
        level.comp.draw(context, camera);

     }

    timer.start();
}

const canvas = document.querySelector('#screen');
main(canvas);