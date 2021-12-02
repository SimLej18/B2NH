// Définition variables
currentroute = []
maxlimit = 8 // Nombre maximum d'évènements dans le trajet

function routepanelAnchorClick() {
    $('.routepanelBody').toggle();
}

// Ajoute l'evènement sélectionné au trajet
function addDestinationClick() {
    console.log('A new destination is added')
    currentroute.push(selectedEvent)
    console.log('Current circuit: ' + currentroute)
    updateRoute()
}

// Supprime l'évènement sélectionné du trajet
function removeDestinationClick() {
    console.log('A destination has been removed')
    currentroute.splice(currentroute.indexOf(selectedEvent), 1)
    console.log('Current circuit: ' + currentroute)
    updateRoute()
}

// Mise à jour des fenêtres d'affichage
function updateRoute() {
    // routepanel
    var completelist= document.getElementById('printedRoute')

    completelist.innerHTML = ""
    for (let i = 0; i < currentroute.length; i++) {
        destinationLine = ""

        destinationLine += "<p onclick='selectRouteEvent(" + i + ")'>" ;
        if (currentroute[i]["type"] == 'eruption'){
            destinationLine += "🌋 "
        }
        if (currentroute[i]["type"] == 'tsunami'){
            destinationLine += "🌊 "
        }
        if (currentroute[i]["type"] == 'earthquake'){
            destinationLine += "🌏 "
        }
        if (currentroute[i]["type"] == "eruption"){
            destinationLine += currentroute[i]["volcano"]["country"]
        }
        else{
            destinationLine += currentroute[i]["country"]
        }
        if(i >= 1){
            destinationLine += "<p class='panelbutton' onclick = 'routeUp(" + i + ")'>Up</p>"
        }
        if(i < currentroute.length-1){
            destinationLine += "<p class='panelbutton' onclick = 'routeDown(" + i + ")'> Down</p>"
        }
        destinationLine += "</p>"

        completelist.innerHTML += destinationLine
    } 

    if (currentroute.length == 0){
        completelist.innerHTML = "<p>Create your own circuit !</p>"
    }

    //infopanel
    updateCircuitButton()

    //map
    //drawCircuit()
}

// Met à jour le bouton d'ajout/suppression de destination, dans l'infopanel
function updateCircuitButton(){
    if (currentroute.includes(selectedEvent)) {
      document.getElementById(`circuitbutton`).innerHTML=`<p onclick = "removeDestinationClick()">Remove from circuit</p>`; 
      }
    else{
        if (currentroute.length >= maxlimit){
            document.getElementById(`circuitbutton`).innerHTML=`<div>You circuit is full !</div>`;
        }
        else{
            document.getElementById(`circuitbutton`).innerHTML=`<p onclick = "addDestinationClick()">Add to circuit</p>`;
        }
    }
  }

function routeUp(i){
    console.assert(i>=1, "i should be higher than 1. Your i: " + i)
    const tmp = currentroute[i]
    currentroute[i] = currentroute[i-1]
    currentroute[i-1] = tmp

    updateRoute()
}

function routeDown(i){
    console.assert(i< maxlimit-1, "i should be smaller than " + maxlimit-1 + ". Your i: " + i)
    const tmp = currentroute[i]
    currentroute[i] = currentroute[i+1]
    currentroute[i+1] = tmp

    updateRoute()
}

function selectRouteEvent(index){
    console.assert(index < currentroute.length && index >= 0, "Index exception")
    currentEvent = currentroute[index]

    // clickEvent(e, currentEvent.data)
    updateInfoPanel(currentEvent["self_url"]);
    selectedEvent = currentEvent;
    updateCircuitButton();
}

// Draw the entire circuit on the world map
function drawCircuit(){
    if(currentroute.length > 1){
        for (let i = 1; i < currentroute.length; i++){
            drawLine(currentroute[i-1], currentroute[i])
        }
    }

}

// Draw a line between two destinations
function drawLine(event1, event2)
{
    const canvas = document.querySelector('#canvas');

    if (!canvas.getContext) {
        return;
    }
    const ctx = canvas.getContext('2d');

    // set line stroke and line width
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;

    // draw a red line
    ctx.beginPath();
    console.log(event1)
    ctx.moveTo(event1["latitude"], event1["longitude"]);
    ctx.lineTo(event2["latitude"], event2["longitude"]);
    ctx.stroke();
    
    draw();
}