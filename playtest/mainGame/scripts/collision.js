//should brickSize be global?
//returns true if there is at least one collision point between the start and the end
function checkCollision(startX, startY, dx, dy, walls) {
    var flag = false
    var endX = startX + dx;
    var endY = startY + dy;
    var m = dy / dx;
    var b = endY - (m * endX)

    for (let wall of walls) {
        var potentialColl = getIntersections(wall, m, b);
        if (!flag) {
            for (let collision of potentialColl) {
                if (checkCenter(startX, startY, endX, endY, collision)) {
                    if (areEqual(collision[0], lastCollision[0], tolerance) && areEqual(collision[1], lastCollision[1], tolerance)) {
                        break;
                    } else {
                        flag = true;
                        break;
                    }
                }
            };
        }
        if (flag) {
            break;
        }
    };
    return flag;
}

function getCollisions(startX, startY, dx, dy, walls) {
    var allCollisions = [];
    var endX = startX + dx;
    var endY = startY + dy;
    var m = dy / dx;
    var b = endY - (m * endX)

    for (let wall of walls) {
        var potentialColl = getIntersections(wall, m, b);
        var side = 0;
        for (let collision of potentialColl) {
            if (checkCenter(startX, startY, endX, endY, collision)) {
                if (areEqual(collision[0], lastCollision[0], tolerance) && areEqual(collision[1], lastCollision[1], tolerance)) {
                    break;
                } else {
                    allCollisions.push([collision,side,wall]);
                }

            };
            side++;
        }

    };

    return allCollisions;
}

//if there is a collision, this moves the block to the point of intersection between the bullets path and the block, then changes the angle to reflect the collision
function getBlockBulletIntersection(startX, startY, intersectDx, intersectDy, walls) {
    //*****0
    //**1|---|
    //***|---|3
    //*****2
    var potentialColl = getCollisions(startX, startY, intersectDx, intersectDy, walls)

    var minDistance = 90000000;
    var closest;
    var side;
    var brick;
    for (i = 0; i < potentialColl.length; i++) {
        var cmp = getDistance(startX, startY, potentialColl[i][0]);
        if (cmp < minDistance) {
            minDistance = cmp;
            closest = potentialColl[i][0];
            side = potentialColl[i][1];
            brick = potentialColl[i][2];
        }
    }
    //index is the side that is bouncing off of, so with that we can change the angle
    var endX = startX + intersectDx;
    var endY = startY + intersectDy;
    var m = intersectDy / intersectDx
    var b = endY - (m * endX)
    return [closest, side]
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
    var modifier = brickSize/20; //how far out the block collision extends
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

function checkCenter(startX, startY, endX, endY, collision) {
    var condition1 = false;
    var condition2 = false;
    if (startX < endX) {
        condition1 = (startX <= collision[0] && endX >= collision[0])
    } else {
        condition1 = (endX <= collision[0] && startX >= collision[0])
    }

    if (startY < endY) {
        condition2 = (startY <= collision[1] && endY >= collision[1])
    } else {
        condition2 = (startY >= collision[1] && endY <= collision[1])
    }

    return condition1 && condition2
}