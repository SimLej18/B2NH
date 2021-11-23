// Définition variables
currentroute = []

function routepanelAnchorClick() {
    $('.routepanelBody').toggle();
}

// Ajoute l'evènement sélectionné au trajet
function addDestinationClick() {
    // Currently add random event from the allEventsList
    $('.buttonadddestination').toggle();
    console.log('A new destination is added')
    currentroute.push(allEventsList[Math.floor(Math.random() * (allEventsList.length-1))]) // Change this
    console.log('Current circuit: ' + currentroute)
    updateRoute()
}

// Mise à jour de la fenêtre d'affichage de la route
function updateRoute() {
    var completelist= document.getElementById('printedRoute')

    completelist.innerHTML = ""
    for (let i = 0; i < currentroute.length; i++) {
        completelist.innerHTML += "<li> " + currentroute[i]["title"] + "</li>";
      } 
}