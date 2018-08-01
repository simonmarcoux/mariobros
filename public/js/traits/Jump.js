import {Trait, Sides} from '../Entity.js';

export default class Jump extends Trait {
    constructor() {
        super('jump');

        this.ready = 0;

        this.duration = 0.3;
        this.velocity = 200;
        this.engagedTime = 0;

        this.requestTime = 0;
        this.gracePeriod = 0.1; // time to accept next jump before player has landed

    }

    get falling() {
        return this.ready < 0;
    }

    // implement wall jump here with obstruction on side 'left/right'
    // nice effect : crashing into the ceiling could activate another anim and active ceiling walk
    start() {
        this.requestTime = this.gracePeriod;
    }

    cancel() {
        this.engagedTime = 0;
        this.requestTime = 0;
    }

    obstruct(entity, side) {
        if (side === Sides.BOTTOM) {
            this.ready = 1;
        } else if (side === Sides.TOP) {
            this.cancel();
        }
    }

    update(entity, deltaTime) {
        if (this.requestTime > 0) {
            if (this.ready > 0) {
                this.engagedTime = this.duration;
                this.requestTime = 0;
            }

            this.requestTime -= deltaTime;
        }

        if (this.engagedTime > 0) {
            entity.vel.y = -this.velocity;
            this.engagedTime -= deltaTime;
        }

        this.ready--;
    }
}
