//définition de variables, par la suite récupérées de map.js j'imagine
id=11;
type="volcano";
//récupération des données
let index=["Effusive","Gentle","Explosive","Catastrophic","Cataclysmic","Paroxysmic","Colossal","Super-colossal","Mega-colossal"]
let month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]

function infopanelAnchorClick() {
    $('.infopanelBody').toggle();
}

function displayEarthquake(info) {
    document.getElementById("element1").innerHTML="EARTHQUAKE";
    document.getElementById("element2").innerHTML=`Magnitude : ${info.data.eqMagnitude}`;
    document.getElementById("element3").innerHTML=`🕐 : ${info.data.dateTime}`;
    document.getElementById('element4').innerHTML=`⚐ : ${info.data.locationName}`;
    document.getElementById('element5').innerHTML=`Damage : ${info.data.damageAmountOrder}`;

}

function displayTsunami(info) {
    document.getElementById('element1').innerHTML="TSUNAMI";
    document.getElementById('element2').innerHTML=`🕐 : ${info.data.dateTime}`;
    document.getElementById('element3').innerHTML=`⚐ : ${info.data.locationName}`;
    document.getElementById('element4').innerHTML=`damage : ${info.data.damageAmountOrder}`;
}

function displayVolcano(info,index,month) {
    i=1
    if(info.data.properties.title!=(null||"unknown")){
    document.getElementById(`element${i}`).innerHTML=`Volcano : &nbsp🌋 ${info.data.properties.title}🌋 `;
    i++
    }

    if(info.data.volcano_explosivity_index!=(null||"unknown")) {
    document.getElementById(`element${i}`).innerHTML=`Explosivity index : &nbsp ${index[info.data.volcano_explosivity_index]}`;
    i++
    }

    if(info.data.dateTime!=(null||"unknown")){
    const datestart = /\d{2}-\w+-\d+/g.exec(`${info.data.dateTime}`);
    //let dateend = new Date(`${info.data.endDate}`)
    //document.getElementById("element3").innerHTML=`🕐 : ${datestart} → ${dateend.getDate()}-${month[dateend.getMonth()]}-${dateend.getYear()}`;
    document.getElementById(`element${i}`).innerHTML=`🕐 : &nbsp${datestart}`;
    i++
    }

    if (info.data.volcano.country!=(null||"unknown")){
    document.getElementById(`element${i}`).innerHTML=`⚐ : &nbsp${info.data.volcano.country}`;
    i++
    }

    if (info.data.duration!=(null||"unknown")){
    document.getElementById(`element${i}`).innerHTML=`lasted ${info.data.duration}`;  
    i++
    }

    if(info.data.damageAmountOrder!=(null||"unknown")){
    document.getElementById(`element${i}`).innerHTML=`Damage : &nbsp${info.data.damageAmountOrder}`;
    }

    if (info.data.deathsAmountOrder!=(null||"unknown")) {
    document.getElementById(`element${i}`).innerHTML=`Deaths amount: &nbsp${info.data.deathsAmountOrder}`; 
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
    if (info.data.type =="earthquake") {
    displayEarthquake(info);
    }
    if (info.data.type=="tsunami") {
    displayTsunami(info);
    }
    if (info.data.type=="irruption") {
    displayVolcano(info,index,month);
    }
  })
  .catch((error) => console.error("erreur du fetch:", error));
}

// data fetched at the beginning of the page
fetchEvent("https://b2nh-api.tintamarre.be/api/v1/events/random");
