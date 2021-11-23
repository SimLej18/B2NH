checkboxes = [1, 1, 1];  // Checkboxes are checked by default
timeRange = [-5000, 2021];

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
}

function tsunamiToggle() {
    checkboxes[1] = (checkboxes[1] + 1) % 2; // Invert checkbox state
    filterEvents(checkboxes, timeRange);
    updateMap();
}

function earthquakeToggle() {
    checkboxes[2] = (checkboxes[2] + 1) % 2; // Invert checkbox state
    filterEvents(checkboxes, timeRange);
    updateMap();
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
        var lineBar = new Path.Rectangle(new Point(50, 65), new Size(600, 5));
        lineBar.fillColor = "black";

        var leftCursor = new Path.Rectangle(new Point(50, 55), new Size(20, 25));
        leftCursor.data.clicked = false;
        leftCursor.fillColor = "black";

        var rightCursor = new Path.Rectangle(new Point(630, 55), new Size(20, 25));
        rightCursor.data.clicked = false;
        rightCursor.fillColor = "black";

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
        }

        tool.onMouseDrag = function(e) {
            if (leftCursor.data.clicked) {
                leftCursor.position = new Point(Math.max(Math.min((e.point.x-5), rightCursor.position.x-20), 60), 67.5);
            }
            if (rightCursor.data.clicked) {
                rightCursor.position = new Point(Math.max(Math.min((e.point.x-5), 640), leftCursor.position.x+20), 67.5);
            }
        }

    	// Draw the view now:
    	view.draw();
    }
}

function updateTimeline() {

}

/* LEGACY CODE

// Idea for a range slider https://rasmusfonseca.github.io/d3RangeSlider/

// Dummy example with d3.js
data = [    {
    "type": "Irruption",
    "value": "5"
}, {
    "type": "Tsunamis",
    "value": "2"
}, {
    "type": "Earthquakes",
    "value": "4"
}];

d3.select("#timeline").selectAll("div")
    .data(data)
    .enter()
    .append("div")
    .attr("class", "event")
    .style("width", function(d) {
        return d.value * 10 + "px";
    }
    )
    .style("height", function(d) {
        return 15 + "px";
    }
    )
    .style("background-color", function(d) {
        return "rgb(100,0," + d.value * 10 + ")";
    }
    )
    .style("color", function(d) {
        return "rgb(0,0," + d.value * 10 + ")";
    }
    )
    .text(function(d) {
        return d.type;
    }
    );
*/
