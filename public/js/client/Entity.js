import {Vec2} from './Math.js';
import BoundingBox from './BoundingBox.js';
import Events from './Events.js';

export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right'),
}

export class Trait {
    constructor(name) {
        this.NAME = name;
        this.tasks = [];

        
    }

    finalize() {
        this.tasks.forEach(task => task());
        this.tasks.length = 0;
    }

    // task: callback
    queue(task) {
        this.tasks.push(task);

    }

    collides(us, them) {
        // console.log('collided with', them);
    }

    obstruct() {}

    update() {
        // console.warn('unhandled update call in Trait');
    }
}

export default class Entity {
    constructor() {
        this.pos = new Vec2(0, 0);
        this.vel = new Vec2(0, 0);
        this.size = new Vec2(0, 0);
        this.offset = new Vec2(0, 0);
        this.bounds = new BoundingBox(this.pos, this.size, this.offset);
        this.lifetime = 0;

        this.events = new Events();

        this.traits = [];
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    collides(candidate) {
        this.traits.forEach(trait => {
            trait.collides(this, candidate);
        });

        // console.log('touched', candidate);
    }

    // or ...args
    obstruct(side, match) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side, match);
        });
    }

    // possible to add a player controller entity with nothing to draw
    draw() {}

    finalize() {
        this.traits.forEach(trait => {
            trait.finalize();
        })
    }

    update(deltaTime, level) {
        this.traits.forEach(trait => {
            trait.update(this, deltaTime, level);
        });

        this.lifetime += deltaTime;
    }
}