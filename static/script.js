// console.log(data)
var year_list =  Array.from(new Set(data.map(function(d) {return d.year;}))); // get unique value 
let select_year = year_list[0]
// var filteredData = data.filter(function(d){return d.year==select_year}); // Make sure "year" matches your data type
// var month_list =  Array.from(new Set(filteredData.map(function(d) {return d.month_of_year;}))); // get unique value 
function createdropyear(year_list){
    let dropdown = d3.select("#dropdown_year");
    dropdown.selectAll("option")
    .data(year_list)
    .enter()
    .append("option")
    .attr('value',(d) => d)
    .text((d) => d)
}
function createdropMonth(select_year,data){
    var filteredData = data.filter(function(d){return d.year==select_year}); // Make sure "year" matches your data type
    let month_list =  Array.from(new Set(filteredData.map(function(d) {return d.quarter_of_year;}))); // get unique value 
    let dropdown_month = d3.select("#dropdown_month");
    dropdown_month.selectAll("option")
    .data(month_list)
    .enter()
    .append("option")
    .attr('value',(d) => d)
    .text((d) => d);
}

function createData(data,countries_data){
    // text_fi(data)
    var selected = d3.select("#dropdown_year").node().value;
        // console.log( selected );
    var selected2 = d3.select("#dropdown_month").node().value;
    var selected3 = d3.select("#type_data").node().value;
    // console.log(selected3)
    // console.log(selected2)
    // console.log(data)
    var dataUse = data.filter(function(d){return d.year==selected && d.quarter_of_year==selected2 && d.category == selected3}) 
    var title_name = dataUse.map(function(d) {return d.show_title;})
    var netflix_top_countries = countries_data.filter(function(d){return d.year==selected && d.quarter==selected2 && d.category == selected3}) 
    var filteredData = netflix_top_countries.filter(item => title_name.includes(item.show_title));
    // console.log(filteredData)
    
    table_id = '#table_1'
    divShowTotal(filteredData,countries_data)
    tabulate(dataUse,table_id)
    map_chart(filteredData)
    var table_top = document.getElementById("table_top");
    // console.log(table_top)
    if (table_top) {
      for (var i = 1; i < table_top.rows.length; i++) {
        table_top.rows[i].onclick = function() {
          // console.log("test")
          editDataMap(this,filteredData)
        };
      }
    }
}

function editDataMap(tableRow,filteredData){
  let selected = d3.select("#dropdown_year").node().value;
  let selected2 = d3.select("#dropdown_month").node().value;
  let selected3 = d3.select("#type_data").node().value;
  let dataRaw = data.filter(function(d){return d.year==selected && d.quarter_of_year==selected2 && d.category == selected3}) 
  let title_name = dataRaw.map(function(d) {return d.show_title;})
  let netflix_top_countries = countries_data.filter(function(d){return d.year==selected && d.quarter==selected2 && d.category == selected3}) 
  let allRawData = netflix_top_countries.filter(item => title_name.includes(item.show_title));
  // console.log(allRawData)

  var name = tableRow.childNodes[1].innerHTML;
  let dataUse = netflix_top_countries.filter(function(d){return d.show_title==name }) 
  // console.log(dataUse)
  d3.select("#world-map").remove()
  d3.select("#show-total").selectAll("div").remove()
  d3.select("#color-legend").remove()
  d3.select("#tooltipMap").remove()
  mapSelectChart(dataUse,allRawData)
  divDetail(dataUse,netflix_top_countries)
  d3.select("#forButton").select("button").style("visibility","visible")
  var styledText = document.createElement("span");
  styledText.innerHTML = `${name.toUpperCase()}`;
  styledText.style.color = "red"; 
  var changeTextElement = document.getElementById("changeText");
  changeTextElement.innerHTML = '';
  changeTextElement.appendChild(styledText);
  changeTextElement.innerHTML += ` IN COUNTRIES AROUND THE WORLD`;
  createLegendTwo()
}

