var checkboxes = [1, 1, 1];  // Checkboxes are checked by default
var timeFilter = [-5000, 2021];
var inputValues = [-5000, 2021];
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
    filterEvents(checkboxes, timeFilter);
    updateMap();
    updateTimeline();
}

function tsunamiToggle() {
    checkboxes[1] = (checkboxes[1] + 1) % 2; // Invert checkbox state
    filterEvents(checkboxes, timeFilter);
    updateMap();
    updateTimeline();
}

function earthquakeToggle() {
    checkboxes[2] = (checkboxes[2] + 1) % 2; // Invert checkbox state
    filterEvents(checkboxes, timeFilter);
    updateMap();
    updateTimeline();
}

function treatNewLeftInput() {
    try {
        var firstYear = parseInt($('#leftYearInput').val());
        var lastYear = parseInt($('#rightYearInput').val());
        console.assert(lastYear == inputValues[1]);
        firstYear = Number.isNaN(firstYear) ? inputValues[0] : firstYear;
        firstYear = Math.max(-5000, firstYear);
        firstYear = Math.min(firstYear, lastYear);
        $('#leftYearInput').val(firstYear);
        inputValues[0] = firstYear;
        timeFilter = [...inputValues];
        updateCursorPos(timeFilter);
        filterEvents(checkboxes, timeFilter);
        updateMap();
        updateTimeline();
    }
    catch (error) {
        console.log(error);
    }
}

function treatNewRightInput() {
    try {
        var firstYear = parseInt($('#leftYearInput').val());
        var lastYear = parseInt($('#rightYearInput').val());
        console.assert(firstYear == inputValues[0]);
        lastYear = Number.isNaN(lastYear) ? inputValues[1] : lastYear;
        lastYear = Math.min(lastYear, 2021);
        lastYear = Math.max(firstYear, lastYear);
        $('#rightYearInput').val(lastYear);
        inputValues[1] = lastYear;
        timeFilter = [...inputValues];
        updateCursorPos(timeFilter);
        filterEvents(checkboxes, timeFilter);
        updateMap();
        updateTimeline();
    }
    catch (error) {
        console.log(error);
    }
}

function updateCursorPos(years) {
    with (paper) {
        project.layers[1].children[1].position = new Point(50+getXFromYear(years[0])-10, 67.5);
        project.layers[1].children[2].position = new Point(50+getXFromYear(years[1])+10, 67.5);
        view.update();
    }
}

async function createTimeline() {
    // Data variables are available in main.js

    // Setup events handler for inputs
    $("#leftYearInput").keypress(event => {
        if(event.which != 13) return;
        $("#leftYearInput").blur()
        event.preventDefault();
    })
    $("#rightYearInput").keypress(event => {
        if(event.which != 13) return;
        $("#rightYearInput").blur();
        event.preventDefault();
    })

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
            else {
                checkEventClick(e);
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
                $('#leftYearInput').val(leftCursor.data.year);
                inputValues[0] = leftCursor.data.year;
            }
            if (rightCursor.data.clicked) {
                rightCursor.position = new Point(Math.max(Math.min((e.point.x-5), 660), leftCursor.position.x+20), 67.5);
                rightCursor.data.year = getCursorYear(rightCursor.position.x, "right");
                $('#rightYearInput').val(rightCursor.data.year);
                inputValues[1] = rightCursor.data.year;
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
        if (checkboxes[0]) {
            project.layers[0].children[0].activate();  // Activates volcano layer
            for (var volcano of allEventsDict["VolcanoEvents"]) {
                var xFromYear = getXFromYear(volcano.year);
                var height = parseFloat(volcano.measure_value)/10*50;
                var volcanoRect = new Path.Rectangle(new Point(50+xFromYear, 65-height), new Size(2, height));
                volcanoRect.metadata = volcano;
                if (timeFilter[0] <= volcano.year && volcano.year <= timeFilter[1]) {
                    volcanoRect.fillColor = new Color(200/255, 0, 0, 1);
                }
                else {
                    volcanoRect.fillColor = new Color(200/255, 0, 0, 0.25);
                }
            }
        }

        // Tsunami events
        project.layers[0].children[1].children = [];
        if (checkboxes[1]) {
            project.layers[0].children[1].activate();  // Activates volcano layer
            for (var tsunami of allEventsDict["TsunamiEvents"]) {
                var xFromYear = getXFromYear(tsunami.year);
                var height = parseFloat(tsunami.measure_value)/10*50;
                var tsunamiRect = new Path.Rectangle(new Point(50+xFromYear, 65-height), new Size(2, height));
                tsunamiRect.metadata = tsunami;
                tsunamiRect.fillColor = new Color(0, 0, 200/255);
                if (timeFilter[0] <= tsunami.year && tsunami.year <= timeFilter[1]) {
                    tsunamiRect.fillColor = new Color(0, 0, 200/255, 1);
                }
                else {
                    tsunamiRect.fillColor = new Color(0, 0, 200/255, 0.25);
                }
            }
        }

        // Earthquake events
        project.layers[0].children[2].children = [];
        if (checkboxes[2]) {
            project.layers[0].children[2].activate();  // Activates volcano layer
            for (var earthquake of allEventsDict["EarthquakeEvents"]) {
                var xFromYear = getXFromYear(earthquake.year);
                var height = parseFloat(earthquake.measure_value)/10*50;
                var earthquakeRect = new Path.Rectangle(new Point(50+xFromYear, 65-height), new Size(2, height));
                earthquakeRect.metadata = earthquake;
                earthquakeRect.fillColor = new Color(0, 200/255, 0);
                if (timeFilter[0] <= earthquake.year && earthquake.year <= timeFilter[1]) {
                    earthquakeRect.fillColor = new Color(0, 200/255, 0, 1);
                }
                else {
                    earthquakeRect.fillColor = new Color(0, 200/255, 0, 0.25);
                }
            }
        }

        // Draw the view now:
    	view.update();
    }
}

function checkEventClick(e) {
    with (paper) {
        for (eventType of project.layers[0].children) {
            for (event of eventType.children) {
                if (event.contains(e.point)) {
                    handler.clickEvent(e, event.metadata);
                }
            }
        }
    }
}

function updateTimeline() {

    // Update currentTimeFilter
    currentTimeFilter = timeFilter;

    drawEvents();
}

function getXFromYear(year) {
    return Math.pow(1.002, year+5000-3820);
}

function getCursorYear(cursorPos, cursorSide, cursorWidth=20, barLineOffset=50, barLineLength=600, timeRange=[-5000, 2021]) {
    console.assert(cursorSide == "left" || cursorSide == "right", "Invalid cursorSide");
    var year;
    var x;

    if (cursorSide == "left") {
        x = cursorPos-barLineOffset+cursorWidth/2;
    }
    if (cursorSide == "right") {
        x = cursorPos-barLineOffset-cursorWidth/2;
    }
    year = Math.min(Math.max(Math.ceil(Math.log(x)/Math.log(1.002))+3820-5000, -5000), 2021);

    return year;
}
