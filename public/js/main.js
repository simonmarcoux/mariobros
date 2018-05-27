import SpriteSheet from './SpriteSheet.js'
import {loadImage, loadLevel} from './Loaders.js'

function drawBackground(background, context, sprites) {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
        for (let x = x1; x < x2; x++) {
            for (let y = y1; y < y2; y++) {
                sprites.drawTile(background.tile, context, x, y);
            }        
        }    
    });
}

function loadBackgroundSprite(image) {
    return loadImage('assets/img/tiles.png')
    .then(image => { 
        console.log('image loaded', image)
        const sprites = new SpriteSheet(image, 16, 16);
        sprites.define('ground', 0, 0);
        sprites.define('sky', 3, 23);
        return sprites;
    });
}

const canvas = document.querySelector('#screen');
const context = canvas.getContext('2d');

Promise.all([
    loadBackgroundSprite(), 
    loadLevel('1-1'),
])
.then(([sprites, level]) => {
    console.log('level loaded', level);
    level.backgrounds.forEach(background => {
        drawBackground(background, context, sprites);
    });
})