function addRunNumber(array) {
  array.forEach((item, index) => {
      item.run_number = index + 1;
  });
  return array
}

function tabulate(data,table_id) {
  // console.log(data)
  var columns = ['run_number','show_title','weekly_hours_viewed','runtimeMinutes','genres','averageRating']
  let addNoData = addRunNumber(data)
  const formattedData = addNoData.map(item => {
    if (typeof item.weekly_hours_viewed === 'number') {
      item.weekly_hours_viewed = item.weekly_hours_viewed.toLocaleString();
    }
    return item;
  });
  // console.log(formattedData)
	var table = d3.select(table_id).append('table')
	var thead = table.append('thead')
	var	tbody = table.append('tbody');
  var col_name = ['No','title','weekly viewed (hours)','runtime (mins)','genres','Rating']
	// append the header row
  table.attr('id', 'table_top')
	thead.append('tr')
	  .selectAll('th')
	  .data(col_name).enter()
	  .append('th')
	    .text(function (column) { return column; });
	// create a row for each object in the data
	var rows = tbody.selectAll('tr')
	  .data(formattedData)
	  .enter()
	  .append('tr');
    rows.attr('id', 'table_row_top')
	// create a cell in each row for each column
	var cells = rows.selectAll('td')
	  .data(function (row) {
	    return columns.map(function (column) {
	      return {column: column, value: row[column]};
	    });
	  })
	  .enter()
	  .append('td')
	    .text(function (d) {return d.value; });
  return table;
}

