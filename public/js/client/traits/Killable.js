import {Trait, Sides} from '../Entity.js';
import Events from '../Events.js';

export default class Killable extends Trait {
    constructor() {
        super('killable');

        this.dead = false;
        this.deadTime = 0;
        this.removeAfter = 2;

        this.events = new Events();
    }

    // public kill method
    kill() {
        this.queue(() => this.dead = true);
    }

    revive() {
        this.dead = false;
        this.deadTime = 0;
    }

    update(entity, deltaTime, level) {
        if (this.dead) {
            this.deadTime += deltaTime;
            if (this.deadTime > this.removeAfter) {
                this.queue(() => {
                    level.entities.delete(entity);
                    this.events.emit('kill', entity);
                });
            }
        }
    }
}
