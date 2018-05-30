import Level from "./Level.js";
import {createBackgroundLayer, createSpriteLayer} from './Layers.js'
import {loadBackgroundSprite} from './Sprites.js'

export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();  // document.createElement('img')
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}

export function createTiles(level, backgrounds) {
    backgrounds.forEach(background => {
        // loop over the backgrounds
        background.ranges.forEach(([x1, x2, y1, y2]) => {
            // extrapolate coordinates
            for (let x = x1; x < x2; x++) {
                for (let y = y1; y < y2; y++) {
                    level.tiles.set(x, y, {
                        name: background.tile,
                    });
                }        
            }    
        });
    })
}

export function loadLevel(name) {
    
    return Promise.all([
        fetch(`levels/${name}.json`)
        .then(r => r.json()),

        loadBackgroundSprite(),
    ]) 
    
    .then(([levelSpec, backgroundSprites]) => {
        const level = new Level();

        createTiles(level, levelSpec.backgrounds);

        const backgroundLayer = createBackgroundLayer(level, backgroundSprites)
        level.comp.layers.push(backgroundLayer);
        
        const spriteLayer = createSpriteLayer(level.entities);
        level.comp.layers.push(spriteLayer);
        
        // console.log(level);
        // console.table(level.tiles.grid);

        return level;
    })
}