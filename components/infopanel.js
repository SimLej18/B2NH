$('#commentary').toggle();
$('#togglecommentary2').toggle();
//sert pour les volcans pour leur indice d'explosivité

let index=["Effusive","Gentle","Explosive","Catastrophic","Cataclysmic","Paroxysmic","Colossal","Super-colossal","Mega-colossal"]

function infopanelAnchorClick() {

  $('.infopanelBody').toggle();
  
}
 
function commentaryClick(){
  $('#infos').fadeToggle();
  $('#togglecommentary').toggle();
  $('#togglecommentary2').toggle();
  $('#commentary').fadeToggle();
  
}

function display(keys,labels,couleur,comments){
  for(i=0;i<8;i++){
    $(`#element${i}`).html(``)
  }
  j=1
  for(i=0;i<keys.length;i++){
    if(keys[i]!=(null||"unknown")){
    $(`#element${j}`).html(labels[i])
    if(i==1){
        drawbar(couleur,j,keys[1])
      }
    j++
    }
  }
  $('#commentary').html(comments)
}

// function used to draw the coloured svg bar
function drawbar(couleur,j,keys){

var svg = d3.select(`#element${j}`).append("svg").attr("width", "100%").attr("height","42px")
    var size=couleur[4]
    var data = Array.from({length: couleur[2]}, (_, i) => i + 1)
    var myColor = d3.scaleLinear().domain([1,couleur[2]]).range([couleur[0],couleur[1]])
    svg.selectAll(".firstrow").data(data).enter().append("rect")
    .attr("x", function(d,i){return 15+size*i}).attr("y", 10)
    .attr("width",size).attr("height",15).attr("fill", function(d){return myColor(d) })
    svg.append('rect').attr("x",15+keys*size).attr("y",10).attr("width",2).attr("height",16).attr("fill", 'rgb(196, 252, 251)')
    svg.append('text').text("0").attr("x",0).attr("y",17).attr("dy", ".35em").style('fill', 'rgb(196, 252, 251)')
    svg.append('text').text(String(couleur[2])).attr("x",size*(couleur[2])+20).attr("y",17).attr("dy", ".35em").style('fill', 'rgb(196, 252, 251)')
    svg.append('text').text(String(couleur[5])).attr("x",keys*size).attr("y",40).style('fill', 'rgb(196, 252, 251)').style("font-size", "14px")
    d3
}

// This function is called when the user clicks on the button of an event
function updateInfoPanel(url_of_event) {
  $(`#infos`).fadeToggle(50);
  $('#togglecommentary').fadeToggle(50)
  fetchEvent(url_of_event);
  console.log(url_of_event);
  
  $(`#infos`).fadeToggle();
  $('#togglecommentary').fadeToggle()
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
    labels = ["🌏Earthquake🌏", `&nbsp Earthquake Magnitude :`,
    `🕐 : &nbsp${/\d{2}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/\D{3}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/(?<=-)-?\d{4}/g.exec(`${info.data.dateTime}`)}`,
    `⚐ : &nbsp${info.data.country}`,`Damage ⚡ : &nbsp${info.data.damageAmountOrder}`,` Victims 💀 : &nbsp${info.data.deathsAmountOrder}`]
    couleur = ['LightYellow','green',10,"red",16,info.data.eqMagnitude]
    comments=info.data.comments
    display(keys,labels,couleur,comments);
    
    }

    if (info.data.type=="tsunami") {
    keys = ["name",info.data.tis,info.data.dateTime,info.data.country,info.data.damageAmountOrder,info.data.deathsAmountOrder]
    labels = ["🌊Tsunami🌊",`&nbsp &nbsp Tsunami intensity :`,`🕐 : &nbsp${/\d{2}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/\D{3}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/(?<=-)-?\d{4}/g.exec(`${info.data.dateTime}`)}`,
    `⚐ : &nbsp${info.data.country}`,`Damage ⚡ : &nbsp${info.data.damageAmountOrder}`,` Victims 💀 : &nbsp${info.data.deathsAmountOrder}`]
    couleur = ['LightBlue','Blue',10,"red",16,info.data.tis]
    comments=info.data.comments
    display(keys,labels,couleur,comments);
    }

    if (info.data.type=="irruption") {
    keys = [info.data.volcano.name,info.data.volcano_explosivity_index,info.data.dateTime,info.data.country,info.data.damageAmountOrder,info.data.deathsAmountOrder]
    labels = [`🌋Volcano : &nbsp ${info.data.volcano.name}🌋`,`&nbsp Explosivity index :`,
    `🕐 : &nbsp${/\d{2}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/\D{3}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/(?<=-)-?\d{4}/g.exec(`${info.data.dateTime}`)}`,`⚐ : &nbsp${info.data.volcano.country}`,
    `Damage ⚡ : &nbsp${info.data.damageAmountOrder}`,`Victims 💀: &nbsp${info.data.deathsAmountOrder}`]
    couleur = ['LightYellow','Red',8,"blue",20,index[info.data.volcano_explosivity_index]]
    comments=info.data.comments
    display(keys,labels,couleur,comments);
    }
  })
  .catch((error) => console.error("erreur du fetch:", error));
}

// data fetched at the beginning of the page
fetchEvent("https://b2nh-api.tintamarre.be/api/v1/events/random");
