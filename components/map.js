// Method that will be used when we update the data
function updateMap(allEventsList) {
   // update map data
   console.log("Update updateMapData called!");
   console.log("Map data length: " + allEventsList.length);
  //  updateMapData(allEventsList);
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
    .domain([1,10])  // What's in the data
    .range([2, 8]);  // Size in pixel


  //   const size = d3.scaleLinear(function (d) {
  //     if (d.type == 'tsunami') {
  //         return .domain([0,550]);
  //     }
  //     if (d.type == 'earthquake') {
  //         return .domain([0,10]);
  //     }
  //     if (d.type == 'irruption') {
  //         return .domain([0,10]);
  //     }
  // })
  // .range([2, 10]);  // Size in pixel



       // Create a color scale
       var color = d3.scaleOrdinal()
       .domain(["irruption", "earthquake", "tsunami" ])
       .range([ "red", "green", "blue"]);

      // for earthquake ?
      //  var colorScale = d3.scaleLinear()
      //  .domain([5, 6.3, 8.3])
      //  .range(["green", "yellow", "red"]);

             // Create a type scale
      var type = d3.scaleOrdinal()
      .domain(["irruption", "earthquake", "tsunami" ])
      .range([ "triangle", "circle", "circle"]);
      
    // create tooltip
    const tooltip = d3.select('#info-item-tooltip')
        .append('div')
        .attr('class', 'tooltip')
        .style('size', '10px')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('background-color', 'rgb(17 17 84)')
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
    .attr('fill', '#fff')
    .attr('stroke', '#ccc')
    .attr('stroke-width', '1px');

   
    // insert map data from geojson data
    map.selectAll('path')
    .data(allEventsList)
    .enter()
    .append("circle")
    .attr("transform", function(d) {
        return "translate(" + projection([
          d.longitude,
          d.latitude
        ]) + ")";
      })
    .attr("r", function(d){ return size(d.measure_value)} )
    .attr('stroke', function(d){ return color(d.type) })
    .attr('stroke-width', 2)
    .attr('fill-opacity', 0)
    .on('mouseover', function(e, d) {
      tooltip.transition()
          .duration(200)
          .style('opacity', 1);
      tooltip.html(d.type + '<br/>' + d.title + '<br/>' + d.measure_type + ': ' + d.measure_value + '<br/>' + d.dateTimeForHumans);
  })
  .on('mouseout', function(e, d) {
      tooltip.transition()
          .duration(500)
          .style('opacity', 0);
  })
  .on('click', function(e, d) {
      updateInfoPanel(d.self_url);
  });


}
