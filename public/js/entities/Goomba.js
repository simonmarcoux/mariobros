import Entity, {Sides, Trait} from '../Entity.js';
import PendulumWalk from '../traits/PendulumWalk.js';
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
        us.pendulumWalk.speed = 0;
    }
}

function createGoombaFactory(sprite) {
    console.log(sprite);
    
    const walkAnim = sprite.animations.get('walk'); 

    function drawgoomba(context) {
        sprite.draw(walkAnim(this.lifetime), context, 0, 0);
    }

    return function creategoomba() {
        const goomba = new Entity();
        goomba.size.set(16, 16);

        goomba.addTrait(new PendulumWalk());
        goomba.addTrait(new Behavior());

        goomba.draw = drawgoomba;
        return goomba;
    }
}