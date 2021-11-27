// TODO 
// https://github.com/SimLej18/B2NH/issues/3
//

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
    map_data = filteredEvents; // allEventsList;
    draw();
}

function removeMap() {
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

    // create tooltip
  const tooltip = d3.select('#tooltip')
  .append('div');

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
      .center([4.858293, 50.46651]) // center of the map == UNamur
      .scale(width / 2 / Math.PI - 10)
      .translate([width / 2, height / 2]);

  // create path
  const path = d3
      .geoPath()
      .projection(projection);

  const zoom = d3.zoom()
      .scaleExtent([1, 15])
      .on('zoom', zoomed);
  
   var g = map.call(zoom);
  
  // Add a scale for bubble size
  var size = d3.scaleLinear()
   .domain([1,10])  // What's in the data
   .range([50, 100]);  // Size in pixel

   // Create a color scale
   var color = function(d) { 
	if(d.type == 'tsunami') {
		return colorScaleTsunami(d.measure_value);
	}
	else if(d.type == 'eruption') {
		return colorScaleEruption(d.measure_value);
	}
	else return colorScaleEarthquake(d.measure_value);
    };
   
     var colorScaleEarthquake = d3.scaleLinear()
     .domain([0,10])
     .range(["#fff", "#008101"]);
     
     var colorScaleEruption = d3.scaleLinear()
     .domain([0, 8])
     .range(["#fff", '#ff0000']);
     
     var colorScaleTsunami = d3.scaleLinear()
     .domain([0, 10])
     .range(["#fff", '#0000ff']);

    // use this for generating symbols
var symbol_type = d3.symbol().type(function(d) { 
	if(d.type == 'tsunami') {
		return d3.symbolWye;
	}
	else if(d.type == 'eruption') {
		return d3.symbolTriangle;
	}
	else return d3.symbolCircle;
}).size(function(d) {
    return size(Math.pow(d.measure_value - 3.5, 2));
});




       // insert map data
  var world_map = map.selectAll('path')
  .data(world_data.features)
  .enter()
  .append('path')
  .attr('d', path)
  .attr('class', 'countries');

  // insert map data from geojson data
  var points_map_data = map.selectAll('path')
  .data(map_data, ({type,id}) => type + '_' + id)
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
  .attr('stroke', function(d){ return color(d) })
  .attr('stroke-width', 1)
  .attr('fill', function(d){ return color(d) })
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
        .attr('fill', function(d){ return color(d) })
        .attr("d", symbol_type);
})
.on('click', function(e, d) {
    clickEvent(e, d);
    d3.select(this)
    .attr('fill', 'yellow')
    .attr('fill-opacity', 1);
});


  function zoomed(e) {
     map.attr('transform', e.transform);
     world_map.attr('transform', e.transform);
     points_map_data.attr('transform', function(d) {
        return "translate(" + projection([
          d.longitude,
          d.latitude
        ]) + ")";
      }).attr("d", symbol_type);
      

    } 

 function clickEvent(e,d) {
    //console.log(e, d);
    updateInfoPanel(d.self_url);
    var centroid = path.centroid(d),
    translate = projection.translate();

    projection.translate([
    translate[0] - centroid[0] + width / 2,
    translate[1] - centroid[1] + height / 2
    ]);

    // zoom.translate(projection.translate());

    map.selectAll("path").transition()
    .duration(700)
    .attr("d", path);
}

}

