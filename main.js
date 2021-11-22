var volcanoes = [];
var allEventsDict = {"volcano_events": [], "tsunami_events": [], "earthquake_events": []}
var allEventsList = [];
var currentFilter = [1, 1, 1];  // All events shown by default
var filtredEvents = [];
var selectedVolcano = null;
var selectedEvent = null;

fetchAllData()

function resetVars() {
    volcanoes = [];
    allEventsDict = {"volcano_events": [], "tsunami_events": [], "earthquake_events": []}
    allEventsList = [];
    filtredEvents = [];
    selectedVolcano = null;
    selectedEvent = null;
}

function fetchAllData() {
    resetVars();

    // Fetch volcanoes
    fetch("https://b2nh-api.tintamarre.be/api/v1/volcanoes/")  // Path needs to be changed
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

    // Fetch volcano events
    fetch("https://b2nh-api.tintamarre.be/api/v1/volcano_events/")  // Path needs to be changed
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Pas de réponse de l'API");
            }
        }).then(info => {
            allEventsDict["volcano_events"] = info.data;
            allEventsList.concat(info.data);
            filtredEvents.concat(info.data);
        }).catch((error) => console.error("erreur du fetch:", error));

    // Fetch tsunami events
    fetch("https://b2nh-api.tintamarre.be/api/v1/tsunami_events/")  // Path needs to be changed
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Pas de réponse de l'API");
            }
        }).then(info => {
            allEventsDict["tsunami_events"] = info.data;
            allEventsList.concat(info.data);
            filtredEvents.concat(info.data);
        }).catch((error) => console.error("erreur du fetch:", error));

    // Fetch earthquake events
    fetch("https://b2nh-api.tintamarre.be/api/v1/earthquake_events/")  // Path needs to be changed
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Pas de réponse de l'API");
            }
        }).then(info => {
            allEventsDict["earthquake_events"] = info.data;
            allEventsList.concat(info.data);
            filtredEvents.concat(info.data);
        }).catch((error) => console.error("erreur du fetch:", error));
}

function filterEvents(filter) {

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
