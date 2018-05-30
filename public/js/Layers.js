export function createBackgroundLayer(level, sprites) {
    const buffer = document.createElement('canvas');
    buffer.width = 256;
    buffer.height = 240;

    const context = buffer.getContext('2d');
    
    level.tiles.forEach((tile, x, y) => {
        sprites.drawTile(tile.name, context, x, y);
    });

    return function drawBackgroundLayer(context) {
        context.drawImage(buffer, 0, 0)
    }
}

export function createSpriteLayer(entities) {
    return function drawSpriteLayer(context) {
        entities.forEach(entity => {
            entity.draw(context);
        });
    }
}

export function createCollisionLayer(level) {
    const resolvedtiles = [];

    const tileResolver = level.tileCollider.tiles;
    const tileSize = tileResolver.tileSize;

    // save original function
    const getByIndexOriginal = tileResolver.getByIndex;

    // override function and do what we want instead
    tileResolver.getByIndex = function getByIndexFake(x, y) {
        resolvedtiles.push({x, y});
        return getByIndexOriginal.call(tileResolver, x, y);
    }

    return function drawCollision(context) {
        context.strokeStyle = 'blue';
        resolvedtiles.forEach(({x, y}) => {
            context.beginPath();
            context.rect(x * tileSize, y * tileSize, tileSize, tileSize);
            context.stroke();
            console.log('would draw ', x, y);
        });

        resolvedtiles.length = 0;
    }
}
