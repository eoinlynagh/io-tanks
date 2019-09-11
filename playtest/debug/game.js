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
        collisionX = x + dx;
        collisionY = y + dy;

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
            //****1
            //2*|----|
            //**|----|4
            //*****3
            if (result > 0) {
                currentBounce = [walls[pos][0], walls[pos][1]]
                if (lastBounce[0] == currentBounce[0] && lastBounce[1] == currentBounce[1]) {
                    return false;
                }
                if (result % 2 == 0) {
                    verticalCollision();
                    lastBounce = [walls[pos][0], walls[pos][1]];
                    return true
                } else {
                    horizontalCollision();
                    lastBounce = [walls[pos][0], walls[pos][1]];
                    return true
                }
            }
        }
        return false;
    }

    function brickSideCollision(bulletX, bulletY, brick) {

        if (checkOutside()) {
            return 0;
        }
        sides = getSides();

        distanceToSide = mazeSize;
        closest = 5;
        for (i = 0; i < sides.length; i++) {
            cmp = getDistance(bulletX, bulletY, sides[i])
            if (cmp < distanceToSide) {
                distanceToSide = cmp;
                closest = i;
            }

        }

        closest++;
        return closest;

        function checkOutside() {
            modifier = bulletRadius/2;
            return !((bulletX > brick[0] - modifier && bulletX < brick[0] + brickSize + modifier) && (bulletY > brick[1] - modifier && bulletY < brick[1] + brickSize + modifier));
        }

        function getSides() {
            side1 = [brick[0] + brickSize / 2, brick[1]];
            side2 = [brick[0], brick[1] + brickSize / 2];
            side3 = [brick[0] + brickSize / 2, brick[1] + brickSize];
            side4 = [brick[0] + brickSize, brick[1] + brickSize / 2];
            return [side1, side2, side3, side4];
        }
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
            
            dx = Math.cos(angle) * speed;
            dy = Math.sin(angle) * speed;

            prevAngle = angle;

            if(collision()){
                debugger;
                //it is going to collide on the next frame
                //need the distance between the center of the circle and the place of intersection
                //move the ball the wall
            }
            drawBullet();


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

    function horizontalCollision() {
        bounce();
        angle = -angle;

    }

    function verticalCollision() {
        bounce();
        angle = Math.PI - angle;

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


    setInterval(draw, interval)
}