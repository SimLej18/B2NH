//définition de variables, par la suite récupérées de map.js j'imagine
id=13;
type="volcano";
//récupération des données

function infopanelAnchorClick() {
    $('.infopanelBody').toggle();
}

function displayEarthquake(info) {
    document.getElementById("element1").innerHTML="EARTHQUAKE";
    document.getElementById("element2").innerHTML=`magnitude : ${info.data.eqMagnitude}`;
    document.getElementById("element3").innerHTML=`🕐 : ${info.data.dateTime}`;
    document.getElementById('element4').innerHTML=`⚐ : ${info.data.locationName}`;
    document.getElementById('element5').innerHTML=`damage : ${info.data.damageAmountOrder}`;

}

function displayTsunami(info) {
    document.getElementById('element1').innerHTML="TSUNAMI";
    document.getElementById('element2').innerHTML=`🕐 : ${info.data.dateTime}`;
    document.getElementById('element3').innerHTML=`⚐ : ${info.data.locationName}`;
    document.getElementById('element4').innerHTML=`damage : ${info.data.damageAmountOrder}`;
}

function displayVolcano(info) {
    document.getElementById("element1").innerHTML=`VOLCANO : ${info.data.geoJson.properties.title}`;
    document.getElementById("element2").innerHTML=`volcano explosivity index : ${info.data.volcano_explosivity_index}`;
    document.getElementById("element3").innerHTML=`🕐 : ${info.data.dateTime}`;
    document.getElementById('element4').innerHTML=`⚐ : ${info.data.volcano.country}`;
    document.getElementById('element5').innerHTML=`damage : ${info.data.damageAmountOrder}`;
}

fetch("https://b2nh-api.tintamarre.be/api/v1/events/"+type+"/"+id)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Pas de réponse de l'API");
    }
  })
  .then(info => {
    console.log(info);
    if (type=="earthquake") {
    displayEarthquake(info);
    }
    if (type=="tsunami") {
    displayTsunami(info);
    }
    if (type=="volcano") {
    displayVolcano(info);
    }
  })
  .catch((error) => console.error("erreur du fetch:", error));

 