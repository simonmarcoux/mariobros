export function createBackgroundLayer(level, sprites) {
    const buffer = document.createElement('canvas');
    buffer.width = 2048;
    buffer.height = 240;

    const context = buffer.getContext('2d');
    
    level.tiles.forEach((tile, x, y) => {
        sprites.drawTile(tile.name, context, x, y);
    });

    return function drawBackgroundLayer(context, camera) {
        context.drawImage(buffer, -camera.pos.x, -camera.pos.y);
    }
}

export function createSpriteLayer(entities, width = 64, height = 64) {
    const spriteBuffer = document.createElement('canvas');
    spriteBuffer.width = width;
    spriteBuffer.height = height;

    const spriteBufferContext = spriteBuffer.getContext('2d');
    

    return function drawSpriteLayer(context, camera) {
        entities.forEach(entity => {
            spriteBufferContext.clearRect(0, 0, width, height);

            entity.draw(spriteBufferContext);
            
            context.drawImage(
                    spriteBuffer,
                    entity.pos.x - camera.pos.x, 
                    entity.pos.y - camera.pos.y);
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

    return function drawCollision(context, camera) {
        context.strokeStyle = 'blue';
        resolvedtiles.forEach(({x, y}) => {
            context.beginPath();
            context.rect(
                x * tileSize - camera.pos.x, 
                y * tileSize - camera.pos.y, 
                tileSize, tileSize);
            context.stroke();
            // console.log('would draw ', x, y);
        });

        context.strokeStyle = 'red';
        level.entities.forEach(entity => { 
            context.beginPath();
            context.rect(
                entity.pos.x - camera.pos.x, 
                entity.pos.y - camera.pos.y, 
                entity.size.x, 
                entity.size.y);
            context.stroke();
        });

        resolvedtiles.length = 0;
    }
}
