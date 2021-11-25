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
    currentroute.push(allEventsList[Math.floor(Math.random() * (allEventsList.length-1))]) // Change this
    console.log('Current circuit: ' + currentroute)
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

    completelist.innerHTML = ""
    for (let i = 0; i < currentroute.length; i++) {
        completelist.innerHTML += "<li>" + currentroute[i]["title"] + "<button onclick = 'routeUp(" + i + ")'>Up</button> <button onclick = 'routeDown(" + i + ")'>Down</button></li>";
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
    console.assert(i<=maxlimit, "i should be smaller than " + maxlimit + ". Your i: " + i)
    const tmp = currentroute[i]
    currentroute[i] = currentroute[i+1]
    currentroute[i+1] = tmp

    updateRoute()
}