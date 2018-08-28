import { loadImage } from "../Loaders";
import SpriteSheet from "../SpriteSheet";

const CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

export function loadFont() {
    return loadImage('./assets/img/font.png')
        .then(image => {
            const fontSprite = new SpriteSheet(image);

            const size = 8; 
            const rowLen = image.width;

            // convert iterable to array and loop in the new entries 
            for (let [index, char] of [...CHARS].entries()) {
               const x = index * size % rowLen;
               const y = Math.floor(index * size / rowLen) * size;
               fontSprite.define(char, x, y, size, size);
            //    console.log(index, char, x, y); 
            }


            return fontSprite;
        });
}

class Font {
    constructor() {
        
    }
}