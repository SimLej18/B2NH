// Définition variables
currentroute = []
maxlimit = 8 // Nombre maximum d'évènements dans le trajet

function routepanelAnchorClick() {
    $('.routepanelBody').toggle();
}

// Ajoute l'evènement sélectionné au trajet
function addDestinationClick() {
    if ($('.routepanelBody').is(":hidden")) {
        $('.routepanelBody').toggle()
      }
    console.log('A new destination is added')
    currentroute.push(selectedEvent)
    console.log('Current circuit length: ' + currentroute.length)
    updateRoute()
}

// Supprime l'évènement sélectionné du trajet
function removeDestinationClick() {
    if ($('.routepanelBody').is(":hidden")) {
        $('.routepanelBody').toggle()
      }
    console.log('A destination has been removed')
    currentroute.splice(currentroute.indexOf(selectedEvent), 1)
    console.log('Current circuit: ' + currentroute)
    updateRoute()
}

// Mise à jour des fenêtres d'affichage
function updateRoute() {
    // routepanel
    var completelist= document.getElementById('printedRoute')
    $('#printedRoute').empty();

    for (let i = 0; i < currentroute.length; i++) {

        // Create a line
        var line = document.createElement("p");
        completelist.appendChild(line);
        line.id = "destination" + i;
        line.setAttribute("onclick","selectRouteEvent(" + i + ")");
        line.className = "destinationline";
        // line.setAttribute("onmousover","highlightEventOnMap(null ," + selectedEvent + ")");

        // Create the text element
        var linetext = document.createElement("p");
        line.appendChild(linetext);
        linetext.setAttribute("onclick","selectRouteEvent(" + i + ")");
        linetext.className = "destinationtext";

        destinationLine = ""

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

        // Create the buttons elements
        
        if(i >= 1){
            var upb = document.createElement("button");
            line.appendChild(upb);
            upb.setAttribute("onclick","routeUp(" + i + ")");
            upb.className = "movebutton";
            upb.innerHTML = "↑"
        }
        
        if(i < currentroute.length-1){
            var downb = document.createElement("button");
            line.appendChild(downb);
            downb.setAttribute("onclick","routeDown(" + i + ")");
            downb.className = "movebutton";
            downb.innerHTML = "↓"
        }
        
        linetext.innerHTML = destinationLine
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
    mylist = [];
    for (let i = 0; i < currentroute.length; i++) {
        mylist.push(currentroute[i]["links"]["self"])
    }

    if (mylist.includes(selectedEvent["links"]["self"])) {
      document.getElementById(`circuitbutton`).innerHTML=`<button class ='panelbutton' onclick = "removeDestinationClick()">Remove from circuit</button>`; 
      }
    else{
        if (currentroute.length >= maxlimit){
            document.getElementById(`circuitbutton`).innerHTML=`<div>You circuit is full !</div>`;
        }
        else{
            document.getElementById(`circuitbutton`).innerHTML=`<button class ='panelbutton' onclick = "addDestinationClick()">Add to circuit</button>`;
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
    // console.log(currentEvent);
    updateInfoPanel(currentEvent.links.self);
    selectedEvent = currentEvent;
    updateCircuitButton();
    checkEventClick(currentroute[index])
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