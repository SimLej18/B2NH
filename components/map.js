let map_data = [];

// Method that will be used when we update the data
function updateMap() {
   // update map data
   console.log("updateMap called!");
   map_data = filteredEvents;
   removeMap();
   draw();

}

function addDestinationToMap() {
    console.log("addDestinationToMap called!");
}

// function to create map with d3.js
function createMap() {
    console.log("createMap called!");
    map_data = allEventsList;
    draw();
}

function removeMap() {
    // d3.select('#map').selectAll('*').remove();
  d3.select('#map')
  .selectAll('svg')
  .remove()
  .selectAll('path')
  .remove()
  .selectAll('circle')
  .remove();
}

function draw() {
  console.log('draw called!')

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
  //   Alternative
  //   d3.geoMercator()
  //   d3.geoConicConformal()
  //   d3.geoEquirectangular()
  //   d3.geoOrthographic() // spherical

  const projection = d3.geoMercator()
      .center([4.858293, 50.46651])
      .scale(width / 2 / Math.PI)
      .translate([width / 2, height / 2]);

  // create path
  const path = d3
      .geoPath()
      .projection(projection);

  const zoom = d3.zoom()
      .scaleExtent([1, 15])
      .on('zoom', zoomed);
  
  map.call(zoom);

  // Add a scale for bubble size
  var size = d3.scaleLinear()
   .domain([1,10])  // What's in the data
   .range([50, 100]);  // Size in pixel

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
    .range([ "triangle", "rect", "circle"]);
 
    // use this for generating symbols
var symbol_type = d3.symbol().type(function(d) { 
	if(d.type == 'tsunami') {
		return d3.symbolWye;
	}
	else if(d.type == 'irruption') {
		return d3.symbolTriangle;
	}
	else return d3.symbolCircle;
}).size(function(d) {
    return size(Math.pow(d.measure_value - 3.5, 2));
});

  // create tooltip
  const tooltip = d3.select('#tooltip')
      .append('div');

       // insert map data
  var world_map = map.selectAll('path')
  .data(world_data.features)
  .enter()
  .append('path')
  .attr('d', path)
  .attr('class', 'countries');

  // insert map data from geojson data
  var points_map_data = map.selectAll('path')
  .data(map_data, ({id}) => type + '_' + id)
  .enter()
  .append('path')
  .attr("d", symbol_type)
//  .append("circle")
  .attr("transform", function(d) {
      return "translate(" + projection([
        d.longitude,
        d.latitude
      ]) + ")";
    })
  .attr('stroke', function(d){ return color(d.type) })
  .attr('stroke-width', 1)
  .attr('fill', function(d){ return color(d.type) })
  .attr('fill-opacity', 0.5)
  .on('mouseover', function(e, d) {
    tooltip.attr('id', 'info-item-tooltip')
        .transition()
        .duration(200)
        .style('opacity', 1);
    tooltip.html(d.type + '<br/><br/>' + d.title + '<br/>' + d.measure_type + ': ' + d.measure_value + '<br/>' + d.dateTimeForHumans);
    d3.select(this)
    .attr('fill', 'yellow')
    .attr('fill-opacity', 1); 
  
})
.on('mouseout', function(e, d) {
    tooltip.transition()
        .duration(1000)
        .style('opacity', 0);
        d3.select(this)
        .attr('fill', function(d){ return color(d.type) })
        .attr("d", symbol_type);
})
.on('click', function(e, d) {
    updateInfoPanel(d.self_url);
    d3.select(this)
    .attr('fill', 'yellow')
    .attr('fill-opacity', 1);
});



function zoomed(e) {
    map.attr('transform', e.transform);
 } 

}

