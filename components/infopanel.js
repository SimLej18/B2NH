//--------------------------------------------------------Panels toggle and navigation-------------------------------------------------

//sert pour les volcans pour leur indice d'explosivité
let index = ["Effusive", "Gentle", "Explosive", "Catastrophic", "Cataclysmic", "Paroxysmic", "Colossal", "Super-colossal", "Mega-colossal"]

//functions to display or not Infopanel
function infopanelAnchorClick() {
  $('.infopanelBody').toggle();
}

//toggle for related events and commentary
$(".subinfopaneltoggle").click(function () {

  if ($(this).is('#togglerelations')) {
    if ($("#relations").is(":visible")) {
      $(this).html('Show related events')
      $('#relations,#infos,#togglecommentary').toggle();
    } else {
      $(this).html('Close')
      $('#infos,#togglecommentary,#relations').toggle();
    }
  }
  if ($(this).is('#togglecommentary')) {
    if ($('#commentary').is(":visible")) {
      $(this).html('Description')
      $(".infopanelBody").css({
        "max-width": "28vh"
      })
      $('#commentary, #infos, #togglerelations').toggle();
    } else {
      $(this).html('Close')
      $(".infopanelBody").css({
        "max-width": "50vh"
      })
      $('#infos, #togglerelations, #commentary').toggle();

    }
  }
})

//go to the chosen related event
function GoToRelatedEarthquake(id) {
  updateInfoPanel("https://b2nh-api.tintamarre.be/api/v1/events/earthquake/" + id)
}
//go to the chosen related event
function GoToRelatedTsunami(id) {
  updateInfoPanel("https://b2nh-api.tintamarre.be/api/v1/events/tsunami/" + id)
}

//go to the chosen related eruption
function GoToRelatedEruption(id) {
  updateInfoPanel("https://b2nh-api.tintamarre.be/api/v1/events/eruption/" + id)
}

// This function is called when the user clicks on the button of an event
function updateInfoPanel(url_of_event) {
  if ($('.infopanelBody').is(":hidden")) {
    $('.infopanelBody').toggle()
  }
  if ($("#commentary").is(":visible")) {
    $(".infopanelBody").css({
      "max-width": "28vh"
    })
    $('#commentary').toggle()
    $('#togglecommentary').html('Description')
    selectedEvent = url_of_event;
    fetchEvent(selectedEvent);
    $(`#infos`).fadeToggle();
    $('#togglerelations').toggle();

  } else if ($('#relations').is(':visible')) {
    $('#relations').toggle()
    $('#togglerelations').html('Show related events')
    selectedEvent = url_of_event;
    fetchEvent(selectedEvent);
    $(`#infos`).fadeToggle();
    $(`#togglecommentary`).toggle();

  } else {
    $('#infos').fadeToggle(50);
    $('#togglecommentary').fadeToggle(50);
    $('#addDestination').fadeToggle(50);
    $('#togglerelations').fadeToggle(50);
    fetchEvent(url_of_event);
    // console.log(url_of_event);
    $('#infos').fadeToggle();
    $('#togglecommentary').fadeToggle();
    $('#addDestination').fadeToggle();
    $('#togglerelations').fadeToggle();
  }
}

//----------------------------------------------------------------Info writing---------------------------------------------------------



