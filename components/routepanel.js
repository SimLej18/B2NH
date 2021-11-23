// Définition variables
currentroute = []
maxlimit = 5 // Nombre maximum d'évènements dans le trajet

function routepanelAnchorClick() {
    $('.routepanelBody').toggle();
}

// Ajoute l'evènement sélectionné au trajet
function addDestinationClick() {
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
        completelist.innerHTML += "<li> " + currentroute[i]["title"] + "</li>";
      } 

    //infopanel
    updateCircuitButton()
}