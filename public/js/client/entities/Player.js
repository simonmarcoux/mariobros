import Entity, {Trait} from '../Entity.js';
import Jump from '../traits/Jump.js';
import Go from '../traits/Go.js';
import Stomper from '../traits/Stomper.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import {loadSpriteSheet} from '../Loaders.js';
import Physics from '../traits/Physics.js';

const SLOW_DRAG = 1/1200;
const FAST_DRAG = 1/5000;

export function loadPlayer() {
    return loadSpriteSheet('pikachu')
    .then(createPlayerFactory);
}


function createPlayerFactory(sprite) {
    // create animation from tile names
    const runAnim = sprite.animations.get('run'); //createAnim(['run-1', 'run-2', 'run-3'], 7);

    function routeFrame(player) {
        if (player.jump.falling) {
            return 'jump';
        }

        if (player.go.distance > 0) {
            if ((player.vel.x > 0 && player.go.dir < 0) || (player.vel.x < 0 && player.go.dir > 0)) {
                return 'break';
                
            }
            return runAnim(player.go.distance);
        }
        return 'idle';
    }

    function setTurboState(turboOn) {
        this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
    }

    function drawPlayer(context) {
        sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
    }

    return function createPlayer() {
        // console.log(sprite);
        const player = new Entity();
        player.size.set(14, 16);
        // pikachu offset
        player.offset.y = 7;
        player.offset.x = 7;


        player.addTrait(new Physics());
        player.addTrait(new Solid());
        player.addTrait(new Go());
        player.addTrait(new Jump());
        player.addTrait(new Stomper());
        player.addTrait(new Killable());

        player.killable.removeAfter = 0;

        player.turbo = setTurboState;
        player.draw = drawPlayer;

        player.turbo(false); // player.go.dragFactor = SLOW_DRAG;

        return player;
    }
}