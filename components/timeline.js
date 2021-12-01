var checkboxes = [1, 1, 1];  // Checkboxes are checked by default
var timeFilter = [-5000, 2021];
var layer0 = undefined;
var layer1 = undefined;

function timelineAnchorClick() {
    $('.timelineBody').toggle();
}

function cancelAnchorClick(e) {
    // Makes sure the anchor does not toggle when clicking the tick-boxes
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
}

function volcanoToggle() {
    checkboxes[0] = (checkboxes[0] + 1) % 2; // Invert checkbox state
    filterEvents(checkboxes, timeRange);
    updateMap();
    updateTimeline();
}

function tsunamiToggle() {
    checkboxes[1] = (checkboxes[1] + 1) % 2; // Invert checkbox state
    filterEvents(checkboxes, timeRange);
    updateMap();
    updateTimeline();
}

function earthquakeToggle() {
    checkboxes[2] = (checkboxes[2] + 1) % 2; // Invert checkbox state
    filterEvents(checkboxes, timeRange);
    updateMap();
    updateTimeline();
}


async function createTimeline() {
    // Data variables are available in main.js

    // Get a reference to the canvas object
	var canvas = document.getElementById('timelineCanvas');
	// Create an empty project and a view for the canvas:
	paper.setup(canvas);

    with (paper) {
        var tool = new Tool();

        // Create the line bar and cursors
        var lineBar = new Path.Rectangle(new Point(50, 65), new Size(600, 3));

        var leftCursor = new Path.Rectangle(new Point(30, 55), new Size(20, 25));
        leftCursor.data.clicked = false;
        leftCursor.data.year = timeFilter[0];

        var rightCursor = new Path.Rectangle(new Point(650, 55), new Size(20, 25));
        rightCursor.data.clicked = false;
        rightCursor.data.year = timeFilter[1];

        // Create the cursor drag functions
        tool.onMouseDown = function(e) {
            if (leftCursor.contains(e.point)) {
                leftCursor.data.clicked = true;
            }
            else if (rightCursor.contains(e.point)) {
                rightCursor.data.clicked = true;
            }
        }

        tool.onMouseUp = function(e) {
            leftCursor.data.clicked = false;
            rightCursor.data.clicked = false;
            timeFilter = [leftCursor.data.year, rightCursor.data.year];
            filterEvents(checkboxes, timeFilter);
            updateMap();
            updateTimeline();
        }

        tool.onMouseDrag = function(e) {
            if (leftCursor.data.clicked) {
                leftCursor.position = new Point(Math.max(Math.min((e.point.x-5), rightCursor.position.x-20), 40), 67.5);
                leftCursor.data.year = getCursorYear(leftCursor.position.x, "left");
            }
            if (rightCursor.data.clicked) {
                rightCursor.position = new Point(Math.max(Math.min((e.point.x-5), 660), leftCursor.position.x+20), 67.5);
                rightCursor.data.year = getCursorYear(rightCursor.position.x, "right");
            }
        }

        layer0 = new Layer([]);
        layer0.addChildren([
            new Layer([]),  // Volcano layer
            new Layer([]),  // Tsunami layer
            new Layer([])   // Earthquake layer
        ]);
        layer1 = new Layer({
            children: [lineBar, leftCursor, rightCursor],
            fillColor: 'black',
            strokeColor: new Color(196/255, 252/255, 251/255),
            strokeWidth: 4
        });

        project.layers = [layer0, layer1];
        project.layers.shift();

    	// Draw the view now:
    	view.draw();
    }
}

function drawEvents() {
    with (paper) {
        // Volcano events
        project.layers[0].children[0].children = [];
        project.layers[0].children[0].activate();  // Activates volcano layer
        for (var volcano of allEventsDict["VolcanoEvents"]) {
            var xFromYear = (volcano.year+5000)/7021*600;
            var height = parseFloat(volcano.measure_value)/10*50;
            var volcanoRect = new Path.Rectangle(new Point(50+xFromYear, 65-height), new Size(2, height));
            if (timeFilter[0] <= volcano.year && volcano.year <= timeFilter[1]) {
                volcanoRect.fillColor = new Color(200/255, 0, 0, 1);
            }
            else {
                volcanoRect.fillColor = new Color(200/255, 0, 0, 0.25);
            }
        }

        // Tsunami events
        project.layers[0].children[1].children = [];
        project.layers[0].children[1].activate();  // Activates volcano layer
        for (var tsunami of allEventsDict["TsunamiEvents"]) {
            var xFromYear = (tsunami.year+5000)/7021*600;
            var height = parseFloat(tsunami.measure_value)/10*50;
            var tsunamiRect = new Path.Rectangle(new Point(50+xFromYear, 65-height), new Size(2, height));
            tsunamiRect.fillColor = new Color(0, 0, 200/255);
            if (timeFilter[0] <= tsunami.year && tsunami.year <= timeFilter[1]) {
                tsunamiRect.fillColor = new Color(0, 0, 200/255, 1);
            }
            else {
                tsunamiRect.fillColor = new Color(0, 0, 200/255, 0.25);
            }
        }

        // Earthquake events
        project.layers[0].children[2].children = [];
        project.layers[0].children[2].activate();  // Activates volcano layer
        for (var earthquake of allEventsDict["EarthquakeEvents"]) {
            var xFromYear = (earthquake.year+5000)/7021*600;
            var height = parseFloat(earthquake.measure_value)/10*50;
            var earthquakeRect = new Path.Rectangle(new Point(50+xFromYear, 65-height), new Size(2, height));
            earthquakeRect.fillColor = new Color(0, 200/255, 0);
            if (timeFilter[0] <= earthquake.year && earthquake.year <= timeFilter[1]) {
                earthquakeRect.fillColor = new Color(0, 200/255, 0, 1);
            }
            else {
                earthquakeRect.fillColor = new Color(0, 200/255, 0, 0.25);
            }
        }

        // Draw the view now:
    	view.update();
    }
}

function updateTimeline() {
    console.log(filteredEventsDict);
    drawEvents();
}

function getCursorYear(cursorPos, cursorSide, cursorWidth=20, barLineOffset=50, barLineLength=600, timeRange=[-5000, 2021]) {
    console.assert(cursorSide == "left" || cursorSide == "right", "Invalid cursorSide");
    var year;

    if (cursorSide == "left") {
        var x = cursorPos-barLineOffset+cursorWidth/2;
        year = x / barLineLength * (Math.abs(timeRange[0]) + Math.abs(timeRange[1])) - Math.abs(timeRange[0]);
    }
    if (cursorSide == "right") {
        var x = cursorPos-barLineOffset-cursorWidth/2;
        year = x / barLineLength * (Math.abs(timeRange[0]) + Math.abs(timeRange[1])) - Math.abs(timeRange[0]);
    }

    return Math.ceil(year);
}
