import Entity, {Trait} from './Entity.js';
import Jump from './traits/Jump.js';
import Velocity from './traits/Velocity.js';
import {loadMarioSprite} from './Sprites.js';

export function createMario() {
    return loadMarioSprite().then(sprite => {
        const mario = new Entity();
        mario.size.set(16, 16);

        mario.addTrait(new Jump());
        mario.addTrait(new Velocity());
        
        mario.draw = function drawMario(context) {
            sprite.draw('idle', context, this.pos.x, this.pos.y);
        }

        return mario;
    });
}