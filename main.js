// need to be fetched
let world_data_url = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

var volcanoes = [];
var allEventsDict = {"VolcanoEvents": [], "TsunamiEvents": [], "EarthquakeEvents": []}
var allEventsList = [];
var currentTypeFilter = [1, 1, 1];  // All events shown by default
var currentTimeFilter = [-5000, 2021];  // All events shown by default
var filteredEvents = [];
var filteredEventsDict = {"VolcanoEvents": [], "TsunamiEvents": [], "EarthquakeEvents": []};
var selectedVolcano = null;
var selectedEvent = null;
var world_data = null;


initApp();

async function initApp() {
    createTimeline();
    await fetchAllData();
    updateTimeline();
    createMap();
}

function resetVars() {
    volcanoes = [];
    allEventsDict = {"VolcanoEvents": [], "TsunamiEvents": [], "EarthquakeEvents": []}
    allEventsList = [];
    currentTypeFilter = [1, 1, 1];
    currentTimeFilter = [-5000, 2021];
    filteredEvents = [];
    selectedVolcano = null;
    selectedEvent = null;
}

async function fetchAllData() {
    resetVars();

    // get world data
    await fetch(world_data_url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong ...');
            }
        }).then(data => {
            world_data = data;
        }).catch((error) => console.error("erreur du fetch:", error));


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
        }).catch((error) => console.error("erreur du fetch:", error));

    // Sorts allEventsList by year
    allEventsList.sort((a, b) => {
        return a["year"] > b["year"] ? 1 : -1;
    });

    // Dispatch invents by type in allEventsDict
    for (var i = 0 ; i < allEventsList.length ; i++) {
        switch (allEventsList[i].type) {
            case "eruption":
                allEventsDict["VolcanoEvents"].push(allEventsList[i]);
                break;
            case "earthquake":
                allEventsDict["EarthquakeEvents"].push(allEventsList[i]);
                break;
            case "tsunami":
                allEventsDict["TsunamiEvents"].push(allEventsList[i]);
                break;
        }
    }

    // Initialize filteredEvents to all events at start (shallow copies)
    filteredEvents = [...allEventsList];
    filteredEventsDict = {"VolcanoEvents": [...allEventsDict["VolcanoEvents"]], "EarthquakeEvents": [...allEventsDict["EarthquakeEvents"]], "TsunamiEvents": [...allEventsDict["TsunamiEvents"]]};
}

function filterEvents(typeFilter = currentTypeFilter, timeFilter = currentTimeFilter) {
    console.assert(typeFilter.length == 3 && typeFilter.every((value) => (value == 0 || value == 1)), "Invalid type filter: "+typeFilter);
    console.assert(timeFilter.length == 2 && timeFilter[0] <= timeFilter[1] && timeFilter[0] >= -5000 && timeFilter[1] <= 2021, "Invalid time filter: "+timeFilter);

    // Updates current filters
    var previousTimeFilter = [...currentTimeFilter];
    currentTypeFilter = [...typeFilter];
    currentTimeFilter = [...timeFilter];

    filteredEvents = [];


    // Filter from type

    filteredEventsDict["VolcanoEvents"] = filterFromTime(filteredEventsDict["VolcanoEvents"], allEventsDict["VolcanoEvents"], currentTimeFilter, previousTimeFilter);
    if (typeFilter[0] == 1) {  // Add volcanoes
        filteredEvents = filteredEvents.concat(filteredEventsDict["VolcanoEvents"]);
    }

    filteredEventsDict["TsunamiEvents"] = filterFromTime(filteredEventsDict["TsunamiEvents"], allEventsDict["TsunamiEvents"], currentTimeFilter, previousTimeFilter);
    if (typeFilter[1] == 1) {  // Add tsunamis
        filteredEvents = filteredEvents.concat(filteredEventsDict["TsunamiEvents"]);
    }

    filteredEventsDict["EarthquakeEvents"] = filterFromTime(filteredEventsDict["EarthquakeEvents"], allEventsDict["EarthquakeEvents"], currentTimeFilter, previousTimeFilter);
    if (typeFilter[2] == 1) {  // Add earthquakes
        filteredEvents = filteredEvents.concat(filteredEventsDict["EarthquakeEvents"]);
    }
}

function filterFromTime(list, fullList, newTimeFilter, previousTimeFilter) {
    // Given a sorted list and a time filter, filter the list efficiently
    if (newTimeFilter[0] > previousTimeFilter[0]) {
        while (list.length > 0 && list[0]["year"] < newTimeFilter[0]) {
            list.shift();  // Removes first element
        }
    }
    if (newTimeFilter[0] < previousTimeFilter[0]) {
        var i = 0;
        var retrievedEvents = [];
        while (i < fullList.length && fullList[i]["year"] < previousTimeFilter[0]) {
            if (fullList[i]["year"] >= newTimeFilter[0]) {
                retrievedEvents.push(fullList[i])
            }
            i++;
        }
        list = retrievedEvents.concat(list);
    }
    if (newTimeFilter[1] < previousTimeFilter[1] && list.length > 0) {
        while (list.length > 0 && list[list.length - 1].year > newTimeFilter[1]) {
            list.pop();  // Removes last element
        }
    }
    if (newTimeFilter[1] > previousTimeFilter[1]) {
        var i = fullList.length-1;
        var retrievedEvents = [];
        while (i >= 0 && fullList[i]["year"] > previousTimeFilter[1]) {
            if (fullList[i]["year"] <= newTimeFilter[1]) {
                retrievedEvents.unshift(fullList[i])
            }
            i--;
        }
        list = list.concat(retrievedEvents);
    }

    return list;
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
    console.assert(type == "eruption" || type == "earthquake" || type == "tsunami", "Invalid type.");

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
