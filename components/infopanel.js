//définition de variables, par la suite récupérées de map.js j'imagine
id=1;
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
    document.getElementById("element1").innerHTML=`VOLCANO 🌋 : ${info.data.geoJson.properties.title}`;
    document.getElementById("element2").innerHTML=`Explosivity index : ${index[info.data.volcano_explosivity_index]}`;
    const datestart = /\d{2}-\w+-\d+/g.exec(`${info.data.dateTime}`);
    //let dateend = new Date(`${info.data.endDate}`)
    document.getElementById('element5').innerHTML=`⚐ : ${info.data.volcano.country}`;
    //document.getElementById("element3").innerHTML=`🕐 : ${datestart} → ${dateend.getDate()}-${month[dateend.getMonth()]}-${dateend.getYear()}`;
    document.getElementById("element3").innerHTML=`🕐 : ${datestart}`;
    document.getElementById("element4").innerHTML=`lasted ${info.data.duration}`;
    document.getElementById('element6').innerHTML=`Damage : ${info.data.damageAmountOrder}`;
    if (info.data.deathAmountOrder!=null) {
    document.getElementById('element7').innerHTML=`Deaths : ${info.data.deathAmountOrder}`; 
    }
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
    displayVolcano(info,index,month);
    }
  })
  .catch((error) => console.error("erreur du fetch:", error));

 