
function game(points, canvas, ctx) {
    interval = 10
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    
    //player options
    playerRadius = 10;
    playerColor = "#0095DD";
    playerPosition = [canvas.width / 2, canvas.height - 30]
    
    //bullet options
    bulletRadius = 2;
    maxBounceCount = 2;
    bulletColor = "#0095DD"
    speed = 1;
    x = playerPosition[0]
    y = playerPosition[1]
    angle = 666;
    bullet = false;
    bounceCount = 0;
    
    //brick options
    brickSize = 8;
    positions = points;
    
    //hole options
    holeRadius = 10;
    holePosition = [20, 300];
    
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
        for (var i = 0; i < positions.length; i++) {
            brickX = positions[i][0];
            brickY = positions[i][1];
            
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickSize, brickSize);
            ctx.fillStyle = "#8814";
            ctx.fill();
            ctx.closePath();
            
        }
    }
    
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
        for (i = 0; i < positions.length; i++) {
            result = checkColl(x, y, positions[i]);
            if (result > 0) {
                if (result % 2 == 0) {
                    verticalCollision();
                } else {
                    horizontalCollision();
                }
            }
        }
    }
    
    function checkColl(x, y, brick) {
        //console.log(brick[0])
        
        if (!((x > brick[0] && x < brick[0] + brickSize) && (y > brick[1] && y < brick[1] + brickSize))) {
            return 0;
        }
        
        side1 = [brick[0] + brickSize / 2, brick[1]];
        side2 = [brick[0], brick[1] + brickSize / 2];
        side3 = [brick[0] + brickSize / 2, brick[1] + brickSize];
        side4 = [brick[0] + brickSize, brick[1] + brickSize / 2];
        console.log(side1, side2, side3, side4);
        
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
        console.log(closest)
        return closest;
    }
    
    function getDistance(x, y, side) {
        return Math.sqrt(Math.pow(Math.abs(x - side[0]), 2) + Math.pow(Math.abs(y - side[1]), 2));
    }
    
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        collision();
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