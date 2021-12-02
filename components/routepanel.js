// Définition variables
currentroute = []
maxlimit = 5 // Nombre maximum d'évènements dans le trajet

function routepanelAnchorClick() {
    $('.routepanelBody').toggle();
}

// Ajoute l'evènement sélectionné au trajet
function addDestinationClick() {
    console.log(selectedEvent)
    // Currently add random event from the allEventsList
    console.log('A new destination is added')
    currentroute.push(selectedEvent)
    console.log('Current circuit length: ' + currentroute.length)
    updateRoute()
}

// Supprime l'évènement sélectionné du trajet
function removeDestinationClick() {
    // Pour l'instant ça supprime un élément au hasard
    console.log('A destination has been removed')
    currentroute.splice(currentroute.indexOf(currentroute[Math.floor(Math.random() * (currentroute.length-1))]), 1) // Change this
    console.log('Current circuit: ' + currentroute)
    updateRoute()
}

// Mise à jour des fenêtres d'affichage
function updateRoute() {
    // routepanel
    var completelist= document.getElementById('printedRoute')

    $('#printedRoute').empty();
    completelist.innerHTML = ""
    for (let i = 0; i < currentroute.length; i++) {

        var line = document.createElement("P"); 
        document.getElementById("printedRoute").appendChild(line);
        line.id = "destination" + i
        line.className = "destinationline"
        // line.onclick = selectRouteEvent(i)
        line.setAttribute("onclick","selectRouteEvent(" + i + ")");

        destinationLine = ""

        //destinationLine += "<p class = 'destinationline' onclick='selectRouteEvent(" + i + ")'>" ;

        // add the emoji
        destinationLine += currentroute[i]["emoji"] + " ";

        // add the country
        if (currentroute[i]["type"] == "eruption"){
            destinationLine += currentroute[i]["volcano"]["country"]
        }
        else{
            destinationLine += currentroute[i]["country"]
        }

        // add the date
        currentdate = currentroute[i]['dateTime'];
        index = currentdate.indexOf(',')+2
        currentdate = currentdate.slice(index, index+11)
        var finaldate = currentdate.replace("-", " ")
        finaldate = finaldate.replace("-", " ")

        destinationLine += " - " + finaldate

        // add the buttons
        
        if(i >= 1){
            completelist.innerHTML += " <button onclick = 'routeUp(" + i + ")'>Up</button>"
        }
        if(i < currentroute.length-1){
            completelist.innerHTML += "<button onclick = 'routeDown(" + i + ")'>Down</button>"
        }
        destinationLine += "</p>"

        line.innerHTML = destinationLine

        //completelist.innerHTML += destinationLine
    } 

    if (currentroute.length == 0){
        completelist.innerHTML = "<p>Create your own circuit !</p>"
    }

    //infopanel
    updateCircuitButton()
}


function updateCircuitButton(){
    // if (currentroute.includes('Remplacer ça par selectedEvent')) { // Remplacer par selectedEvent
    if (Math.random() < 0.3){
      document.getElementById(`circuitbutton`).innerHTML=`<button onclick = "removeDestinationClick()">Remove from circuit</button>`; 
      }
    else{
        if (currentroute.length >= maxlimit){
            document.getElementById(`circuitbutton`).innerHTML=`<div>You circuit is full !</div>`;
        }
        else{
            document.getElementById(`circuitbutton`).innerHTML=`<button onclick = "addDestinationClick()">Add to circuit</button>`;
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
    console.log(currentEvent)
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