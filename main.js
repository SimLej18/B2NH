// need to be fetched
let world_data_url = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

var volcanoes = [];
var allEventsDict = {"VolcanoEvents": [], "TsunamiEvents": [], "EarthquakeEvents": []}
var allEventsList = [];
var currentTypeFilter = [1, 1, 1];  // All events shown by default
var currentTimeFilter = [-5000, 2021];  // All events shown by default
var filteredEvents = [];
var selectedVolcano = null;
var selectedEvent = null;
var world_data = null;


initApp();

async function initApp() {
    await fetchAllData();
    createTimeline();
    createMap();
}

function resetVars() {
    volcanoes = [];
    allEventsDict = {"VolcanoEvents": [], "TsunamiEvents": [], "EarthquakeEvents": []}
    allEventsList = [];
    currentTypeFilter = [1, 1, 1];
    currentTimeFilter = [-5000, 2021];
    filtredEvents = [];
    selectedVolcano = null;
    selectedEvent = null;
}

async function fetchAllData() {
    resetVars();

    // Fetch volcanoes
    await fetch("https://b2nh-api.tintamarre.be/api/v1/volcanoes/")
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Pas de réponse de l'API");
            }
        }).then(info => {
            volcanoes = info.data;
        }).catch((error) => console.error("erreur du fetch:", error));

    // Fetch all events
    await fetch("https://b2nh-api.tintamarre.be/api/v1/filter_map_array/start/-5000/end/2021")
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Pas de réponse de l'API");
            }
        }).then(info => {
            allEventsList = info.data;

            for (var i = 0 ; i < info.data.length ; i++) {
                switch (info.data[i].type) {
                    case "irruption":
                        allEventsDict["VolcanoEvents"].push(info.data[i]);
                        break;
                    case "earthquake":
                        allEventsDict["EarthquakeEvents"].push(info.data[i]);
                        break;
                    case "tsunami":
                        allEventsDict["TsunamiEvents"].push(info.data[i]);
                        break;
                }
            }

        }).catch((error) => console.error("erreur du fetch:", error));
}

function filterEvents(typeFilter = currentTypeFilter, timeFilter = currentTimeFilter) {
    console.assert(typeFilter.length == 3 && typeFilter.every((value) => (value == 0 || value == 1)), "Invalid type filter");
    console.assert(currentTimeFilter.length == 2 && currentTimeFilter[0] < currentTimeFilter[1] && currentTimeFilter[0] >= -5000 && currentTimeFilter[1] <= 2021, "Invalid time filter");
    filteredEvents = [];

    // Filter from type
    var filteredTypeEvents = []
    if (typeFilter[0] == 1) {  // Add volcanoes
        filteredTypeEvents = filteredTypeEvents.concat(allEventsDict["VolcanoEvents"]);
    }
    if (typeFilter[1] == 1) {  // Add tsunamis
        filteredTypeEvents = filteredTypeEvents.concat(allEventsDict["TsunamiEvents"]);
    }
    if (typeFilter[2] == 1) {  // Add earthquakes
        filteredTypeEvents = filteredTypeEvents.concat(allEventsDict["EarthquakeEvents"]);
    }

    // Filter from time
    for (var i = 0 ; i < filteredTypeEvents.length ; i++) {
        var year = parseInt(filteredTypeEvents[i].dateTime.split('-')[0]);
        if (year >= timeFilter[0] && year <= timeFilter[1]) {
            filteredEvents.push(filteredTypeEvents[i])
        }
    }
}

function selectVolcano(id) {
    fetch(""+"/"+id)  // Path needs to be changed
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Pas de réponse de l'API");
            }
        }).then(info => {
            selected_event = info;
        }).catch((error) => console.error("erreur du fetch:", error));
}

function selectEvent(type, id) {
    console.assert(type == "volcano" || type == "earthquake" || type == "tsunami", "Invalid type.");

    fetch("https://b2nh-api.tintamarre.be/api/v1/events/"+type+"/"+id)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Pas de réponse de l'API");
            }
        }).then(info => {
            selected_event = info;
        }).catch((error) => console.error("erreur du fetch:", error));
}
