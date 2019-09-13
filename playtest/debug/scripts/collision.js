//should brickSize be global?

//if there is a collision, this moves the block to the point of intersection between the bullets path and the block, then changes the angle to reflect the collision
function getBlockBulletIntersection(startX, startY, intersectDx, intersectDy, brick) {
    //*****0
    //**1|---|
    //***|---|3
    //*****2
    var endX = startX + intersectDx;
    var endY = startY + intersectDy;
    //because collision returns true on player hit, this sanity check is needed for intended behvaiour
    if (!brickCollision(endX, endY, brick)) {
        return [endX, endY]
    }
    //slope and intersect
    var m = intersectDy / intersectDx;
    var b = endY - (m * endX)

    //finds where the bullet path collides with the sqaure
    var potentialColl = getIntersections(brick, m, b);

    var minDistance = 90000000;
    var indexClosest;
    var closest
    for (i = 0; i < potentialColl.length; i++) {
        var cmp = getDistance(startX, startY, potentialColl[i]);
        if (cmp < minDistance) {
            minDistance = cmp;
            closest = potentialColl[i];
            indexClosest = i;
        }
    }
    //index is the side that is bouncing off of, so with that we can change the angle
    return [closest, indexClosest]
}

//gets the intersections of a block with a line (defined as slope and intersect)
//needs to be edited to discard values that are out of bounds: change the solve for functions by giving them a lower and upper limit for the calculated value
function getIntersections(brick, m, b) {
    var brickLeftX = brick[0];
    var brickTopY = brick[1];
    var brickRightX = brick[0] + brickSize;
    var brickBottomY = brick[1] + brickSize;

    var collisionIntersect1 = [solveForX(brickTopY, m, b, brickRightX, brickLeftX), brickTopY];
    var collisionIntersect2 = [brickLeftX, solveForY(m, brickLeftX, b, brickBottomY, brickTopY)];
    var collisionIntersect3 = [solveForX(brickBottomY, m, b, brickRightX, brickLeftX), brickBottomY];
    var collisionIntersect4 = [brickRightX, solveForY(m, brickRightX, b, brickBottomY, brickTopY)];

    return [collisionIntersect1, collisionIntersect2, collisionIntersect3, collisionIntersect4];
}

//returns true if the x and y coordinates are contained within the block
function brickCollision(bulletX, bulletY, brick) {
    var modifier = 0; //how far out the block collision extends
    var checkX = (bulletX >= brick[0] - modifier && bulletX <= brick[0] + brickSize + modifier);
    var checkY = (bulletY >= brick[1] - modifier && bulletY <= brick[1] + brickSize + modifier)
    return (checkX && checkY);
}

//returns true if the bullet is colliding with a block, and a bullet cannot bounce off the same block twice
function bulletCollisions(collX, collY, walls) {
    for (pos = 0; pos < walls.length; pos++) {
        var result = brickCollision(collX, collY, walls[pos]);
        if (result) {
            var currentBounce = [walls[pos][0], walls[pos][1]]
            if (lastBounce[0] == currentBounce[0] && lastBounce[1] == currentBounce[1]) {
                return false; //cant bounce on the same brick twice, also used to keep track of bricks hit
            } else {
                lastBounce = currentBounce;
                return true
            }
        }
    }
    return false;
}

//returns true if the aim line is colliding with a block
function lineCollisions(collX, collY, walls) {
    for (pos = 0; pos < walls.length; pos++) {
        var result = brickCollision(collX, collY, walls[pos]);
        if (result) {
            return true
        }
    }
    return false;
}