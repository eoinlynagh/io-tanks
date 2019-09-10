function game(canvas, ctx, walls) {

    wallSize = canvas.width / mazeSize;

    //game settings
    interval = 10
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    oldTurn = 666;
    maxBounceCount = 2;
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
    x = playerPosition[0]
    y = playerPosition[1]
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
        ctx.arc(x, y, bulletRadius, 0, Math.PI * 2)
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
        // for (i = 0; i < mazeSize*10; i++) {
        //     lineX = prevX + (Math.cos(lineAngle) * lineSpeed)
        //     lineY = prevY + (Math.sin(lineAngle) * lineSpeed)
        //     prevX = lineX;
        //     prevY = lineY;
        //     if (bulletCollisions(lineX, lineY, false)) {
        //         if (disableLineBounce) {
        //             break;
        //         }
        //     }
        // }
        // ctx.beginPath();
        // ctx.moveTo(currentPlayerX, currentPlayerY);
        // ctx.lineTo(lineX, lineY);
        // ctx.stroke();
        // ctx.closePath();
        return false;



    }

    function drawBall() {
        moveMultipler = 75;
        ctx.beginPath();
        ctx.arc(playerPosition[0], playerPosition[1], playerRadius, 0, Math.PI * 2)
        ctx.fillStyle = playerColor;
        ctx.fill();
        ctx.closePath();

        if (turn && !bullet && count < maxCount) {
            ctx.beginPath();
            ctx.arc(playerPosition[0], playerPosition[1], speed * moveMultipler, 0, Math.PI * 2)
            ctx.lineWidth = brickSize / 5;
            ctx.strokeStyle = "green";
            ctx.stroke();
            ctx.closePath();
            if (count + 1 < maxCount) {
                ctx.beginPath();
                ctx.arc(playerPosition[0], playerPosition[1], speed * 2 * moveMultipler, 0, Math.PI * 2)
                ctx.lineWidth = brickSize / 5;
                ctx.strokeStyle = "yellow";
                ctx.stroke();
                ctx.closePath();
            }
            if (count + 2 < maxCount) {
                ctx.beginPath();
                ctx.arc(playerPosition[0], playerPosition[1], speed * 3 * moveMultipler, 0, Math.PI * 2)
                ctx.lineWidth = brickSize / 5;
                ctx.strokeStyle = "red";
                ctx.stroke();
                ctx.closePath();
            }
        } else if (!bullet && count < maxCount) {
            ctx.beginPath();
            ctx.arc(player2Position[0], player2Position[1], speed * moveMultipler, 0, Math.PI * 2)
            ctx.lineWidth = brickSize / 5;
            ctx.strokeStyle = "green";
            ctx.stroke();
            ctx.beginPath();
            if (count + 1 < maxCount) {
                ctx.beginPath();
                ctx.arc(player2Position[0], player2Position[1], speed * 2 * moveMultipler, 0, Math.PI * 2)
                ctx.lineWidth = brickSize / 5;
                ctx.strokeStyle = "yellow";
                ctx.stroke();
                ctx.closePath();
            }
            if (count + 2 < maxCount) {
                ctx.beginPath();
                ctx.arc(player2Position[0], player2Position[1], speed * 3 * moveMultipler, 0, Math.PI * 2)
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
            ctx.strokeStyle = "lightblue";
            ctx.stroke();
            ctx.closePath();


        }
    }
    //make it so it can't bounce off the same block 2 times in a row
    function collision() {
        collisionX = x + 0;
        collisionY = y + 0;
        if (collisionY <= 0 || collisionY >= canvasHeight || collisionX <= 0 || collisionX >= canvasWidth) {
            if (collisionY <= 0 || collisionY > canvasHeight) {
                horizontalCollision();
                return

            } else {
                verticalCollision();
                return
            }
        }
        // if (turn && bullet && (x >= playerPosition[0] - playerRadius && x <= playerPosition[0] + playerRadius) && (y >= playerPosition[1] - playerRadius && y <= playerPosition[1] + playerRadius)) {
        //     speed = -speed * 2;
        //     alert("player 1 loses");
        //     location.reload(true);
        // }
        // if (!turn && bullet && (x >= player2Position[0] - playerRadius && x <= player2Position[0] + playerRadius) && (y >= player2Position[1] - playerRadius && y <= player2Position[1] + playerRadius)) {
        //     speed = -speed * 2;
        //     alert("player 2 loses");
        //     location.reload(true);
        // }
        return bulletCollisions(collisionX, collisionY, true);
    }

    function bulletCollisions(collX, collY, noteCollision) {
        for (pos = 0; pos < walls.length; pos++) {
            result = checkColl(collX, collY, walls[pos]);
            if (result > 0) {
                if (noteCollision) {
                    currentBounce = [walls[pos][0], walls[pos][1]]
                };
                if (noteCollision && lastBounce[0] == currentBounce[0] && lastBounce[1] == currentBounce[1]) {
                    return false;
                }
                if (result % 2 == 0) {
                    verticalCollision(noteCollision);
                    if (noteCollision) {
                        lastBounce = [walls[pos][0], walls[pos][1]];
                        return true
                    }
                    return true
                } else {
                    horizontalCollision(noteCollision);
                    if (noteCollision) {
                        lastBounce = [walls[pos][0], walls[pos][1]];
                        return true
                    }
                    return true
                }
            }
        }
        return false;
    }

    function checkColl(bulletX, bulletY, brick) {


        //bc ball teleports it can move past the wall so we should change collision to check the next move, instead of the current one
        modifier = bulletRadius;
        if (!((bulletX > brick[0] - modifier && bulletX < brick[0] + brickSize + modifier) && (bulletY > brick[1] - modifier && bulletY < brick[1] + brickSize + modifier))) {
            return 0;
        }

        //console.log('collision')
        //what if we move these
        side1 = [brick[0] + brickSize / 2, brick[1]];
        side2 = [brick[0], brick[1] + brickSize / 2];
        side3 = [brick[0] + brickSize / 2, brick[1] + brickSize];
        side4 = [brick[0] + brickSize, brick[1] + brickSize / 2];
        //debugger;
        //console.log(side1, side2, side3, side4);

        sides = [side1, side2, side3, side4];
        distance = 2000000000000;
        closest = 5;

        /*
        _1_
        |   |  4
        2  |___|
        3
        */
        //bounces off the closest side
        for (i = 0; i < sides.length; i++) {
            cmp = getDistance(bulletX, bulletY, sides[i])
            if (cmp < distance) {
                distance = cmp;
                closest = i;
            }

        }
        closest++
        return closest;
    }

    function getDistance(distX, distY, side) {
        return Math.sqrt(Math.pow(Math.abs(distX - side[0]), 2) + Math.pow(Math.abs(distY - side[1]), 2));
    }


    function draw() {
        frames++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawBricks();
        if (bullet) {
            //if these intersect with any boxes then they should be reduced
            collision();
            drawBullet();

            dx = Math.cos(angle) * speed;
            dy = Math.sin(angle) * speed;
            x += dx;
            y += dy;

        }
        if (turns > 0 && !lStopped && !bullet) {
            prevX = currentPlayerX;
            prevY = currentPlayerY;
            //console.log("x: " + currentPlayerX + "y: " + currentPlayerY)
            //console.log(lineAngle)
            drawLine();
        }

    }

    function horizontalCollision(noteCollision) {
        if (noteCollision) {
            bounce();
            angle = -angle;
        }
    }

    function verticalCollision(noteCollision) {
        if (noteCollision) {
            bounce();
            angle = Math.PI - angle;
        }
    }

    function bounce() {
        console.log(bounceCount)
        bounceCount++;
        if (bounceCount > maxBounceCount) {
            bullet = false;
            x = currentPlayerX,
                y = currentPlayerY;
            bounceCount = 0;
        }

    }

    // function line(){
    //     mousePosition = getMousePos(canvas, event);
    //     lineDx = (mousePosition.x - currentPlayerX);
    //     lineDy = (mousePosition.y - currentPlayerY);
    //     lineAngle = Math.atan2(lineDx, lineDy);
    // }

    // function lineStopped(){
    //     return true;
    // }

    function updateLine() {
        lineHeadXt

    }


    setInterval(draw, interval)
}