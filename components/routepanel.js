// Définition variables
currentroute = []

function routepanelAnchorClick() {
    $('.routepanelBody').toggle();
}

function addDestinationClick() {
    $('.buttonadddestination').toggle();
    console.log('A new destination is added')
    currentroute.push(selected_event)
    console.log('Current array: ' + currentroute)
}