function mapSelectChart(filteredData,allRawData) {
    const aggregatedData = d3.rollup(
                filteredData,
                group => d3.sum(group, d => d.Counts),
                d => d.country_name,
                d => d.show_title
            );
    const pieData = Array.from(aggregatedData, ([country, titles]) => ({
                country_name: country,
                titles: Array.from(titles, ([title, counts]) => ({ title, counts })),
            }));
    let forAllCountries = d3.rollup(allRawData,group => d3.sum(group, d => d.Counts),
              d => d.country_name,
              d => d.show_title
          );
    let dataMap2 = Array.from(forAllCountries, ([country, titles]) => ({
              country_name: country,
              titles: Array.from(titles, ([title, counts]) => ({ title, counts })),
          }));
    
    const margin = {
        top: 50,
        right: 10,
        bottom: 50,
        left: 100,
      },
      width = 1230 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;
    const worldmap = d3
      .select('#map-container')
      .append('svg')
      .attr('class', 'container')
      .attr('id', 'world-map')
      .attr(
        'width',
        width + margin.left + margin.right
      )
      .attr(
        'height',
        height + margin.top + margin.bottom
      )
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left},${margin.top})`
      )
    const projection = d3
      .geoMercator()
      .center([10, -9]) // GPS of location to zoom on
      .scale(240) // This is like the zoom
    const tooltip = d3     // create tooltip
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .attr('id', 'tooltipMap')
      .style('opacity', 0);
    // Draw map
    d3.json("https://raw.githubusercontent.com/Thanakron1997/map-json/main/world2.geojson").then(function (topodata) {
      const p = worldmap.selectAll('path')
                .data(topodata.features);
      p.join('path').attr('fill', '#b8b8b8')
      .attr('d',d3.geoPath().projection(projection))
      .style("fill", d => {
                          // Match the country_name from your data with the GeoJSON features
                          const countryData = pieData.find(item => item.country_name === d.properties.NAME);
                          let countryData2 = dataMap2.find(item => item.country_name === d.properties.NAME);
                          if (countryData) {
                              return "red"; // Use the color scale here
                          } else {
                            if (countryData2) {
                              return "blue";
                            } else {
                              return "rgba(200,200,200,0.6)";
                             } // Default to gray if no data
                          }
                          })
      .style('stroke', 'rgba(0,0,0,1)')
      .style("stroke-width", 1)
      // .style('opacity', 0.4)
      .on('mouseover', function (event, d) {
          tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
          tooltip.html(
            `<strong><span style="font-size: 13px;">Country : ${d.properties.NAME}</span></strong>
            ${getTitlesData(d,pieData)}
            `)
            .style(
              'left',event.pageX - 40 + 'px'
            )
            .style(
              'top',event.pageY - 30 + 'px'
            );
          d3.select(this).style('stroke', 'rgba(0,0,0,1)')
          .style("stroke-width", 1)
          .style('opacity', 1);
          })
        .on('mouseout', function (d) {
          tooltip.transition()
          .duration(500)
          .style('opacity', 0);
          d3.select(this).style('stroke', 'rgba(0,0,0,1)')
          .style("stroke-width", 1)
        // .style('opacity', 0.4)]
        ;
        });
    });
    const zoom = d3.zoom()
    .scaleExtent([1, 8]) // Set the minimum and maximum zoom levels
    .on("zoom", zoomed);
  // Apply the zoom behavior to your map container
  worldmap.call(zoom);
  // Function to handle zooming
  function zoomed(event) {
      const { transform } = event;
      worldmap.selectAll("path")
          .attr("transform", transform);
  }
}

function map_chart(filteredData) {
    const aggregatedData = d3.rollup(
                filteredData,
                group => d3.sum(group, d => d.Counts),
                d => d.country_name,
                d => d.show_title
            );
    const pieData = Array.from(aggregatedData, ([country, titles]) => ({
                country_name: country,
                titles: Array.from(titles, ([title, counts]) => ({ title, counts })),
            }));
    // console.log(pieData)
    const margin = {
        top: 50,
        right: 10,
        bottom: 50,
        left: 100,
      },
      width = 1230 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;
    const worldmap = d3
      .select('#map-container')
      .append('svg')
      .attr('class', 'container')
      .attr('id', 'world-map')
      .attr(
        'width',
        width + margin.left + margin.right
      )
      .attr(
        'height',
        height + margin.top + margin.bottom
      )
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left},${margin.top})`
      )
    const color_scale = d3.scaleLinear()
    // .domain([0, 5, 10])  // Three values in the domain for three colors
    // .range(["white", "yellow", "red"]);
    .domain([0,5, 10]).range(["blue", "white","red"]);
    // console.log(color_scale(0))
    //   .style('border', 'solid');
    const projection = d3
      .geoMercator()
      .center([10, -9]) // GPS of location to zoom on
      .scale(240) // This is like the zoom
    //   .translate([width / 2, height / 2]);
    // create tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .attr('id', 'tooltipMap')
      .style('opacity', 0);

    // Draw map
    d3.json("https://raw.githubusercontent.com/Thanakron1997/map-json/main/world2.geojson").then(function (topodata) {
      const p = worldmap
        .selectAll('path')
        .data(topodata.features);
      p.join('path')
        .attr('fill', '#b8b8b8')
        .attr('d',d3.geoPath().projection(projection))
        // .style('fill', 'blue')
        .style("fill", d => {
                        // Match the country_name from your data with the GeoJSON features
                        const countryData = pieData.find(item => item.country_name === d.properties.NAME);
                        // console.log(countryData)
                        if (countryData) {
                            let scaleColor_i = countryData.titles.length
                            // console.log(countryData.titles.length)
                            return color_scale(scaleColor_i)
                            // return "red"; // Use the color scale here
                        } else {
                            return "rgba(200,200,200,0.6)"; // Default to gray if no data
                        }
                    })
        .style('stroke', 'rgba(0,0,0,1)')
        .style("stroke-width", 1)
        // .style('opacity', 0.4)
        .on('mouseover', function (event, d) {
          // console.log(d.properties.name);
          tooltip
            .transition()
            .duration(200)
            .style('opacity', 0.9);
          tooltip
            .html(`<strong><span style="font-size: 13px;">Country : ${d.properties.NAME}</span></strong>
            ${getTitlesData(d,pieData)}
            `)
            .style(
              'left',
              event.pageX - 40 + 'px'
            )
            .style(
              'top',
              event.pageY - 30 + 'px'
            );
          d3.select(this)
            .style('stroke', 'rgba(0,0,0,1)')
        .style("stroke-width", 1)
            .style('opacity', 1);
        })
        .on('mouseout', function (d) {
          tooltip
            .transition()
            .duration(500)
            .style('opacity', 0);
          d3.select(this)
            .style('stroke', 'rgba(0,0,0,1)')
        .style("stroke-width", 1)
            ;
        });
    });

    const zoom = d3.zoom()
    .scaleExtent([1, 8]) // Set the minimum and maximum zoom levels
    .on("zoom", zoomed);

