function game(canvas, ctx, walls) {

    //wallSize = canvas.width / mazeSize;

    //game settings
    interval = 10
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    oldTurn = 666;
    maxBounceCount = 4;
    lastFrame = 10;
    alreadyHit = false;

    //brick options
    brickSize = canvas.width / mazeSize * 2;
    brickColour = "lightblue";
    walls.forEach(wall => {
        wall[0] *= Math.round(brickSize / 2);
        wall[1] *= Math.round(brickSize / 2);

        wall[0] -= Math.round(brickSize / 2);
        wall[1] -= 1.5 * Math.round(brickSize / 2);

    });

    //players options
    playerRadius = brickSize;
    playerColor = "#0095DD";
    player2Color = "#0095DD";
    playerPosition = [canvas.width / 2, canvas.height - brickSize * 2]
    currentPlayerX = playerPosition[0];
    currentPlayerY = playerPosition[1];

    //players options
    player2Radius = brickSize;
    player2Color = "red";
    player2Position = [canvas.width / 2, brickSize * 2]

    //bullet options
    bulletRadius = brickSize / 4
    bulletColor = "#0095DD"
    bullet2Color = "red"
    speed = brickSize / 10 + mazeSize / 300;
    bulletCoordinates = [playerPosition[0], playerPosition[1]]
    angle = 666;
    bullet = false;
    bounceCount = 0;
    lastBounce = -666;

    //line options
    lineSpeed = speed;
    lineAngle = angle;
    lineColour = "white"
    disableLineBounce = true;

    //draws the bullet at its coordinates
    function drawBullet() {
        ctx.beginPath();
        ctx.arc(bulletCoordinates[0], bulletCoordinates[1], bulletRadius, 0, Math.PI * 2)
        //set to bullet colour for it to have an effect
        if (turn) {
            ctx.fillStyle = bullet2Color;
        } else {
            ctx.fillStyle = bulletColor;
        }

        ctx.fill();
        ctx.closePath();
    }

    //draws a line that shows the path of the bullet (currently, the line does not bounce)
    function drawLine() {
        //this can be changed to remove speed iteration, and just iterate through all blocks and find the closest intersection
        for (i = 0; i < mazeSize * 10; i++) {
            lineX = prevX + (Math.cos(lineAngle) * lineSpeed)
            lineY = prevY + (Math.sin(lineAngle) * lineSpeed)
            prevX = lineX;
            prevY = lineY;
            if (lineCollisions(lineX, lineY)) {
                if (disableLineBounce) {
                    //check all possible intersections of this line with all lines comprising of all blocks and choose the closest one
                        //get the equation of the line
                        //find the next intersection of that line with a block
                        //draw a line from there to the block
                        //get the equation of the new line, repeat until it has bounced the same number of time as the ball can
                    break;
                }
            }
        }
        ctx.beginPath();
        ctx.moveTo(currentPlayerX, currentPlayerY);
        ctx.lineTo(lineX, lineY);
        ctx.strokeStyle = lineColour;
        ctx.stroke();
        ctx.closePath();
    }

    //draws the players, and the surrounding lines that show where they can move
    function drawBall() {
        ctx.beginPath();
        ctx.arc(playerPosition[0], playerPosition[1], playerRadius, 0, Math.PI * 2)
        ctx.fillStyle = playerColor;
        ctx.fill();
        ctx.closePath();

        if (turn && !bullet && count < maxCount) {
            ctx.beginPath();
            ctx.arc(playerPosition[0], playerPosition[1], speed * moveMultiplier, 0, Math.PI * 2)
            ctx.lineWidth = brickSize / 5;
            ctx.strokeStyle = "green";
            ctx.stroke();
            ctx.closePath();
            if (count + 1 < maxCount) {
                ctx.beginPath();
                ctx.arc(playerPosition[0], playerPosition[1], speed * 2 * moveMultiplier, 0, Math.PI * 2)
                ctx.lineWidth = brickSize / 5;
                ctx.strokeStyle = "yellow";
                ctx.stroke();
                ctx.closePath();
            }
            if (count + 2 < maxCount) {
                ctx.beginPath();
                ctx.arc(playerPosition[0], playerPosition[1], speed * 3 * moveMultiplier, 0, Math.PI * 2)
                ctx.lineWidth = brickSize / 5;
                ctx.strokeStyle = "red";
                ctx.stroke();
                ctx.closePath();
            }
        } else if (!bullet && count < maxCount) {
            ctx.beginPath();
            ctx.arc(player2Position[0], player2Position[1], speed * moveMultiplier, 0, Math.PI * 2)
            ctx.lineWidth = brickSize / 5;
            ctx.strokeStyle = "green";
            ctx.stroke();
            ctx.beginPath();
            if (count + 1 < maxCount) {
                ctx.beginPath();
                ctx.arc(player2Position[0], player2Position[1], speed * 2 * moveMultiplier, 0, Math.PI * 2)
                ctx.lineWidth = brickSize / 5;
                ctx.strokeStyle = "yellow";
                ctx.stroke();
                ctx.closePath();
            }
            if (count + 2 < maxCount) {
                ctx.beginPath();
                ctx.arc(player2Position[0], player2Position[1], speed * 3 * moveMultiplier, 0, Math.PI * 2)
                ctx.lineWidth = brickSize / 5;
                ctx.strokeStyle = "red";
                ctx.stroke();
                ctx.closePath();
            }
        }

        ctx.beginPath();
        ctx.arc(player2Position[0], player2Position[1], playerRadius, 0, Math.PI * 2)
        ctx.fillStyle = player2Color;
        ctx.fill();
        ctx.closePath();
    }

    //draws all the bricks on screen
    function drawBricks() {
        for (var i = 0; i < walls.length; i++) {
            brickX = walls[i][0];
            brickY = walls[i][1];

            ctx.beginPath();
            ctx.rect(brickX, brickY, brickSize, brickSize);
            ctx.fillStyle = brickColour;
            ctx.fill();
            ctx.closePath();


        }
    }

    //checks if the bullet is colliding with any objects
    function collision() {
        collisionX = bulletCoordinates[0] + dx;
        collisionY = bulletCoordinates[1] + dy;

        if (collisionY <= 0 || collisionY >= canvasHeight || collisionX <= 0 || collisionX >= canvasWidth) {
            if (collisionY <= 0 || collisionY > canvasHeight) {
                horizontalCollision();
                return true

            } else {
                verticalCollision();
                return true
            }
        }

        if (getDistance(collisionX - dx, collisionY - dy, playerPosition) < playerRadius + bulletRadius && !alreadyHit && bounceCount > 0) {
            alreadyHit = true;
            alert("player 1 killed");
            location.reload();
            return true
        } else if (getDistance(collisionX - dx, collisionY - dy, player2Position) < playerRadius + bulletRadius && !alreadyHit && bounceCount > 0) {
            alreadyHit = true;
            alert("player 2 killed");
            location.reload();
            return true
        }

        return bulletCollisions(collisionX, collisionY);
    }

    //returns true if the bullet is colliding with a block, and a bullet cannot bounce off the same block twice
    function bulletCollisions(collX, collY) {
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
    function lineCollisions(collX, collY) {
        for (pos = 0; pos < walls.length; pos++) {
            result = brickCollision(collX, collY, walls[pos]);
            if (result) {
                return true
            }

        }
        return false;
    }

    //returns true if the x and y coordinates are contained within the block
    function brickCollision(bulletX, bulletY, brick) {
        modifier = 0; //how far out the block collision extends
        checkX = (bulletX >= brick[0] - modifier && bulletX <= brick[0] + brickSize + modifier);
        checkY = (bulletY >= brick[1] - modifier && bulletY <= brick[1] + brickSize + modifier)
        return (checkX && checkY);
    }

    //this is the main function of the game, draws and clears and calls other functions every frame
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawBricks();
        if (bullet) {

            dx = Math.cos(angle) * speed;
            dy = Math.sin(angle) * speed;

            prevAngle = angle;

            if (collision()) {
                bulletCoordinates = getBlockBulletIntersection(bulletCoordinates[0], bulletCoordinates[1], dx, dy, lastBounce);
            } else {
                bulletCoordinates[0] += dx;
                bulletCoordinates[1] += dy;
            }

            drawBullet();

        }
        if (turns > 0 && !lStopped && !bullet) {
            prevX = currentPlayerX;
            prevY = currentPlayerY;
            drawLine();
        }

    }

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
        getBounce(indexClosest);
        return closest
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

    //gets a point on a line when you know the Y value
    function solveForX(knownY, m, b) {
        return (knownY - b) / m;
    }

    //gets the point on a line when you know the X value
    function solveForY(m, knownX, b) {
        return m * knownX + b
    }

    //gets the distance between 2 points
    function getDistance(distX, distY, coordinate) {
        return Math.sqrt(Math.pow(Math.abs(distX - coordinate[0]), 2) + Math.pow(Math.abs(distY - coordinate[1]), 2));
    }

    //sets the angle and bounce information corresponding which side is bounced off of 
    function getBounce(sideNumber) {
        //*****0
        //**1|---|
        //***|---|3
        //*****2
        if (sideNumber % 2 == 0) {
            horizontalCollision()
        } else {
            verticalCollision();
        }

        //bouncing of a horizontal side (side 1 or 3)
        function horizontalCollision() {
            bounce();
            angle = -angle;

        }

        //bouncing off of a vertical side (side 0 or 2)
        function verticalCollision() {
            bounce();
            angle = Math.PI - angle;

        }

        //updates proper variables on bounce
        function bounce() {
            lastBounce = [-10,-10]
            bounceCount++;
            if (bounceCount > maxBounceCount) {
                bullet = false;
                bulletCoordinates[0] = currentPlayerX,
                    bulletCoordinates[1] = currentPlayerY;
                bounceCount = 0;
            }

        }
    }

    setInterval(draw, interval)
}