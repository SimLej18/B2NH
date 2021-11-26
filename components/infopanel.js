$('#commentary').toggle();
//sert pour les volcans pour leur indice d'explosivité

let index=["Effusive","Gentle","Explosive","Catastrophic","Cataclysmic","Paroxysmic","Colossal","Super-colossal","Mega-colossal"]

function infopanelAnchorClick() {

  $('.infopanelBody').toggle();
  
}
 
function commentaryClick(){
if ($("#commentary").is(":visible")){
$('#togglecommentary').html('&nbsp &nbsp  description')
$('#commentary').toggle();
$('#infos').toggle();
}
else{
$('#togglecommentary').html('&nbsp &nbsp close')
$('#infos').toggle();
$('#commentary').toggle();
}
  
  
  
}

function display(keys,labels,svgitems,comments){
  for(i=0;i<8;i++){
    $(`#element${i}`).html(``)
  }
  j=1
  for(i=0;i<keys.length;i++){
    if(keys[i]!=(null||"unknown")){
    $(`#element${j}`).html(labels[i])
    if(i==3){
        drawbar(svgitems,j,keys[i])
      }
    if(i==4){
      drawdamage(svgitems,j,keys[i])
    }
    if(i==5){
        drawdeath(svgitems,j,keys[i])
    }
    j++
    }
  }
  $('#commentary').html(comments)
}

// function used to draw the coloured svg bar
function drawbar(svgitems,j,keys){

var svg = d3.select(`#element${j}`).append("svg").attr("width", "100%").attr("height","42px")
    var size=svgitems[4]
    var data = Array.from({length: svgitems[2]}, (_, i) => i + 1)
    var myColor = d3.scaleLinear().domain([1,svgitems[2]]).range([svgitems[0],svgitems[1]])
    svg.selectAll(".firstrow").data(data).enter().append("rect")
    .attr("x", function(d,i){return 15+size*i}).attr("y", 10)
    .attr("width",size).attr("height",15).attr("fill", function(d){return myColor(d) })
    svg.append('rect').attr("x",15+keys*size).attr("y",10).attr("width",2).attr("height",16).attr("fill", 'rgb(196, 252, 251)')
    svg.append('text').text("0").attr("x",0).attr("y",17).attr("dy", ".35em").style('fill', 'rgb(196, 252, 251)')
    svg.append('text').text(String(svgitems[2])).attr("x",size*(svgitems[2])+20).attr("y",17).attr("dy", ".35em").style('fill', 'rgb(196, 252, 251)')
    svg.append('text').text(String(svgitems[5])).attr("x",keys*size).attr("y",40).style('fill', 'rgb(196, 252, 251)').style("font-size", "14px")
    d3
}

