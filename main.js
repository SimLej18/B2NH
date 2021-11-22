var volcanoes = [];
var allEventsDict = {"VolcanoEvents": [], "TsunamiEvents": [], "EarthquakeEvents": []}
var allEventsList = [];
var currentTypeFilter = [1, 1, 1];  // All events shown by default
var currentTimeFilter = [-5000, 2021];  // All events shown by default
var filtredEvents = [];
var selectedVolcano = null;
var selectedEvent = null;


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
                allEventsDict[info.data[i].type+"s"].push(info.data[i]);
            }

        }).catch((error) => console.error("erreur du fetch:", error));
}

function filterEvents(typeFilter = currentTypeFilter, timeFilter = currentTimeFilter) {
    filtredEvents = [];

    // Filter from type

    // Filter from time

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
