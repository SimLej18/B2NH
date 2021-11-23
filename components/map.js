// Method that will be used when we update the data
function updateMap(allEventsList) {
   // update map data
   updateMapData(allEventsList);
}

// function to create map with d3.js
function createMap() {

    console.log("Map launched!");
    console.log("Map data length: " + allEventsList.length);
    // create map with d3.js
    const width = 960;
    const height = 600;

    const map = d3.select('#map')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('class', 'map');

    // create projection
    const projection = d3.geoMercator()
        .center([0, 0])
        .scale(width / 2 / Math.PI)
        .translate([width / 2, height / 2]);

    // create path
    const path = d3.geoPath()
        .projection(projection);

    // Add a scale for bubble size
    const size = d3.scaleLinear()
    .domain([0,10])  // What's in the data
    .range([ 2, 10]);  // Size in pixel


       // Create a color scale
       var color = d3.scaleOrdinal()
       .domain(["irruption", "earthquake", "tsunami" ])
       .range([ "red", "green", "blue"])


    // create tooltip
    const tooltip = d3.select('#info-item-tooltip')
        .append('div')
        .attr('class', 'tooltip')
        .style('size', '10px')
        .style('background-color', '#fff')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('position', 'absolute')
        .style('z-index', '10');

    // insert map data
    map.selectAll('path')
                .data(world_data.features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('class', 'country')
                .attr('fill', '#cfcfcf')
                .attr('stroke', '#fff')
                .attr('stroke-width', '1px');
    

    // insert map data from geojson data
    // map.selectAll('path')
    //     .data(allEventsList)
    //     .enter()
    //     .append('path')
    //     // .attr('d', path)
    //     .attr('class', 'map-path')
    //     // .attr("r", 15)
    //     .attr("r", function(d){ return size(d.measure_value) })
    //     .attr("fill", function(d){ return color(d.type) })
    //     .attr('stroke', '#ccc')
    //     .attr('stroke-width', 1);
    //     // .text(function(d) { return d.title });
    //     // .on('mouseover', function(d) {
    //     //     console.log(d);
    //     //     tooltip.transition()
    //     //         .duration(200)
    //     //         .style('opacity', .9);
    //     //     tooltip.html(d.title)
    //     //         .style('left', (d3.event.pageX + 5) + 'px')
    //     //         .style('top', (d3.event.pageY - 28) + 'px');
    //     // }
    //     // )
    //     // .on('mouseout', function(d) {
    //     //     tooltip.transition()
    //     //         .duration(500)
    //     //         .style('opacity', 0);
    //     // }
    //     // );

}
