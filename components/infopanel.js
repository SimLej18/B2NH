
//sert pour les volcans pour leur indice d'explosivité
let index=["Effusive","Gentle","Explosive","Catastrophic","Cataclysmic","Paroxysmic","Colossal","Super-colossal","Mega-colossal"]
function infopanelAnchorClick() {
    $('.infopanelBody').toggle();
}

function display(keys,labels){
  for(i=0;i<7;i++){
    $(`#element${i}`).html(``)
  }
  j=1
  for(i=0;i<keys.length;i++){
    if(keys[i]!=(null||"unknown")){
    $(`#element${j}`).html(labels[i])
    j++
    }
  }
  updateCircuitButton()
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

    
    if (info.data.type =="earthquake") {
    keys = ["name",info.data.eqMagnitude,info.data.dateTime,info.data.country,info.data.damageAmountOrder,info.data.deathsAmountOrder]
    labels = ["🌏Earthquake🌏", `Magnitude : ${info.data.eqMagnitude}`,
    `🕐 : &nbsp${/\d{2}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/\D{3}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/(?<=-)-?\d{4}/g.exec(`${info.data.dateTime}`)}`,
    `⚐ : &nbsp${info.data.country}`,`Damage : &nbsp${info.data.damageAmountOrder}`,`Deaths amount: &nbsp${info.data.deathsAmountOrder}`]
    display(keys,labels);
    }

    if (info.data.type=="tsunami") {
    keys = ["name",info.data.dateTime,info.data.country,info.data.damageAmountOrder,info.data.deathsAmountOrder]
    labels = ["🌊Tsunami🌊",`🕐 : &nbsp${/\d{2}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/\D{3}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/(?<=-)-?\d{4}/g.exec(`${info.data.dateTime}`)}`,
    `⚐ : &nbsp${info.data.country}`,`Damage : &nbsp${info.data.damageAmountOrder}`,`Deaths amount: &nbsp${info.data.deathsAmountOrder}`]
    display(keys,labels);
    }

    if (info.data.type=="irruption") {
    keys = [info.data.volcano.name,info.data.volcano_explosivity_index,info.data.dateTime,info.data.country,info.data.damageAmountOrder,info.data.deathsAmountOrder]
    labels = [`🌋Volcano : &nbsp ${info.data.volcano.name}🌋`,`Explosivity index : &nbsp ${index[info.data.volcano_explosivity_index]}`,
    `🕐 : &nbsp${/\d{2}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/\D{3}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/(?<=-)-?\d{4}/g.exec(`${info.data.dateTime}`)}`,`⚐ : &nbsp${info.data.volcano.country}`,
    `Damage : &nbsp${info.data.damageAmountOrder}`,`Deaths amount: &nbsp${info.data.deathsAmountOrder}`]
    display(keys,labels);
    }
  })
  .catch((error) => console.error("erreur du fetch:", error));
}

// data fetched at the beginning of the page
fetchEvent("https://b2nh-api.tintamarre.be/api/v1/events/random");