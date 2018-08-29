import PlayerController from './traits/PlayerController.js';
import { setupKeyboard } from './Input.js';
import Entity from './Entity.js';

function createPlayerEnv(playerEntity) {
    const playerEnv = new Entity();
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64, 64);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);

    return playerEnv;
}


export default class PlayerManager {
    constructor() {
        this.instances = new Set;

        this.names = ['mario', 'player'];

    }

    createPlayer(entityFactory, level, name, local = false) {
        let player;
        
        if (name === 'mario') {
            player = entityFactory.mario();
            
        } else {
            player = entityFactory.player();
        }
        
        this.instances.add(player);

        const playerEnv = createPlayerEnv(player);
        // const playerEnv = createPlayerEnv(mario);
        level.entities.add(playerEnv);


        if (local) {
            const input = setupKeyboard(player);
            input.listenTo(window);
        }

        return player;
    }

    removePlayer(player) {
        this.instances.delete(player);
        
        console.log('remove player');
        // remove from canvas
        player.killable.kill();
        level.entities.delete(player);
    }
}
