// TODO 
// https://github.com/SimLej18/B2NH/issues/3
//

let map_data = [];

// Toggle class : why is it here ?
function toggleClass(id, Class) {
  d3.select(id)
  .classed(Class, !d3.select(id).classed(Class))
}

// Method that will be used when we update the data
function updateMap() {
   // update map data
   console.log("updateMap called!");
   map_data = filteredEvents;
   removeMap();
   draw();
}

function addDestinationToMap() {
    toggleClass
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
  .remove();
}

function draw() {

  const width = 3000;
  const height = 1500
  
  // variables for catching min and max zoom factors
  var minZoom;
  var maxZoom;;

    // create tooltip
  const tooltip = d3.select('#tooltip')
  .append('div');


  // create projection
  //   Alternative
  //   d3.geoMercator()
  //   d3.geoConicConformal()
  //   d3.geoEquirectangular()
  //   d3.geoOrthographic() // spherical
  //  d3.geoNaturalEarth1() // globe
  const projection = d3.geoMercator()
      .center([0,0]) // center of the map == UNamur
      .scale(width / 2 / Math.PI) // scale to fit the map to the screen
      .translate([width / 2, height / 2]);


  const map = d3.select('#map')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('class', 'map');

  // create path
  const path = d3
      .geoPath()
      .projection(projection);


  const zoom = d3.zoom()
      .scaleExtent([1, 15])
      .on('zoom', zoomed)
      .on('end', zoomedEnded);
  
  // call zoom
  map.call(zoom);
  
  // Add a scale for bubble size
  var size = d3.scaleLinear()
   .domain([1,10])  // What's in the data
   .range([70, 150]);  // Size in pixel

   // Create a color scale
   var color = function(d) { 
	if(d.type == 'tsunami') {
		return colorScaleTsunami(adapt_to_per10(d));
	}
	else if(d.type == 'eruption') {
		return colorScaleEruption(adapt_to_per10(d));
	}
	else return colorScaleEarthquake(adapt_to_per10(d));
    };

    // var dropPath = 'M 243.44676,222.01677 C 243.44676,288.9638 189.17548,343.23508 122.22845,343.23508 C 55.281426,343.23508 1.0101458,288.9638 1.0101458,222.01677 C 1.0101458,155.06975 40.150976,142.95572 122.22845,0.79337431 C 203.60619,141.74374 243.44676,155.06975 243.44676,222.01677 z';
    
    // // source = https://svgsilh.com/image/306989.html
    // var wavePath = "M5445 11153 c-120 -8 -321 -34 -444 -58 -744 -145 -1243 -515 -1471-1089 -59 -150 -74 -234 -74 -411 -1 -185 11 -243 74 -372 57 -116 155 -199260 -219 l35 -7 -23 19 c-28 23 -54 121 -45 168 22 121 151 210 399 277 11330 125 31 244 26 455 -22 856 -291 1165 -782 70 -111 188 -352 248 -505 107-274 183 -583 234 -950 25 -176 25 -700 0 -920 -110 -983 -466 -1887 -1089-2762 -640 -901 -1581 -1762 -2673 -2445 -725 -453 -1349 -762 -2225 -1102l-55 -21 1465 5 c4858 18 6793 25 8670 30 1158 3 2205 8 2327 11 l222 6 15 68c23 101 53 296 73 470 21 193 24 791 5 1005 -80 878 -243 1639 -551 2565 -8912677 -2589 5186 -4256 6288 -666 441 -1252 646 -2005 702 -125 9 -407 11 -5253z"

    // var squarePath = "M0,0 L0,100 L100,100 L100,0 L0,0 z";
    // var roundPath = "M0,0 A50,50 0 0,1 100,0 A50,50 0 0,1 0,0 z";
   
     var colorScaleEarthquake = d3.scaleLinear()
     .domain([0, 10])
     .range(["#fff", "#008101"]);
     
     var colorScaleEruption = d3.scaleLinear()
     .domain([0, 10])
     .range(["#fff", '#ff0000']);
     
     var colorScaleTsunami = d3.scaleLinear()
     .domain([0, 10])
     .range(["#fff", '#0000ff']);

// var symbol_path = function(d) {
//   if(d.type == 'tsunami') {
//     return wavePath;
//   }
//   else if(d.type == 'eruption') {
//     return dropPath;
//   }
//   else return roundPath;
// }

var adapt_to_per10 = function(d) {
  if(d.type == 'eruption') {
    per10 = d.measure_value / 8 * 10;
  }
  else per10 = d.measure_value;

  return per10;
}

var symbol_size = function(d) {
  

  return Math.pow(adapt_to_per10(d), 2.3)
}

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
    return size(symbol_size(d));
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
  .attr('class', function (d) { return 'point ' + d.type })
  .attr('d', symbol_type)
  // .attr("d", symbol_path)
  // .attr("size", symbol_size)
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
        .attr('fill', function(d){ return color(d) });
})
.on('click', function(e, d) {
    clickEvent(e, d);
    d3.select(this)
    .attr('fill', 'yellow')
    .attr('fill-opacity', 1);
});


  function zoomed(e) {
    // map.attr("transform", "translate(" + e.transform.x + "," + e.transform.y + ")scale(" + e.transform.k + ")");

    console.log("e.transform.x: " + e.transform.x);
    console.log("e.transform.y: " + e.transform.y);
    console.log("e.transform.k: " + e.transform.k);

    // working
    world_map.attr("transform", "translate(" + e.transform.x + "," + e.transform.y + ")scale(" + e.transform.k + ")");



    // panning working
    points_map_data.attr("transform",function(d) {

      var position = projection([d.longitude, d.latitude]);
      var x = (position[0] * e.transform.k) + e.transform.x;
      var y = (position[1] * e.transform.k) + e.transform.y;

        return "translate(" + x + "," + y + ")scale(" + e.transform.k + ")";
      });
      
    }
      

function zoomedEnded(e) {

  // points_map_data.attr("transform",function(d) {

  //   var position = projection([d.longitude, d.latitude]);
  //   var x = position[0];
  //   var y = position[1];

  //     return "translate(" + x + "," + y + ")scale(" + e.transform.k + ")";
  //   });

  console.log('zoomedEnded');
}

 function clickEvent(e,d) {
    
       // open info panel
       infopanelAnchorClick();
       // update info panel
       updateInfoPanel(d.self_url);

    // var centroid = projection([d.longitude, d.latitude]);

    // // update centre of map
    // console.log('Centroid', centroid);
  
    // // update map
    // world_map.transition()
    // .duration(1000)
    // .attr('transform', "translate(" + centroid[0] + "," + centroid[1] + ")scale(" + 20 + ")")
    // .on("end", function() {
    //       // open info panel
    //       infopanelAnchorClick();
    //       // update info panel
    //       updateInfoPanel(d.self_url);
    //     });

    // selectedEvent = d;
    // updateCircuitButton();

}

}

