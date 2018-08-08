import Entity, {Sides} from '../Entity.js';
import PendulumWalk from '../traits/PendulumWalk.js';
import {loadSpriteSheet} from '../Loaders.js';

export function loadKoopa() {
    return loadSpriteSheet('koopa')
    .then(createKoopaFactory);
}


function createKoopaFactory(sprite) {
    console.log(sprite);
    
    const walkAnim = sprite.animations.get('walk'); 

    function drawkoopa(context) {
        sprite.draw(walkAnim(this.lifetime), context, 0, 0, this.vel.x < 0);
    }

    return function createkoopa() {
        const koopa = new Entity();
        koopa.size.set(16, 16);
        koopa.offset.y = 8;

        koopa.addTrait(new PendulumWalk());

        koopa.draw = drawkoopa;
        return koopa;
    }
}