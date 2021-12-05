// TODO
// https://github.com/SimLej18/B2NH/issues/3
//


let labels_data = [{
    'name': 'Mer de surf',
    'description': 'description', // Alaska
    'longitude': -140,
    'latitude': 55,
    'angle': 65
  },
  {
    'name': 'Massif du Completo', // Chili
    'description': 'description',
    'longitude': -93,
    'latitude': 0,
    'angle': 71
  },
  {
    'name': 'Contrée du riz soufflé', // Asie
    'description': 'description',
    'longitude': 90,
    'latitude': -10,
    'angle': 10
  },
  {
    'name': 'Tundra maléfique', //
    'description': 'description',
    'longitude': 90,
    'latitude': 45,
    'angle': 0
  },
  {
    'name': 'Vallé du piment', // Mexique
    'description': 'description',
    'longitude': -125,
    'latitude': 16,
    'angle': 40

  },
  {
    'name': 'Île piquante', // Islande
    'description': 'description',
    'longitude': -32,
    'latitude': 60,
    'angle': 0

  },
  {
    'name': 'Terre du milieu', // Europe
    'description': 'description',
    'longitude': 4,
    'latitude': 50,
    'angle': 0

  },

];

let map_data = [];

let handler = new Object();

// Toggle class : why is it here ?
// function toggleClass(id, Class) {
//   d3.select(id)
//   .classed(Class, !d3.select(id).classed(Class))
// }
haversine(42.741,-71.3161,42.806911,-71.290611)
//function to compute distance between two coordinates
function haversine(lat1,lon1,lat2,lon2){

var R = 6371; // km 
//has a problem with the .toRad() method below.
var x1 = lat2-lat1;
var dLat = x1*Math.PI/180;  
var x2 = lon2-lon1;
var dLon = x2*Math.PI/180;  
var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);  
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

//d donne la distance
var d = R * c; 

console.log(d)
}

// Method that will be used when we update the data
function updateMap() {
  // update map data
  map_data = filteredEvents;
  updateEvents(map_data);
}

// function to create map with d3.js
function createMap() {
  map_data = filteredEvents; // allEventsList;
  draw();
}

function removeMap() {
  d3.select('#map').selectAll('*').remove();
}

function updateEvents() {

  d3.select('#map')
    .selectAll('.point')
    .style('visibility', 'hidden');

  map_data.forEach(point => {
    d3.select('#' + point.type + '_' + point.id)
      .style('visibility', 'visible');
  });

}


