
//sert pour les volcans pour leur indice d'explosivité
let index=["Effusive","Gentle","Explosive","Catastrophic","Cataclysmic","Paroxysmic","Colossal","Super-colossal","Mega-colossal"]
function infopanelAnchorClick() {
    $('.infopanelBody').toggle();
}

function displayEarthquake(info) {
    for(i=0;i<8;i++){
    $(`#element${i}`).html(``)
    }
    i=2
    $('#element1').html("🌏Earthquake🌏");

    if(info.data.eqMagnitude!=(null||"unknown")){
    $("#element2").html(`Magnitude : ${info.data.eqMagnitude}`);
    i++
    }

    if(info.data.dateTime!=(null||"unknown")){
    const date = /\d{2}-\w+-\d+/g.exec(`${info.data.dateTime}`);
    $(`#element${i}`).html(`🕐 : &nbsp${date}`);
    i++
    }
    
    if (info.data.country!=(null||"unknown")){
    $(`#element${i}`).html(`⚐ : &nbsp${info.data.country}`);
    i++
    }

    if(info.data.damageAmountOrder!=(null||"unknown")){
    $(`#element${i}`).html(`Damage : &nbsp${info.data.damageAmountOrder}`);
    i++
    }
    
    if (info.data.deathsAmountOrder!=(null||"unknown")) {
    $(`#element${i}`).html(`Deaths amount: &nbsp${info.data.deathsAmountOrder}`); 
    i++
    }
}

function displayTsunami(info) {
    for(i=0;i<8;i++){
      $(`#element${i}`).html(``)
    }
    i=2
    $('#element1').html("🌊Tsunami🌊");

    if(info.data.dateTime!=(null||"unknown")){
    const date = /\d{2}-\w+-\d+/g.exec(`${info.data.dateTime}`);
    $(`#element${i}`).html(`🕐 : &nbsp${date}`);
    i++
    }

    if (info.data.country!=(null||"unknown")){
    $(`#element${i}`).html(`⚐ : &nbsp${info.data.country}`);
    i++
    }

    if(info.data.damageAmountOrder!=(null||"unknown")){
    $(`#element${i}`).html(`Damage : &nbsp${info.data.damageAmountOrder}`);
    i++
    }

    if (info.data.deathsAmountOrder!=(null||"unknown")) {
    $(`#element${i}`).html(`Deaths amount: &nbsp${info.data.deathsAmountOrder}`); 
    i++
    }

}


function displayVolcano(info,index) {
    for(i=0;i<8;i++){
      $(`#element${i}`).html(``)
    }
    i=1

    if(info.data.title!=(null||"unknown")){
    $(`#element${i}`).html(`🌋Volcano : &nbsp ${info.data.volcano.name}🌋`);
    i++
    }

    if(info.data.volcano_explosivity_index!=(null||"unknown")) {
    $(`#element${i}`).html(`Explosivity index : &nbsp ${index[info.data.volcano_explosivity_index]}`);
    i++
    }

    if(info.data.dateTime!=(null||"unknown")){
    const date = /\d{2}-\w+-\d+/g.exec(`${info.data.dateTime}`);
    $(`#element${i}`).html(`🕐 : &nbsp${date}`);
    i++
    }

    if (info.data.volcano.country!=(null||"unknown")){
    $(`#element${i}`).html(`⚐ : &nbsp${info.data.volcano.country}`);
    i++
    }

    if (info.data.duration!=(null||"unknown")){
    $(`#element${i}`).html(`lasted ${info.data.duration}`);  
    i++
    }

    if(info.data.damageAmountOrder!=(null||"unknown")){
    $(`#element${i}`).html(`Damage : &nbsp${info.data.damageAmountOrder}`);
    i++
    }

    if (info.data.deathsAmountOrder!=(null||"unknown")) {
    $(`#element${i}`).html(`Deaths amount: &nbsp${info.data.deathsAmountOrder}`); 
    i++
    }
}



// This function is called when the user clicks on the button of an event
function updateInfoPanel(url_of_event) {
  fetchEvent(url_of_event);
  console.log(url_of_event);
}

function fetchEvent(url_of_event) {
  fetch(url_of_event)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Pas de réponse de l'API");
    }
  })
  .then(info => {
    console.log(info);
    if (info.data.emoji =="🌏") {
    displayEarthquake(info);
    }
    if (info.data.emoji=="🌊") {
    displayTsunami(info);
    }
    if (info.data.emoji=="🌋") {
    displayVolcano(info,index);
    }
  })
  .catch((error) => console.error("erreur du fetch:", error));
}

// data fetched at the beginning of the page
fetchEvent("https://b2nh-api.tintamarre.be/api/v1/events/random");
