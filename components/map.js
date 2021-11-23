// const getData = async (url) => (
//     await fetch(url)
//     .then(
//         data => data.json()
//     )
//   );
  
  const wrapperFunc = async () => {  
    let volcanoes_map_url = "https://b2nh-api.tintamarre.be/api/v1/volcanoes_map";
    let world_map_url = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
    let world_data = await getData(world_map_url);
    let volcanoes = await getData(volcanoes_map_url);
    // assign data to global variable
    // world_data = world_data;
    // volcanoes = volcanoes;
    // return data
    return {
        world_data,
        volcanoes
    };
  }

  createMap();

  async function createMap() {
    await fetchAllData();
    // Data variables are available in main.js
    console.log(allEventsList);

    console.log("Map ready!");
}
  

// function to get data from url for d3 map
// const getData = (url) => {
//     return fetch(url)
//         .then(res => res.json())
//         .then(data => data)
//     }

// when data is loaded, create map
// getData(events_url).then(data => {
//     createMap(data);
// });

// Method that will be used when we update the data
updateMap = () => {
    // get data from url
    getData().then(data => {
        // update map data
        updateMapData(data);
    });
}

// function to create map with d3.js
const buildMap = (data) => {
    console.log(data);
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
       .domain(["VolcanoEvent", "EarthquakeEvent", "TsunamiEvent" ])
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

    // insert map data from geojson data
    map.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', 'map-path')
        // .attr("r", 15)
        .attr("r", function(d){ return size(d.properties.measure_value) })
        .attr("fill", function(d){ return color(d.properties.type) })
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1)
        .text(function(d) { return d.properties.title })
        .on('mouseover', function(d) {
            console.log(d);
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(d.properties.title)
                .style('left', (d3.event.pageX + 5) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px');
        }
        )
        .on('mouseout', function(d) {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        }
        );

} 


        


