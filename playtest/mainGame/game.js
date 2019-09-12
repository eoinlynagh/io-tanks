function game(canvas, ctx, walls) {

    wallSize = canvas.width / mazeSize;

    //game settings
    interval = 10
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    oldTurn = 666;
    maxBounceCount = 4;
    frames = 0
    lastFrame = 10;

    //brick options
    brickSize = wallSize * 2;
    brickColour = "lightgreen";
    walls.forEach(wall => {
        wall[0] *= Math.round(wallSize);
        wall[1] *= Math.round(wallSize);

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
    speed = wallSize / 5 + mazeSize / 300;
    bulletCoordinates = [playerPosition[0], playerPosition[1]]
    angle = 666;
    bullet = false;
    bounceCount = 0;
    lastBounce = -666;

    //line options
    lineBullets = []
    lineSpeed = speed;
    lineAngle = angle;
    disableLineBounce = true;


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

    function drawLine() {
        for (i = 0; i < mazeSize * 10; i++) {
            lineX = prevX + (Math.cos(lineAngle) * lineSpeed)
            lineY = prevY + (Math.sin(lineAngle) * lineSpeed)
            prevX = lineX;
            prevY = lineY;
            if (lineCollisions(lineX, lineY)) {
                if (disableLineBounce) {
                    break;
                }
            }
        }
        ctx.beginPath();
        ctx.moveTo(currentPlayerX, currentPlayerY);
        ctx.lineTo(lineX, lineY);
        ctx.stroke();
        ctx.closePath();
    }


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

    function drawBricks() {
        for (var i = 0; i < walls.length; i++) {
            brickX = walls[i][0];
            brickY = walls[i][1];

            ctx.beginPath();
            ctx.rect(brickX, brickY, brickSize, brickSize);
            ctx.fillStyle = brickColour;
            ctx.strokeStyle = "green";
            ctx.stroke();
            ctx.closePath();


        }
    }
    //make it so it can't bounce off the same block 2 times in a row
    //make it so it can't bounce off the same block 2 times in a row
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
        return bulletCollisions(collisionX, collisionY);
    }

    function bulletCollisions(collX, collY) {
        for (pos = 0; pos < walls.length; pos++) {
            result = brickSideCollision(collX, collY, walls[pos]);
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

    function lineCollisions(collX, collY) {
        for (pos = 0; pos < walls.length; pos++) {
            result = brickSideCollision(collX, collY, walls[pos]);
            if (result) {
                return true
            }

        }
        return false;
    }

    function brickSideCollision(bulletX, bulletY, brick) {

        if (notInside(bulletX, bulletY, brick)) {
            return false;
        }
        console.log('collision')
        return true;
    }

    function notInside(x, y, brick) {
        modifier = 0;
        checkX = (x > brick[0] - modifier && x < brick[0] + brickSize + modifier);
        checkY = (y > brick[1] - modifier && y < brick[1] + brickSize + modifier)
        return !(checkX && checkY);
    }


    function draw() {
        frames++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawBricks();
        if (bullet) {

            dx = Math.cos(angle) * speed;
            dy = Math.sin(angle) * speed;

            prevAngle = angle;
            if (collision()) {
                bulletCoordinates = getBlockBulletIntersection(bulletCoordinates[0], bulletCoordinates[1], dx, dy, lastBounce);

            }


            bulletCoordinates[0] += dx;
            bulletCoordinates[1] += dy;
            drawBullet();

        }
        if (turns > 0 && !lStopped && !bullet) {
            prevX = currentPlayerX;
            prevY = currentPlayerY;
            //console.log("bulletCoordinates[0]: " + currentPlayerX + "bulletCoordinates[1]: " + currentPlayerY)
            //console.log(lineAngle)
            drawLine();
        }

    }

    function getBlockBulletIntersection(startX, startY, intersectDx, intersectDy, brick) {
        endX = startX + intersectDx;
        endY = startY + intersectDy;

        m = intersectDy / intersectDx;
        b = endY - (m * endX)

        brickLeftX = brick[0];
        brickTopY = brick[1];
        brickRightX = brick[0] + brickSize;
        brickBottomY = brick[1] + brickSize;

        collisionIntersect1 = [solveForX(brickTopY, m, b), brickTopY];
        collisionIntersect2 = [brickLeftX, solveForY(m, brickLeftX, b)];
        collisionIntersect3 = [solveForX(brickBottomY, m, b), brickBottomY];
        collisionIntersect4 = [brickRightX, solveForY(m, brickRightX, b)];

        potentialColl = [collisionIntersect1, collisionIntersect2, collisionIntersect3, collisionIntersect4];

        minDistance = 90000000;
        for (i = 0; i < potentialColl.length; i++) {
            cmp = getDistance(startX, startY, potentialColl[i]);
            if (cmp < minDistance) {
                minDistance = cmp;
                closest = potentialColl[i];
                indexClosest = i;
            }
        }
        getBounce(indexClosest);
        return closest
    }


    function solveForX(knownY, m, b) {
        return (knownY - b) / m;
    }

    function solveForY(m, knownX, b) {
        return m * knownX + b
    }

    function getDistance(distX, distY, side) {
        return Math.sqrt(Math.pow(Math.abs(distX - side[0]), 2) + Math.pow(Math.abs(distY - side[1]), 2));
    }

    function getBounce(i) {
        if (i % 2 == 0) {
            horizontalCollision()
        } else {
            verticalCollision();
        }
    }

    function horizontalCollision() {
        bounce();
        angle = -angle;

    }

    function verticalCollision() {
        bounce();
        angle = Math.PI - angle;

    }

    function bounce() {
        console.log("bounceCount: " + bounceCount)
        bounceCount++;
        if (bounceCount > maxBounceCount) {
            bullet = false;
            bulletCoordinates[0] = currentPlayerX,
                bulletCoordinates[1] = currentPlayerY;
            bounceCount = 0;
        }

    }



    setInterval(draw, interval)
}