// Apply the zoom behavior to your map container
worldmap.call(zoom);

// Function to handle zooming
function zoomed(event) {
    const { transform } = event;
    worldmap.selectAll("path")
        .attr("transform", transform);
}
}
function getCountryCount(filteredData){
  let countryCounts = {};
  filteredData.forEach(function (obj) {
      let countryName = obj.country_name;
      if (countryCounts[countryName]) {
          countryCounts[countryName] += 1;
      } else {
          countryCounts[countryName] = 1;
      }
    });
    let countryCountsArray = Object.entries(countryCounts);
    countryCountsArray.sort(function (a, b) {
      return b[1] - a[1];
  });
  return countryCountsArray
}

function divShowTotal(filteredData,data){
  var selected3 = d3.select("#type_data").node().value;
  var uniCountry = Array.from(new Set(filteredData.map(function(d) {return d.country_name;})));
  var uniAllCountry = Array.from(new Set(data.map(function(d) {return d.country_name;})));
  // console.log(data)
  // console.log(filteredData)
  var countryCountsArray = getCountryCount(filteredData);
  // console.log(countryCountsArray)
  let selectedData = countryCountsArray.filter(item => item[1] === 10);
    // console.log(selectedData)
  let slicedArray = countryCountsArray.slice(0, 5);
  let countriesToShow = selectedData.map(item => item[0])
    // console.log(slicedArray)
    let result = "";

    if (countriesToShow.length === 1) {
        result += countriesToShow[0]; // Only one item, no 'and'
    } else if (countriesToShow.length > 1) {
        result += countriesToShow.slice(0, -1).join(', ') + ', and ' + countriesToShow[countriesToShow.length - 1];
    }
    var showTotal = d3.select('#show-total');
    
    if (countriesToShow.length >0){
      showTotal.append('div').style('text-align', 'center')
      .style('font-family', 'Netflix Sans,Helvetica Neue,Helvetica,Arial').html(`<strong><span style="font-size: 15px; ">The countries ${countriesToShow.length} of ${uniCountry.length} countries watch all ${selected3} in the top 10 global</span></strong>`)
      showTotal.append('div')
      .style('overflow', 'auto')
      .style('height', '130px')
      .style('font-family', 'Netflix Sans,Helvetica Neue,Helvetica,Arial')
      .html(`<span style="font-size: 11px;">The Countries that watch all the top 10 global are ${result}</span>`)
    } else {
      showTotal.append('div').style('text-align', 'center')
      .style('font-family', 'Netflix Sans,Helvetica Neue,Helvetica,Arial')
      .html(`<strong><span style="font-size: 15px; ">No country in these ${uniCountry.length} countries has watched all ${selected3} in the top 10 global</span></strong>`)
    }
    
}

