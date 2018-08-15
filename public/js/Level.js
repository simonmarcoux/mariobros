import Compositor from "./Compositor.js";
import EntityCollider from "./EntityCollider.js";
import TileCollider from "./TileCollider.js";

export default class Level {
    constructor() {
        this.gravity = 1500;
        this.totalTime = 0;
   
        this.comp = new Compositor()
        this.entities = new Set();
        // this.tiles = new Matrix();

        this.entityCollider = new EntityCollider(this.entities);
        this.tileCollider = null;

        
    }

    setCollisionGrid(matrix) {
        this.tileCollider = new TileCollider(matrix);
    }

    update(deltaTime) {
        // tile collisions loop
        this.entities.forEach(entity => {
            entity.update(deltaTime, this);

            entity.pos.x += entity.vel.x * deltaTime;
            if (entity.canCollide) {
                this.tileCollider.checkX(entity);
                
            }
            
            entity.pos.y += entity.vel.y * deltaTime;
            if (entity.canCollide) {
                this.tileCollider.checkY(entity);
            }
            entity.vel.y += this.gravity * deltaTime;
        });

        // entity collisions loop
        this.entities.forEach(entity => {
            if (entity.canCollide) {
                this.entityCollider.check(entity);
            }
        });

        this.totalTime += deltaTime;
    }
}