//function to draw death svg bar
function drawdeath(svgitems,j,keys){
  var svg = d3.select(`#element${j}`).append("svg").attr("width", "100%").attr("height","46px")
  var size = 40
  if (keys==0){cursorx=15}else {cursorx=keys*size-5}
  var data = [1,2,3,4]
  var myColor = d3.scaleLinear().domain([1,4]).range(["white","black"])
  svg.selectAll(".firstrow").data(data).enter().append("rect")
    .attr("x", function(d,i){return 15+size*i}).attr("y", 16)
    .attr("width",size).attr("height",15).attr("fill", function(d){return myColor(d) })
  svg.append('rect').attr("x",cursorx).attr("y",16).attr("width",2).attr("height",16).attr("fill", 'red')
  svg.append('text').text("0").attr("x",15).attr("y",13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text("50").attr("x",55).attr("y",13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text("100").attr("x",95).attr("y",13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text("1000+").attr("x",135).attr("y",13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text(svgitems[7]).attr("x",cursorx).attr("y",42).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
}

//function to draw damage svg bar
function drawdamage(svgitems,j,keys){
  var svg = d3.select(`#element${j}`).append("svg").attr("width", "100%").attr("height","46px")
  var size = 40
  if (keys==0){cursorx=15}else {cursorx=keys*size-5}
  var data = [1,2,3,4]
  var myColor = d3.scaleLinear().domain([1,4]).range(["LightYellow","DarkOrange"])
  svg.selectAll(".firstrow").data(data).enter().append("rect")
    .attr("x", function(d,i){return 15+size*i}).attr("y", 16)
    .attr("width",size).attr("height",15).attr("fill", function(d){return myColor(d) })
  svg.append('rect').attr("x",cursorx).attr("y",16).attr("width",2).attr("height",16).attr("fill", 'red')
  svg.append('text').text("0").attr("x",15).attr("y",13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text("1").attr("x",55).attr("y",13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text("5").attr("x",95).attr("y",13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text("25+").attr("x",135).attr("y",13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text(svgitems[6]).attr("x",cursorx).attr("y",42).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
}

// This function is called when the user clicks on the button of an event
function updateInfoPanel(url_of_event) {
  if ($("#commentary").is(":visible")){
    $('#commentary').toggle()
    $('#togglecommentary').html('&nbsp &nbsp  description')
    selectedEvent = url_of_event;
    fetchEvent(selectedEvent);
  $(`#infos`).fadeToggle();
  
  }
  else{
  $(`#infos`).fadeToggle(50);
  $('#togglecommentary').fadeToggle(50)
  $('#addDestination').fadeToggle(50)
  fetchEvent(url_of_event);
  console.log(url_of_event);
  
  $(`#infos`).fadeToggle();
  $('#togglecommentary').fadeToggle()
  $('#addDestination').fadeToggle()
  }
}

//this function stores all the infos that must be displayed on the infopanel
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
    keys = ["name",info.data.dateTime,info.data.country,info.data.eqMagnitude,info.data.damageAmountOrder,info.data.deathsAmountOrder]
    labels = ["🌏Earthquake🌏",`🕐 : &nbsp${/\d{2}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/\D{3}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/(?<=-)-?\d{4}/g.exec(`${info.data.dateTime}`)}`,
    `⚐ : &nbsp${info.data.country}`, `&nbsp Earthquake Magnitude `,`⚡ Damage (M$) ⚡ `,`💀 Victims 💀 `]
    svgitems = ['LightYellow','green',10,"red",16,info.data.eqMagnitude,`${/\w+/g.exec(`${info.damageAmountOrderLabel}`)}`,`${/\w+/g.exec(`${info.deathsAmountOrderLabel}`)}`]
    comments=info.data.comments
    display(keys,labels,svgitems,comments);
    
    }

    if (info.data.type=="tsunami") {
    keys = ["name",info.data.dateTime,info.data.country,info.data.tis,info.data.damageAmountOrder,info.data.deathsAmountOrder]
    labels = ["🌊Tsunami🌊",`🕐 : &nbsp${/\d{2}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/\D{3}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/(?<=-)-?\d{4}/g.exec(`${info.data.dateTime}`)}`,
    `⚐ : &nbsp${info.data.country}`,`&nbsp &nbsp Tsunami intensity`,`⚡ Damage (M$) ⚡`,`💀 Victims 💀`]
    svgitems = ['LightBlue','Blue',10,"red",16,info.data.tis,String(info.data.damageAmountOrderLabel),String(info.data.deathsAmountOrderLabel)]
    comments=info.data.comments
    display(keys,labels,svgitems,comments);
    }

    if (info.data.type=="irruption") {
    keys = [info.data.volcano.name,info.data.dateTime,info.data.country,info.data.volcano_explosivity_index,info.data.damageAmountOrder,info.data.deathsAmountOrder]
    labels = [`🌋Volcano : &nbsp ${info.data.volcano.name}🌋`,`🕐 : &nbsp${/\d{2}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/\D{3}(?=-)/g.exec(`${info.data.dateTime}`)}&nbsp${/(?<=-)-?\d{4}/g.exec(`${info.data.dateTime}`)}`,
    `⚐ : &nbsp${info.data.volcano.country}`,`&nbsp Explosivity index`,`⚡ Damage (M$) ⚡`,`💀 Victims 💀`]
    svgitems = ['LightYellow','Red',8,"blue",20,index[info.data.volcano_explosivity_index],String(info.data.damageAmountOrderLabel),String(info.data.deathsAmountOrderLabel)]
    comments=info.data.comments
    display(keys,labels,svgitems,comments);
    }
  })
  .catch((error) => console.error("erreur du fetch:", error));
}

// data fetched at the beginning of the page
fetchEvent("https://b2nh-api.tintamarre.be/api/v1/events/random");