function divDetail(filteredData,netflix_top_countries){
  var selected3 = d3.select("#type_data").node().value;
  var uniCountry = Array.from(new Set(filteredData.map(function(d) {return d.country_name;})));
  var uniAllCountry = Array.from(new Set(netflix_top_countries.map(function(d) {return d.country_name;})));
  var title =  Array.from(new Set(filteredData.map(function(d) {return d.show_title;}))); // get unique value 
  // console.log(title)
  // console.log(uniCountry)
  // console.log(data)
  let result = "";

  if (uniCountry.length === 1) {
      result += uniCountry[0]; // Only one item, no 'and'
  } else if (uniCountry.length > 1) {
      result += uniCountry.slice(0, -1).join(', ') + ', and ' + uniCountry[uniCountry.length - 1];
  }
  var showTotal = d3.select('#show-total');
  if (uniCountry.length >0) {
  showTotal.append('div').style('text-align', 'center')
  .style('font-family', 'Netflix Sans,Helvetica Neue,Helvetica,Arial')
  .html(`<strong> <span style="font-size: 15px;">The countries ${uniCountry.length} of ${uniAllCountry.length} countries watching "${title}"</span></strong>`)
  showTotal.append('div').style('overflow', 'auto')
  .style('height', '130px')
  .style('font-family', 'Netflix Sans,Helvetica Neue,Helvetica,Arial')
  .html(`<span style="font-size: 10px;">The Countries that watching ${title} are ${result}</span>`)
  } else{
  showTotal.append('div').style('text-align', 'center')
  .style('font-family', 'Netflix Sans,Helvetica Neue,Helvetica,Arial')
  .html(`<strong> <span style="font-size: 15px;">No country watching "${title}"</span></strong>`)
  }
  
}

function getTitlesData(d,pieData) {
    var matchingItem = pieData.find(item => item.country_name === d.properties.NAME);
    const titles = matchingItem ? matchingItem.titles : [];
    if (titles.length > 0) {
    var textRepresentation = `<table id="table2">
    <tr>
      <th>Name</th>
      <th>Weeks</th>
    </tr>`;
    // Iterate through the array and format each object
    titles.forEach((item, index) => {
        textRepresentation += 
        `<tr>
        <td> ${item.title}</td> 
    <td style="text-align: center;">${item.counts}</td>
        <tr> `;
        // Add a line break except for the last item
        if (index < titles.length - 1) {
            textRepresentation += '';
        }
    });
    textRepresentation += '</table>'
    return textRepresentation
    } else {
        return ""
    }
}


