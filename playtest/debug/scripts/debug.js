function log(msg){
    if(!DEBUG){return;}
    console.log(msg);
}

function debug(){
    if(DEBUG){debugger;}
}

//tests are designed to work on a size 3001 x 3001 canvas
//fixed by making it choose a point in between the start and finish
function test1(){
    playerPosition = [1500.5,120.4];
    currentPlayerX = playerPosition[0];
    currentPlayerY = playerPosition[1];
    angle = -0.3079150007773666;
    bullet = true;
}
//fixed by making changed intersections to discard points that are not within the bounds of the brick
function test2() {
    if(!DEBUG){return;}
    playerPosition = [938.5, 1944];
    currentPlayerX = playerPosition[0];
    currentPlayerY = playerPosition[1];
    bulletCoordinates = [938.5, 1944];
    angle = -0.6300830109894582;
    bullet = true;
}

//fixed by removing overlapping blocks from the borders
function test3(){
    if(!DEBUG){return;}
    playerPosition = [1500.5, 2881];
    currentPlayerX = playerPosition[0];
    currentPlayerY = playerPosition[1];
    bulletCoordinates = [1500.5, 2881];
    angle = 2.9497726432159888;
    bullet = true;
}

//I think to fix this one, we have to make it so that the line checks for collision, not the position of the end point
function test4(){
    if(!DEBUG){return;}
    playerPosition = [1396, 1612.77783203125];
    currentPlayerX = playerPosition[0];
    currentPlayerY = playerPosition[1];
    bulletCoordinates = [1396, 1612.77783203125];
    angle = -0.28204776739050663;
    bullet = true;
}

//fixed by totally changing collision lol
function test5(){
    if(!DEBUG){return;}
    playerPosition = [1500.5 , 120];
    currentPlayerX = playerPosition[0];
    currentPlayerY = playerPosition[1];
    bulletCoordinates = [1500.5 , 120];
    angle = -0.15347954821282017
    bullet = true;
}