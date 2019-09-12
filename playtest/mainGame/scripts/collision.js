//if there is a collision, this moves the block to the point of intersection between the bullets path and the block, then changes the angle to reflect the collision
function getBlockBulletIntersection(startX, startY, intersectDx, intersectDy, brick) {
    //*****0
    //**1|---|
    //***|---|3
    //*****2
    endX = startX + intersectDx;
    endY = startY + intersectDy;
    //because collision returns true on player hit, this sanity check is needed for intended behvaiour
    if (!brickCollision(endX, endY, brick)) {
        return [endX, endY]
    }
    //slope and intersect
    m = intersectDy / intersectDx;
    b = endY - (m * endX)

    //finds where the bullet path collides with the sqaure
    potentialColl = getIntersections(brick, m, b);

    minDistance = 90000000;
    for (i = 0; i < potentialColl.length; i++) {
        cmp = getDistance(startX, startY, potentialColl[i]);
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
function getIntersections(brick, m, b) {
    brickLeftX = brick[0];
    brickTopY = brick[1];
    brickRightX = brick[0] + brickSize;
    brickBottomY = brick[1] + brickSize;

    collisionIntersect1 = [solveForX(brickTopY, m, b), brickTopY];
    collisionIntersect2 = [brickLeftX, solveForY(m, brickLeftX, b)];
    collisionIntersect3 = [solveForX(brickBottomY, m, b), brickBottomY];
    collisionIntersect4 = [brickRightX, solveForY(m, brickRightX, b)];

    return [collisionIntersect1, collisionIntersect2, collisionIntersect3, collisionIntersect4];
}

//returns true if the x and y coordinates are contained within the block
function brickCollision(bulletX, bulletY, brick) {
    modifier = 0; //how far out the block collision extends
    checkX = (bulletX >= brick[0] - modifier && bulletX <= brick[0] + brickSize + modifier);
    checkY = (bulletY >= brick[1] - modifier && bulletY <= brick[1] + brickSize + modifier)
    return (checkX && checkY);
}

//returns true if the bullet is colliding with a block, and a bullet cannot bounce off the same block twice
function bulletCollisions(collX, collY, walls) {
    for (pos = 0; pos < walls.length; pos++) {
        result = brickCollision(collX, collY, walls[pos]);
        if (result) {
            currentBounce = [walls[pos][0], walls[pos][1]]
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
        result = brickCollision(collX, collY, walls[pos]);
        if (result) {
            return true
        }

    }
    return false;
}