function display(info, keys, labels, svgitems, comments, relations, volcano) {
  //write infos
  for (i = 0; i < 7; i++) {
    $(`#element${i}`).html(``)
  }
  j = 1
  for (i = 0; i < keys.length; i++) {
    if (keys[i] != (null || "unknown")) {
      $(`#element${j}`).html(labels[i])
      if (i == 3) {
        drawbar(svgitems, keys[i], `#element${j}`)
      }
      if (i == 4) {
        drawdamage(svgitems, keys[i], `#element${j}`)
      }
      if (i == 5) {
        drawdeath(svgitems, keys[i], `#element${j}`)
      }
      j++
    }
  }

  //write commentary
  $('#commentary').html(comments)

  //write related events
  relationType = ["Earthquake", "Tsunami", "Eruption"]
  $('.relation').remove()
  for (i = 0; i < 3; i++) {

    if (relations[i] != 0) {
      $(`#relations`).append($(`<button class="panelbutton relation" onclick=GoToRelated${relationType[i]}(${relations[i]})></button>`)
        .html(`${relationType[i]}`)
      )
    }
  }
  if (volcano != null) {
    $(`#relations`).append($(`<p class="relation"></p>`).html("List of all eruptions of :"))
    $(`#relations`).append($(`<p id=volcanoVEI class="relation"></p>`).html(`🌋Volcano : ${volcano.data.name}🌋`))

    for (i = 0; i < volcano.data.events_count; i++) {
      $(`#relations`).append($(`<p id=relatedEruption${(i)*4} class="panelbutton relation" onclick=GoToRelatedEruption(${volcano.data.volcano_events[i].id})></p>`)
        .html(`🕐 : &nbsp${volcano.data.volcano_events[i].dateTimeForInfoPanel}`))

      svgitems2 = ['LightYellow', 'Red', 8, "blue", 20, index[volcano.data.volcano_events[i].volcano_explosivity_index],
        `${/null|Limited|Moderate|Severe|Extreme/g.exec(`${volcano.data.volcano_events[i].damageAmountOrderLabel}`)}`,
        `${redeaths=/null|Few|Some|Many|Very Many/g.exec(`${volcano.data.volcano_events[i].deathsAmountOrderLabel}`)}`
      ]

      $(`#relations`).append($(`<p id=relatedEruption${i*4+1} class="relation"></p>`))
      drawbar(svgitems2, keys[3], `#relatedEruption${i*4+1}`)
      $(`#relations`).append($(`<p id=relatedEruption${(i)*4+2} class="relation">⚡(M$)</p>`))
      drawdamage(svgitems2, volcano.data.volcano_events[i].damageAmountOrder, `#relatedEruption${(i)*4+2}`)
      $(`#relations`).append($(`<p id=relatedEruption${(i)*4+3} class="relation">💀</p>`))
      drawdeath(svgitems2, volcano.data.volcano_events[i].deathsAmountOrder, `#relatedEruption${(i)*4+3}`)
    }
  }
}



// function used to draw the coloured svg bar
function drawbar(svgitems, keys, place) {

  var svg = d3.select(place).append("svg").attr("width", "100%").attr("height", "42px")
  var size = svgitems[4]
  var data = Array.from({
    length: svgitems[2]
  }, (_, i) => i + 1)
  var myColor = d3.scaleLinear().domain([1, svgitems[2]]).range([svgitems[0], svgitems[1]])
  svg.selectAll(".firstrow").data(data).enter().append("rect")
    .attr("x", function (d, i) {
      return 15 + size * i
    }).attr("y", 10)
    .attr("width", size).attr("height", 10).attr("fill", function (d) {
      return myColor(d)
    })
  svg.append('rect').attr("x", 15 + keys * size).attr("y", 10).attr("width", 2).attr("height", 11).attr("fill", 'rgb(196, 252, 251)')
  svg.append('text').text("0").attr("x", 0).attr("y", 17).attr("dy", ".35em").style('fill', 'rgb(196, 252, 251)')
  svg.append('text').text(String(svgitems[2])).attr("x", size * (svgitems[2]) + 20).attr("y", 17).attr("dy", ".35em").style('fill', 'rgb(196, 252, 251)')
  svg.append('text').text(String(svgitems[5])).attr("x", keys * size).attr("y", 35).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  d3
}

