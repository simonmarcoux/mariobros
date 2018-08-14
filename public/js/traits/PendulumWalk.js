import {Trait, Sides} from '../Entity.js';

export default class Jump extends Trait {
    constructor() {
        super('pendulumWalk');
        this.enabled = true;
        this.speed = -30;

    }

    obstruct(entity, side) {
        if (side === Sides.LEFT || side === Sides.RIGHT) {
            this.speed = -this.speed;
        }
    }

    update(entity, deltaTime) {
        if (this.enabled) {
            entity.vel.x = this.speed;
        }
    }
    
}
