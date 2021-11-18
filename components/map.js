// define empty data object to store data
let data = {};

// function to get data from server for d3 map
const getData = () => {
    return fetch('https://b2nh-api.tintamarre.be/api/v1/volcanoes_map')
        .then(res => res.json())
        .then(data => data)
    }

// when data is loaded, create map
getData().then(data => {
    createMap(data);
});

// function to create map with d3.js
const createMap = (data) => {
    console.log(data);
    // create map
} 


        


