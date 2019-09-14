DEBUG = false; //edit this to change gamemode

//all settings until the if are editable
//maze settings
mazeSize = 100;
mazeComplexity = 1;
mazeDensity = 0;
mazeDensity = 0.3 //everything speed multiplier
removeStragglers = true;

//game settings
interval = 10
turns = 2;

//brick options
brickColour = "lightblue";
shiftDownModifier = 1.5;

//players options
playerColor = "#0095DD";
player2Color = "red";
maxCount = 3; //number of moves
moveMultiplier = 20; //size of the circle that the player moves in
iFrames = 15;

//bullet options
bulletColor = "#0095DD"
bullet2Color = "red"
maxBounceCount = 5;
speedMultiplier = 1
bouncesToDie = 1;

//line options
lineColour = "white"
disableLineBounce = true;

if (!DEBUG) {
    //maze settings
    mazeSize = 100;
    mazeComplexity = 1;
    mazeDensity = 0;
    mazeDensity = 0.3 //everything speed multiplier
    removeStragglers = true;

    //game settings
    interval = 10
    turns = 0;

    //brick options
    brickColour = "lightblue";
    shiftDownModifier = 1.5;

    //players options
    playerColor = "#0095DD";
    player2Color = "red";
    maxCount = 3; //number of moves
    moveMultiplier = 20; //size of the circle that the player moves in
    iFrames = 15;

    //bullet options
    bulletColor = "#0095DD"
    bullet2Color = "red"
    maxBounceCount = 5;
    speedMultiplier = 1
    bouncesToDie = 1;

    //line options
    lineColour = "white"
    disableLineBounce = true;
}

//these don't get touched >:(
angle = 666; //current bullet angle
lineAngle = angle; //current line angle
bullet = false; //is there a bullet on screen
bounceCount = 0; //number of bounces a bullet has when it is shot
count = 0; //number of movements
lStopped = true; //is the line !active
lastCollision = [-666, -666]; //last point you collided with
frames = 0; //frames since start of game
tolerance = 0.00000001; //TOLERANCE for collisions
allCollisions = [];