//generates a maze chart based on some variables, need a reference to maze.js to use this
function updateChart(width, height, complexity, density) {

    markerShape = String($('#choice').val());

    if (density > 1 || complexity > 1) {
        alert("please set density and complexity to less than 1");
        return false;
    }

    if (width * height > 100 * 200) {
        alert("Please set product of width and height to less than 20000");
        return false;
    }

    maze = makeMaze(width, height, complexity, density);
    points = mazePoints(maze);
    scaleHeight = height * 1 + 1;
    var myConfig1 = {
        type: "scatter",
        'scale-x': {
            values: "0:" + width + ":1",
        },
        'scale-y': {
            values: "0:" + scaleHeight + ":1",
        },
        plot: {
            marker: {
                size: 8.4,
                type: markerShape,
                borderColor: "blue",
                backgroundColor: "blue",
            },
        },
        series: [{
            values: points
        }]
    };

    zingchart.render({
        id: 'myChart',
        data: myConfig1,
        height: "900px",
        width: "900px"
    });
}