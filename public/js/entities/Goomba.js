import Entity, {Trait, Sides} from '../Entity.js';
import {loadSpriteSheet} from '../Loaders.js';

export function loadGoomba() {
    return loadSpriteSheet('goomba')
    .then(createGoombaFactory);
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

        goomba.addTrait({
            NAME: 'walk',
            speed: -30,
            obstruct(goomba, side) {
                if (side === Sides.LEFT || side === Sides.RIGHT) {
                    this.speed = -this.speed;
                }
            },
            update(goomba, deltaTime) {
                goomba.vel.x = this.speed;

            }
        })

        goomba.draw = drawgoomba;
        return goomba;
    }
}