function draw() {
  handler.clickEvent = clickEvent;

  const width = 3000;
  const height = 1500;
  var currentZoom = 1;
  // create tooltip
  const tooltip = d3.select('#info_tooltip')
    .append('div');

  // create projection
  //   Alternative
  //   d3.geoMercator()
  //   d3.geoConicConformal()
  //   d3.geoEquirectangular()
  //   d3.geoOrthographic() // spherical
  //  d3.geoNaturalEarth1() // globe
  const projection = d3.geoMercator()
    .center([4, 50]) // center of the map == UNamur
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
    .scaleExtent([1, 20])
    .on('zoom', zoomed)
    .on('end', zoomedEnded);

  // call zoom
  map.call(zoom);

  // Add a scale for items
  var size = d3.scaleLinear()
    .domain([1, 10]) // What's in the data
    .range([70, 150]); // Size in pixel

  // Create a color scale
  var color = function (d) {
    if (d.type == 'tsunami') {
      return colorScaleTsunami(toBase10(d));
    } else if (d.type == 'eruption') {
      return colorScaleEruption(toBase10(d));
    } else return colorScaleEarthquake(toBase10(d));
  };


  var colorScaleEarthquake = d3.scaleLinear()
    .domain([0, 8])
    .range(['lightYellow', 'green']);

  var colorScaleEruption = d3.scaleLinear()
    .domain([0, 10])
    .range(['#fff', '#ff0000']);

  var colorScaleTsunami = d3.scaleLinear()
    .domain([0, 10])
    .range(['lightYellow', '#1ac6ff']);

  var toBase10 = function (d) {
    if (d.type == 'eruption') {
      measureBase10 = d.measure_value / 8 * 10;
    } else if (d.type == 'earthquake') {
      measureBase10 = (d.measure_value - 6.5) * 4; // Scale adaptation
    } else measureBase10 = d.measure_value;

    return measureBase10;
  }

  var symbol_size = function (d) {
    return Math.pow(toBase10(d), 2.4) // magic number
  }

  // use this for generating symbols
  var symbol_type = d3.symbol().type(function (d) {
    if (d.type == 'tsunami') {
      return d3.symbolWye;
    } else if (d.type == 'eruption') {
      return d3.symbolTriangle;
    } else return d3.symbolCircle;
  }).size(function (d) {
    return size(symbol_size(d));
  });




  //  insert world map data
  var world_map = map.selectAll('path')
    .data(world_data.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', 'countries');


  // insert points to map
  var points_map_data = map.selectAll('path')
    .data(map_data, ({
      type,
      id
    }) => type + '_' + id)
    .enter()
    .append('path')
    .attr('id', ({
      type,
      id
    }) => type + '_' + id)
    .attr('class', function (d) {
      return 'point ' + d.type
    })
    .attr('d', symbol_type)
    .attr('transform', function (d) {
      return 'translate(' + projection([
        d.longitude,
        d.latitude
      ]) + ')';
    })
    .attr('stroke', function (d) {
      return color(d)
    })
    .attr('stroke-width', 1)
    .attr('fill', function (d) {
      return color(d)
    })
    .text(function (d) {
      return d.measure_value;
    })
    .attr('fill-opacity', 0.5)
    .on('mouseover', function (e, d) {
      tooltip.attr('id', 'info_event_tooltip')
        .attr('class', 'sb5')
        .transition()
        .duration(200)
        .style('opacity', 1);

      var emoji = '';
      if (d.type == 'tsunami') {
        emoji = '🌊';
      } else if (d.type == 'eruption') {
        emoji = '🌋';
      } else emoji = '🌏';

      tooltip.html(emoji + ' <strong>' + d.title + '</strong><br/><br/><strong>' + d.measure_type + '</strong>: <span style="color:white;">' + d.measure_value + '</span>' + '<br/><br/><em>' + d.dateTimeForHumans + '</em>')
        .style("left", (e.pageX - 2) + "px")
        .style("top", (e.pageY - 140) + "px");;

      showCoordinates(e, d);

      // map.append("text")
      // .append("textPath") //append a textPath to the text element
      // .transition()
      // .duration(500)
      // .delay(100)
      // .attr("xlink:href", "#" + d.type + '_' + d.id) //place the ID of the path here
      // .style("fill", "white")
      // .style('font-size', '40px')
      // .style('font-family', 'Arial')
      // .attr('vector-effect', 'non-scaling-stroke')
      // .attr('stroke', '#666')
      // .attr('stroke-width', '1px')
      // .style("text-anchor","end")
      // .attr("startOffset", "80%")
      // .text(d.measure_value);

      d3.select(this)
        .attr('stroke', 'red')
        .attr('stroke-width', 4);

    })
    .on('mouseout', function (e, d) {
      tooltip.transition()
        .duration(1000)
        .style('opacity', 0);

      d3.select("#lat_long_info")
        .transition()
        .duration(1000)
        .style('opacity', 0)
        .remove();

      map.selectAll('textPath').remove();

      d3.select(this)
        .attr('fill', function (d) {
          return color(d)
        })
        .attr('d', symbol_type)
        .attr('stroke', function (d) {
          return color(d)
        }).attr('stroke-width', 1);
    })
    .on('click', function (e, d) {
      clickEvent(e, d);
      d3.select(this)
        .attr('fill', 'yellow');
    });

  // insert labels to map data
  var labels = map.selectAll('text')
    .data(labels_data)
    .enter()
    .append('text')
    .attr('transform', function (d) {
      return 'translate(' + projection([
        d.longitude,
        d.latitude
      ]) + ')rotate(' + d.angle + ')';
    })
    .text(function (d) {
      return d.name;
    })
    .style('fill', '#ccc')
    .style('font-size', '40px')
    .style('font-family', 'Arial')
    .attr('vector-effect', 'non-scaling-stroke')
    .attr('class', 'labels_region')
    .attr('stroke', '#666')
    .attr('stroke-width', '.4px')
    .style('visibility', 'hidden');



  function showCoordinates(e, d) {
    d3.select('#lat_long_info').remove();

    d3.select('#coordinates_tooltip')
      .append('div')
      .attr('id', 'lat_long_info')
      .html('<code>Latitude ' + d.latitude + ' Longitude: ' + d.longitude + '</code>');
  }


  function zoomed(e) {

    currentZoom = e.transform.k;

    world_map.attr('transform', 'translate(' + e.transform.x + ',' + e.transform.y + ')scale(' + e.transform.k + ')');

    points_map_data.attr('transform', function (d) {
      var position = projection([d.longitude, d.latitude]);
      var x = (position[0] * e.transform.k) + e.transform.x;
      var y = (position[1] * e.transform.k) + e.transform.y;

      return 'translate(' + x + ',' + y + ')scale(' + Math.cbrt(e.transform.k) + ')';
    });

    labels.attr('transform', function (d) {
      var position = projection([d.longitude, d.latitude]);
      var x = (position[0] * e.transform.k) + e.transform.x;
      var y = (position[1] * e.transform.k) + e.transform.y;

      return 'translate(' + x + ',' + y + ')scale(' + Math.sqrt(e.transform.k) + ') rotate(' + d.angle + ')';
    });


    map.selectAll('line')
      .attr('x1', function (d) {
        return (d.source.x * e.transform.k) + e.transform.x;
      })
      .attr('y1', function (d) {
        return (d.source.y * e.transform.k) + e.transform.y;
      }
      )
      .attr('x2', function (d) {
        return (d.target.x * e.transform.k) + e.transform.x;
      }
      )
      .attr('y2', function (d) {
        return (d.target.y * e.transform.k) + e.transform.y;
      }
      );


  }


  function zoomedEnded(e) {
    // console.log('zoomedEnded');
  }

  function clickEvent(e, d) {

    // close panels
    if ($('.infopanelBody').is(":hidden")) {
      infopanelAnchorClick();
    }
    //routepanelAnchorClick();

    //routepanelAnchorClick()

    // open info panel
    //infopanelAnchorClick();

    // update info panel
    updateInfoPanel(d.self_url);

    // then performs zoom

    position = projection([d.longitude, d.latitude]);
    if (currentZoom >= 13) {
      scale = 15;
    } else {
      scale = currentZoom + 3;
    }

    var x = (width / 2) - (position[0] * scale);
    var y = (height / 2) - (position[1] * scale);

    var newTransform = d3.zoomIdentity.translate(x, y).scale(scale);

    map
      .transition()
      .duration(1500)
      .ease(d3.easeCubic)
      .call(zoom.transform, newTransform)
      .on('end', function () {

      });
  }



}


function highlightEventOnMap(e, d) {



  var point_event = d3.select('#' + d.type + '_' + d.id);
  var coordinates = point_event.attr('transform');

  var cx = coordinates.split('(')[1].split(',')[0];
  var cy = coordinates.split('(')[1].split(',')[1].split(')')[0];

  var map = d3.select('#map').select('svg');

  map
    .append('circle')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('r', '800')
    .attr('stroke', 'red')
    .attr('stroke-width', '5px')
    .attr('fill', 'none')
    .transition()
    .duration(500)
    .attr('r', '20')
    .attr('stroke-width', '4px')
    .on('end', function () {
      d3.select(this)
        .transition()
        .duration(500)
        .attr('r', '2000')
        .attr('stroke-width', '12px')
        .remove();
    });



  }


  function addDestinationToMap(currentroute) {
    
    var map = d3.select('#map').select('svg');


    // remove all routes lines
    map.selectAll('line').remove();

    for (let i = 0; i < currentroute.length; i++) {

      if (i != currentroute.length - 1) {

        let current = currentroute[i];
        let next = currentroute[i + 1];
        
        var current_point = d3.select('#' + current.type + '_' + current.id);
        var current_point_coordinates = current_point.attr('transform');
      
        var x1 = current_point_coordinates.split('(')[1].split(',')[0];
        var y1 = current_point_coordinates.split('(')[1].split(',')[1].split(')')[0];
         
        var next_point = d3.select('#' + next.type + '_' + next.id);
        var next_point_coordinates = next_point.attr('transform');
    
        var x2 = next_point_coordinates.split('(')[1].split(',')[0];
        var y2 = next_point_coordinates.split('(')[1].split(',')[1].split(')')[0];

        var map = d3.select('#map').select('svg');

        // let angle = getAngle(current_lat, current_long, next_lat, next_long);
        
        // let name = current.name;
        // let description = current.description;
        
        // let longitude = current.longitude;
        // let latitude = current.latitude;
        // let id = current.id;
        // let marker = {
        //   'name': name,
        //   'description': description,
        //   'longitude': longitude,
        //   'latitude': latitude,
        //   'angle': angle,
        //   'id': id
        // };



        map
          .append('line')
          .attr('x1', x1)
          .attr('y1', y1)
          .attr('x2', x2)
          .attr('y2', y2)
          
          .attr('stroke', 'rgb(196, 252, 251)')
          .attr('stroke-width', '7px')
          .style('stroke-dasharray', '7,15')
          .transition()
          .duration(500)
          .attr('fill', 'none')
          .attr('stroke-width', '7px');

      }
    }
      console.log(currentroute);
      console.log('addDestinationToMap called!');
    }
