import Entity, {Trait} from '../Entity.js';
import Jump from '../traits/Jump.js';
import Go from '../traits/Go.js';
import Stomper from '../traits/Stomper.js';
import Killable from '../traits/Killable.js';
import {loadSpriteSheet} from '../Loaders.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';

const SLOW_DRAG = 1/1200;
const FAST_DRAG = 1/5000;

export function loadMario() {
    return loadSpriteSheet('mario')
    // return loadSpriteSheet('pikachu')
    .then(createMarioFactory);
}


function createMarioFactory(sprite) {
    // console.log(sprite);
    // create animation from tile names
    const runAnim = sprite.animations.get('run'); //createAnim(['run-1', 'run-2', 'run-3'], 7);

    function routeFrame(mario) {
        if (mario.jump.falling) {
            return 'jump';
        }

        if (mario.go.distance > 0) {
            if ((mario.vel.x > 0 && mario.go.dir < 0) || (mario.vel.x < 0 && mario.go.dir > 0)) {
                return 'break';
                
            }
            return runAnim(mario.go.distance);
        }
        return 'idle';
    }

    function setTurboState(turboOn) {
        this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
    }

    function drawMario(context) {
        sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
    }

    return function createMario() {
        // console.log(sprite);
        const mario = new Entity();
        mario.size.set(14, 16);
        // pikachu offset
        // mario.offset.y = 7;
        // mario.offset.x = 7;

        mario.addTrait(new Physics());
        mario.addTrait(new Solid());
        mario.addTrait(new Go());
        mario.addTrait(new Jump());
        mario.addTrait(new Stomper());
        mario.addTrait(new Killable());

        mario.killable.removeAfter = 0;

        mario.turbo = setTurboState;
        mario.draw = drawMario;

        mario.turbo(false); // mario.go.dragFactor = SLOW_DRAG;

        return mario;
    }
}