//function to draw death svg bar
function drawdeath(svgitems, keys, place) {
  var svg = d3.select(place).append("svg").attr("width", "100%").attr("height", "46px")
  var size = 40
  if (keys == 0) {
    cursorx = 15
  } else {
    cursorx = keys * size - 5
  }
  var data = [1, 2, 3, 4]
  var myColor = d3.scaleLinear().domain([1, 4]).range(["white", "black"])
  svg.selectAll(".firstrow").data(data).enter().append("rect")
    .attr("x", function (d, i) {
      return 15 + size * i
    }).attr("y", 16)
    .attr("width", size).attr("height", 10).attr("fill", function (d) {
      return myColor(d)
    })
  svg.append('rect').attr("x", cursorx).attr("y", 16).attr("width", 2).attr("height", 11).attr("fill", 'red')
  svg.append('text').text("0").attr("x", 15).attr("y", 13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text("50").attr("x", 55).attr("y", 13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text("100").attr("x", 95).attr("y", 13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text("1000+").attr("x", 135).attr("y", 13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text(svgitems[7]).attr("x", cursorx).attr("y", 37).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
}

//function to draw damage svg bar
function drawdamage(svgitems, keys, place) {
  var svg = d3.select(place).append("svg").attr("width", "100%").attr("height", "41px")
  var size = 40
  if (keys == 0) {
    cursorx = 15
  } else {
    cursorx = keys * size - 5
  }
  var data = [1, 2, 3, 4]
  var myColor = d3.scaleLinear().domain([1, 4]).range(["LightYellow", "DarkOrange"])
  svg.selectAll(".firstrow").data(data).enter().append("rect")
    .attr("x", function (d, i) {
      return 15 + size * i
    }).attr("y", 16)
    .attr("width", size).attr("height", 10).attr("fill", function (d) {
      return myColor(d)
    })
  svg.append('rect').attr("x", cursorx).attr("y", 16).attr("width", 2).attr("height", 11).attr("fill", 'red')
  svg.append('text').text("0").attr("x", 15).attr("y", 13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text("1").attr("x", 55).attr("y", 13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text("5").attr("x", 95).attr("y", 13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text("25+").attr("x", 135).attr("y", 13).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
  svg.append('text').text(svgitems[6]).attr("x", cursorx).attr("y", 37).style('fill', 'rgb(196, 252, 251)').style("font-size", "12px")
}

//----------------------------------------------------------------------------------fetching the infos------------------------------------------------------------------------------------------------


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
      // console.log(info);
      redamage = /null|Limited|Moderate|Severe|Extreme/g;
      redeaths = /null|Few|Some|Many|Very Many/g;

      if (info.data.type == "earthquake") {
        keys = ["name", info.data.dateTime, info.data.country, info.data.eqMagnitude, info.data.damageAmountOrder, info.data.deathsAmountOrder]
        labels = ["🌏Earthquake🌏", `🕐 : ${info.data.dateTimeForInfoPanel}`,
          `⚐ : ${info.data.country}`, `&nbsp Earthquake Magnitude `, `⚡ Damage (M$) ⚡ `, `💀 Victims 💀 `
        ]
        svgitems = ['LightYellow', 'green', 10, "red", 16, info.data.eqMagnitude, `${redamage.exec(`${info.data.damageAmountOrderLabel}`)}`, `${redeaths.exec(`${info.data.deathsAmountOrderLabel}`)}`]
        relations = [0, info.data.tsunamiEventId, info.data.volcanoEventId]
      }

      if (info.data.type == "tsunami") {
        keys = ["name", info.data.dateTime, info.data.country, info.data.tis, info.data.damageAmountOrder, info.data.deathsAmountOrder]
        labels = ["🌊Tsunami🌊", `🕐 : ${info.data.dateTimeForInfoPanel}`,
          `⚐ : ${info.data.country}`, `&nbsp &nbsp Tsunami intensity`, `⚡ Damage (M$) ⚡`, `💀 Victims 💀`
        ]
        svgitems = ['LightBlue', 'Blue', 10, "red", 16, info.data.tis, `${redamage.exec(`${info.data.damageAmountOrderLabel}`)}`, `${redeaths.exec(`${info.data.deathsAmountOrderLabel}`)}`]
        relations = [info.data.earthquakeEventId, 0, info.data.volcanoEventId]
      }

      if (info.data.type == "eruption") {

        keys = [info.data.volcano.name, info.data.dateTime, info.data.country, info.data.volcano_explosivity_index, info.data.damageAmountOrder, info.data.deathsAmountOrder]
        labels = [`🌋Volcano : &nbsp ${info.data.volcano.name}🌋`, `🕐 : ${info.data.dateTimeForInfoPanel}`,
          `⚐ : ${info.data.volcano.country}`, `&nbsp Volcano Explosivity index`, `⚡ Damage (M$) ⚡`, `💀 Victims 💀`
        ]
        svgitems = ['LightYellow', 'Red', 8, "blue", 20, index[info.data.volcano_explosivity_index], `${redamage.exec(`${info.data.damageAmountOrderLabel}`)}`, `${redeaths.exec(`${info.data.deathsAmountOrderLabel}`)}`]
        relations = [info.data.earthquakeEventId, info.data.tsunamiEventId, 0]
      }

      comments = info.data.comments

      selectedEvent = info.data
      updateCircuitButton()
      if (info.data.type == "eruption") {
        fetch(`https://b2nh-api.tintamarre.be/api/v1/volcanoes/${info.data.volcano.id}`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Pas de réponse de l'API");
            }
          }).then(volcano => {
            // console.log(volcano),
              display(info, keys, labels, svgitems, comments, relations, volcano)
          })


      } else {
        if ((info.data.type == "tsunami" | info.data.type == "earthquake")) {
          volcano = null
          display(info, keys, labels, svgitems, comments, relations, volcano)
        }
      }
    })


    .catch((error) => console.error("erreur du fetch:", error));
}

// data fetched at the beginning of the page
fetchEvent("https://b2nh-api.tintamarre.be/api/v1/events/random");