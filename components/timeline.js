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
    console.log("Timeline ready!");
    console.log(allEventsList);
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