document.addEventListener('DOMContentLoaded',function(){
    createdropyear(year_list)
    createdropMonth(select_year,data)
    createData(data,countries_data)
    createLegend()
    d3.select("#dropdown_year")
    .on("change",function(){
        d3.select("#dropdown_month").selectAll("option").remove()
        d3.select("#show-total").selectAll("div").remove()
        d3.select("#table_1").select("table").remove()
        d3.select("#world-map").remove()
        d3.select("#tooltipMap").remove()
        d3.select("#color-legend").remove()
        d3.select("#forButton").select("button").style("visibility","hidden")
        createLegend()
        createdropMonth(this.value,data)
        createData(data,countries_data)
        document.getElementById("changeText").innerHTML = "GLOBAL TOP 10 IN COUNTRIES AROUND THE WORLD";

    });
    d3.select("#dropdown_month")
    .on("change",function(){
        d3.select("#table_1").select("table").remove()
        d3.select("#show-total").selectAll("div").remove()
        d3.select("#world-map").remove()
        d3.select("#tooltipMap").remove()
        d3.select("#color-legend").remove()
        d3.select("#forButton").select("button").style("visibility","hidden")
        createLegend()
        createData(data,countries_data)
        document.getElementById("changeText").innerHTML = "GLOBAL TOP 10 IN COUNTRIES AROUND THE WORLD";

        
    });
    d3.select("#type_data")
    .on("change",function(){
        d3.select("#table_1").select("table").remove()
        d3.select("#show-total").selectAll("div").remove()
        d3.select("#world-map").remove()
        d3.select("#tooltipMap").remove()
        d3.select("#color-legend").remove()
        d3.select("#forButton").select("button").style("visibility","hidden")
        createLegend()
        createData(data,countries_data)
        document.getElementById("changeText").innerHTML = "GLOBAL TOP 10 IN COUNTRIES AROUND THE WORLD";

    });
    d3.select("#forButton")
    .append("button")
    .text("Clear Data")
    .style("font-family","Netflix Sans,Helvetica Neue,Helvetica,Arial")
    .style("border","solid 5px rgba(255, 255, 255, 1)")
    .style("background-color","rgba(255, 255, 255, 0)")
    .style("opacity","0.7")
    .style("color","rgba(255, 255, 255, 1)")
    .style("border-radius","10px")
    .style("visibility","hidden")
    .on("click", function() {
      d3.select("#table_1").select("table").remove()
      d3.select("#show-total").selectAll("div").remove()
      d3.select("#world-map").remove()
      d3.select("#tooltipMap").remove()
      d3.select("#color-legend").remove()
      createData(data,countries_data)
      createLegend()
      d3.select("#forButton").select("button").style("visibility","hidden")
      document.getElementById("changeText").innerHTML = "GLOBAL TOP 10 IN COUNTRIES AROUND THE WORLD";
    });

})
function createLegend(){
// Define the SVG element
let div = d3.select("#legendDiv").append('svg')
.attr('id', 'color-legend').attr("width", 200)
.attr("height", 70);
var svg = d3.select("#color-legend");
// Define tick values
var tickValues = [0,1,2,3,4,5,6,7,8,9,10];
// Define the color scale
var colorScale =  d3.scaleLinear()
// .domain([0, 5, 10])  // Three values in the domain for three colors
// .range(["white", "yellow", "red"]);
.domain([0, 5,10]).range(["blue","white", "red"]);
// Calculate the width for each color segment
var segmentWidth = 180 / tickValues.length;
// Create color segments with associated text labels
tickValues.forEach(function (tickValue, index) {
    var xPos = index * segmentWidth + 10;
    // Add a color segment
    svg.append("rect")
    .attr("x", xPos)
    .attr("y", 20)
    .attr("width", segmentWidth)
    .attr("height", 20)
    .style("fill", colorScale(tickValue));
    // Add a text label
    svg.append("text")
    .attr("x", xPos + segmentWidth / 2)
    .attr("y", 50)
    .text(tickValue)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("fill", "white")
    .style("font-size","7px");
  });
// Add a title with a custom text color
svg.append("text")
.attr("x", 100)
.attr("y", 10)
.text("Total Titles Legend")
.attr("text-anchor", "middle")
.attr("alignment-baseline", "middle")
.style("font-weight", "bold")
.style("font-size","11px")
.style("fill", "white"); // Customize the title text color
svg.append("rect")
.attr("x", 10)
.attr("y", 20)
.attr("width", 180)
.attr("height", 20)
.style("fill", "none")
.style("stroke", "black")
.style('opacity', 0.4)
.style("stroke-width", 1);
}

function createLegendTwo(){
    // Set up the SVG container
  var svg = d3.select("#legendDiv").append("svg")
  .attr('id', 'color-legend')
  .attr("width", 200)
  .attr("height", 50);
  var colorScale = d3.scaleOrdinal()
    .domain(["Not Watching", "Watching"])
    .range(["blue", "red"]);

  // Create the legend
  var legend = svg.selectAll(".legend")
    .data(colorScale.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(" + i * 110 + ",0)"; });

    svg.append("text")
    .attr("x", 100)
    .attr("y", 10)
    .text("Watching Legend")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-weight", "bold")
    .style("font-size","11px")
    .style("fill", "white");
  // Add rectangles for each color in the legend
  legend.append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", 10)
    .attr("y", 20)
    .style("fill", colorScale);

  // Add text labels for each color in the legend
  legend.append("text")
    .attr("x", 40)
    .attr("y", 27)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d) { return d; })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("fill", "white")
    .style("font-size","9px");
  svg.append("rect")
  .attr("x", 10)
  .attr("y", 20)
  .attr("width", 20)
  .attr("height", 20)
  .style("fill", "none")
  .style("stroke", "white")
  .style('opacity', 0.5)
  .style("stroke-width", 1);
  svg.append("rect")
  .attr("x", 120)
  .attr("y", 20)
  .attr("width", 20)
  .attr("height", 20)
  .style("fill", "none")
  .style("stroke", "white")
  .style('opacity', 0.5)
  .style("stroke-width", 2);
}