//returns true if there is at least one collision point between the start and the end
//populates the list of possible collisions
function checkCollision(startX, startY, dx, dy, walls) {
    allCollisions = [];
    var flag = false
    var endX = startX + dx;
    var endY = startY + dy;
    var m = dy / dx;
    var b = endY - (m * endX) //gets the equation of the line, could be changed to calculate all possible points on it faster maybe

    for (let wall of walls) { //for all bricks
        var potentialColl = getIntersections(wall, m, b); //get all intersections with the bullet line and the walls that make up the box
        var side = 0;

        for (let collision of potentialColl) {
            if (checkCenter(startX, startY, endX, endY, collision)) { //if the intersection falls in between the start and end of the movement
                if (areEqual(collision[0], lastCollision[0], tolerance) && areEqual(collision[1], lastCollision[1], tolerance)) { //if it did not just collide off of the same point, (tolerance == 0.00000001)
                    break;
                } else {
                    flag = true;
                    allCollisions.push([collision, side]); //sets it as a viable collision
                }
            }
            side++;
        };

    };
    return flag;
}

//if there is a collision, this moves the block to the point of intersection between the bullets path and the block, then changes the angle to reflect the collision
function getBlockBulletIntersection(startX, startY, intersectDx, intersectDy, walls) {
    //*****0
    //**1|---|
    //***|---|3
    //*****2
    var potentialColl = allCollisions; //possible collisions

    var minDistance = 90000000;
    var closest;
    var side;
    //gets the closest intersection
    for (i = 0; i < potentialColl.length; i++) {
        var cmp = getDistance(startX, startY, potentialColl[i][0]);
        if (cmp < minDistance) {
            minDistance = cmp;
            closest = potentialColl[i][0];
            side = potentialColl[i][1];
        }
    }
    
    return [closest, side]
}

//gets the intersections of a block with a line (defined as slope and intersect)
//needs to be edited to discard values that are out of bounds: change the solve for functions by giving them a lower and upper limit for the calculated value
function getIntersections(brick, m, b) {
    //these are the equations of the lines
    var brickLeftX = brick[0];
    var brickTopY = brick[1];
    var brickRightX = brick[0] + brickSize;
    var brickBottomY = brick[1] + brickSize;

    //solve for the point of intersection with the bullet line
    var collisionIntersect1 = [solveForX(brickTopY, m, b, brickRightX, brickLeftX), brickTopY];
    var collisionIntersect2 = [brickLeftX, solveForY(m, brickLeftX, b, brickBottomY, brickTopY)];
    var collisionIntersect3 = [solveForX(brickBottomY, m, b, brickRightX, brickLeftX), brickBottomY];
    var collisionIntersect4 = [brickRightX, solveForY(m, brickRightX, b, brickBottomY, brickTopY)];

    return [collisionIntersect1, collisionIntersect2, collisionIntersect3, collisionIntersect4];
}

//returns true if the x and y coordinates are contained within the block
function brickCollision(bulletX, bulletY, brick) {
    var modifier = brickSize / 20; //how far out the block collision extends
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

function checkKill() {
    if (bounceCount < bouncesToDie || frames < iFrames || DEBUG) {
        return;
    }
    if (getDistance(playerPosition[0], playerPosition[1], bulletCoordinates) < bulletRadius + playerRadius) {
        alert("player 1 dead");
        bullet = false;
        player1Position = [canvas.width + playerRadius, canvas.height + playerRadius];
        location.reload()
    } else if (getDistance(player2Position[0], player2Position[1], bulletCoordinates) < bulletRadius + playerRadius) {
        alert("player 2 dead");
        player2Position = [canvas.width + playerRadius, canvas.height + playerRadius];
        bullet = false;
        location.reload()
    }
}