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
    function applyRange(background, xStart, xLen, yStart, yLen) {
        const xEnd = xStart + xLen;
        const yEnd = yStart + yLen;
        // extrapolate coordinates
        for (let x = xStart; x < xEnd; x++) {
            for (let y = yStart; y < yEnd; y++) {
                level.tiles.set(x, y, {
                    name: background.tile,
                });
            }        
        } 
    }

    backgrounds.forEach(background => {
        // loop over the backgrounds
        background.ranges.forEach(range => {
            if (range.length === 4) {
                const [xStart, xLen, yStart, yLen] = range;
                applyRange(background, xStart, xLen, yStart, yLen);
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