//gets a point on a line when you know the Y value
function solveForX(knownY, m, b, upper, lower) {
    var x = (knownY - b) / m;
    if(lower <= x && x <= upper){return x;}
    return -6666;
}

//gets the point on a line when you know the X value
function solveForY(m, knownX, b, upper, lower) {
    var y = m * knownX + b
    if(lower <= y && y <= upper){return y;}
    return -6666;
}

//gets the distance between 2 points
function getDistance(distX, distY, coordinate) {
    return Math.sqrt(Math.pow(Math.abs(distX - coordinate[0]), 2) + Math.pow(Math.abs(distY - coordinate[1]), 2));
}
//gets the length of the diagonal between 2 sides of length a & b
function getHypotenuse(a, b) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}