import Entity, {Sides, Trait} from '../Entity.js';
import PendulumMove from '../traits/PendulumMove.js';
import Killable from '../traits/Killable.js';
import {loadSpriteSheet} from '../Loaders.js';

export function loadGoomba() {
    return loadSpriteSheet('goomba')
    .then(createGoombaFactory);
}

class Behavior extends Trait {
    constructor() {
        super('behavior');
    }

    collides(us, them) {
        // feature detection
        if (us.killable.dead) return;
        
        if (them.stomper) {
            if (them.vel.y > us.vel.y) {
                us.killable.kill();
                us.pendulumMove.speed = 0;
            } else {
                them.killable.kill();
            }
        }
    }
}

function createGoombaFactory(sprite) {
    // console.log(sprite);
    
    const walkAnim = sprite.animations.get('walk'); 

    function routeAnim(goomba) {
        if (goomba.killable.dead) {
            return 'flat';
        }
        return walkAnim(goomba.lifetime)
    }

    function drawgoomba(context) {
        sprite.draw(routeAnim(this), context, 0, 0);
    }

    return function creategoomba() {
        const goomba = new Entity();
        goomba.size.set(16, 16);

        goomba.addTrait(new PendulumMove());
        goomba.addTrait(new Behavior());
        goomba.addTrait(new Killable());

        goomba.draw = drawgoomba;
        return goomba;
    }
}