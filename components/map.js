// define empty data object to store data
let data = {};
let volcanoes_map_url = "https://b2nh-api.tintamarre.be/api/v1/volcanoes_map";
let world_map_url = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

// function to get data from url for d3 map
const getData = () => {
    return fetch(world_map_url)
        .then(res => res.json())
        .then(data => data)
    }

// when data is loaded, create map
getData().then(data => {
    createMap(data);
});

// Method that will be used when we update the data
updateMap = () => {
    // get data from url
    getData().then(data => {
        // update map data
        updateMapData(data);
    });
}

// function to create map with d3.js
const createMap = (data) => {
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
        
    // create tooltip
    const tooltip = d3.select('#info-item-tooltip')
        .append('div')
        .attr('class', 'tooltip')
        .style('size', '10px')
        .style('background-color', '#fff');

    // insert map data from geojson data
    map.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', 'map-path')
        .attr('fill', 'white')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1)
        .on('mouseover', function(d) {
            console.log(d);
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(d.properties.name)
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


        


