function game(canvas, ctx, walls) {

    wallSize = canvas.width / 100;

    //game settings
    interval = 10
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    //brick options
    brickSize = wallSize * 2;
    walls.forEach(wall => {
        wall[0] *= Math.round(wallSize);
        wall[1] *= Math.round(wallSize);

        wall[0] -= Math.round(brickSize/2);
        wall[1] -= Math.round(brickSize/2);

    });

    //players options
    playerRadius = brickSize;
    playerColor = "#0095DD";
    player2Color = "#0095DD";
    playerPosition = [canvas.width / 2, canvas.height - brickSize * 2]

    //bullet options
    bulletRadius = brickSize / 4;
    maxBounceCount = 20;
    bulletColor = "#0095DD"
    speed = brickSize / 10;
    x = playerPosition[0]
    y = playerPosition[1]
    angle = 666;
    bullet = false;
    bounceCount = 0;
    lastBounce = -666;

    function drawBullet() {
        ctx.beginPath();
        ctx.arc(x, y, bulletRadius, 0, Math.PI * 2)
        ctx.fillStyle = bulletColor;
        ctx.fill();
        ctx.closePath();
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(playerPosition[0], playerPosition[1], playerRadius, 0, Math.PI * 2)
        ctx.fillStyle = playerColor;
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (var i = 0; i < walls.length; i++) {
            brickX = walls[i][0];
            brickY = walls[i][1];

            ctx.beginPath();
            ctx.rect(brickX, brickY, brickSize, brickSize);
            ctx.fillStyle = "#8814";
            ctx.fill();
            ctx.closePath();

        }
    }
    //make it so it can't bounce off the same block 2 times in a row
    function collision() {
        if (y <= 0 || y >= canvasHeight || x <= 0 || x >= canvasWidth) {
            if (y <= 0 || y > canvasHeight) {
                horizontalCollision();
                return

            } else {
                verticalCollision();
                return
            }
        }
        for (pos = 0; pos < walls.length; pos++) {
            result = checkColl(x, y, walls[pos]);
            if (result > 0) {
                //debugger;
                currentBounce = [walls[pos][0], walls[pos][1]];
                if (lastBounce[0] == currentBounce[0] && lastBounce[1] == currentBounce[1]) {
                    return;
                }
                if (result % 2 == 0) {
                    verticalCollision();
                    lastBounce = [walls[pos][0], walls[pos][1]];
                    return
                } else {
                    horizontalCollision();
                    lastBounce = [walls[pos][0], walls[pos][1]];
                    return
                }
            }
        }
    }

    function checkColl(x, y, brick) {
        //console.log(brick[0])
        //modifer makes it so it bounces when the outside of the ball hits
        modifier = bulletRadius;
        if (!((x >= brick[0] - modifier && x <= brick[0] + brickSize + modifier) && (y >= brick[1] - modifier && y <= brick[1] + brickSize + modifier))) {
            return 0;
        }

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
            cmp = getDistance(x, y, sides[i])
            if (cmp < distance) {
                distance = cmp;
                closest = i;
            }
        }
        closest++
        //console.log(closest)
        return closest;
    }

    function getDistance(x, y, side) {
        return Math.sqrt(Math.pow(Math.abs(x - side[0]), 2) + Math.pow(Math.abs(y - side[1]), 2));
    }


    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (bullet) {
            collision();
        }
        drawBall();
        drawBricks();
        if (bullet) {
            drawBullet();
            x += Math.cos(angle) * speed;
            y += Math.sin(angle) * speed;
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
            x = playerPosition[0],
                y = playerPosition[1];
            bounceCount = 0;
        }

    }

    setInterval(draw, interval)
}