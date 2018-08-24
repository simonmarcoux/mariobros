function createEntityLayer(entities) {
    return function drawBoundingBox(context, camera) {

        context.strokeStyle = 'red';
        entities.forEach(entity => { 
            context.beginPath();
            context.rect(
                entity.bounds.left - camera.pos.x, 
                entity.bounds.top - camera.pos.y, 
                entity.size.x, 
                entity.size.y);
                context.stroke();
        });
    }
}

function createTileCandidateLayer(tileCollider) {
    const resolvedtiles = [];

    const tileResolver = tileCollider.tiles;
    const tileSize = tileResolver.tileSize;

    // save original function
    const getByIndexOriginal = tileResolver.getByIndex;

    // override function and do what we want instead
    tileResolver.getByIndex = function getByIndexFake(x, y) {
        resolvedtiles.push({x, y});
        return getByIndexOriginal.call(tileResolver, x, y);
    }

    return function drawTileCandidates(context, camera) {
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

        resolvedtiles.length = 0;
    }
}

export function createCollisionLayer(level) {

    const drawBoundingBox = createEntityLayer(level.entities); 
    const drawTileCandidates = createTileCandidateLayer(level.tileCollider)

    return function drawCollision(context, camera) {
        drawTileCandidates(context, camera);
        drawBoundingBox(context, camera);
    }
}


