var year_list =  Array.from(new Set(data.map(function(d) {return d.year;}))); 
// console.log(data)
function createdropyear(year_list){
    let dropdown = d3.select("#dropdown_year");
    dropdown.selectAll("option")
    .data(year_list)
    .enter()
    .append("option")
    .attr('value',(d) => d)
    .text((d) => d)
}

function getIndex(myArray){
    let indices = [];
    for (let i = 0; i < myArray.length; i++) {
    indices.push(i);
    }
    return indices
}
function unique_index(index_,array_index){
    let list_index = []
    for (let i = 0; i < index_.length; i++) {
        let data_i = index_[i]
        let in_ = array_index.indexOf(data_i);
        list_index.push(in_);
    }
    return list_index
}
function createDirector(director_data){
    // console.log(director_data)
    var selected = d3.select("#dropdown_year").node().value;
    var selected2 = d3.select("#type_data").node().value;
    var dataUse = director_data.filter(function(d){return d.year==selected && d.category == selected2})
    // table_id = '#table_1'
    var quarterList = ['Q1','Q2','Q3','Q4']
    var tableIdList = ['q1','q2','q3','q4']
    for (let i = 0; i < quarterList.length; i++) {
        // text += cars[i] + "<br>";
        let quarter_i = quarterList[i]
        let table_i = tableIdList[i]
        // createTableQ(dataUse,quarter_i,table_i)
      xxxss(dataUse,quarter_i,table_i)

        
      }
}

function xxxss(dataUse,quarter,table_id){
let data_q = dataUse.filter(function(d){return d.quarter==quarter})
if (data_q.length >0) {
let One = 0;       // Initialize "One" variable
let moreThan = 0;  // Initialize "more than" variable

let test1 = data_q.map(function(d) {return d.count;})
for (let i of test1) {
    if (i === 1) {
        One += 1;
    } else {
        moreThan += 1;
    }
}
if (moreThan >0) {
    var rawData = [{y:One,indexLabel: "Direct \nOne Movie",color: "rgba(255, 0, 0, 1)"},
                {y:moreThan,indexLabel:"Direct \nMore Then One Movies",color: "rgba(0, 0, 0, 1)"}]
} else {
    var rawData = [{y:One,indexLabel: "Direct \nOne Movie",color: "rgba(255, 0, 0, 1)"}]
}

// console.log(rawData)
let new_id = '#' + table_id
let testdiv = 'Qtest' + table_id
let pieDiv = d3.select(new_id);
    pieDiv.append('div')
    .attr('id', testdiv)
    .style('position', 'absolute')
    .style('left', '0')
    .style('top', '0')
    .style('padding-left', '26px')
    .style('padding-top', '50px')



    // position: absolute;
//   right: 0;
createPie(testdiv,rawData)

} else {
    let new_id = '#' + table_id
        console.log(new_id)
    let errorDiv = d3.select(new_id);
    errorDiv.append('div')
    .attr('id', 'no_data')
    .style('padding-top', '100px')
    .html(`<strong><span
    style="text-align: center;
    font-size: 20px;
    font-family: Netflix Sans,Helvetica Neue,Helvetica,Arial;
    ">No Data</span></strong>`)
}

function createPie(table_id,rawData){
    var chart = new CanvasJS.Chart(table_id,
	{       
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        width: 300,
        height: 230,
        toolTip: {
            shared: true
          },
          axisY:{
            fontColor: "red",

    
          },
		data: [
		{
            // showInLegend: true,
            toolTipContent: "{y} - #percent %",
            labelFontColor: "rgba(255, 255, 255, 0.6)",
			yValueFormatString: "# Directors",
			type: "pie",
			// legendText: "{indexLabel}",
			dataPoints: rawData,
            indexLabelFontColor: "rgba(255, 255, 255, 0.6)" 
		}
		]
	});
	chart.render();
}

}
function createTableQ(dataUse,quarter,table_id){
    let data_q = dataUse.filter(function(d){return d.quarter==quarter})
    // console.log(data_q)
    if (data_q.length >0) {
        let table = d3.select(table_id).append('table')
	let thead = table.append('thead')
	let	tbody = table.append('tbody');
    let column = ['directors_name','count']
    let col_name = ['Director Name','Total']
	// append the header row
  table.attr('id', 'table_quarter')
	thead.append('tr')
	  .selectAll('th')
	  .data(col_name).enter()
	  .append('th')
	    .text(function (column) { return column; });
	// create a row for each object in the data
	let rows = tbody.selectAll('tr')
	  .data(data_q)
	  .enter()
	  .append('tr');
	// create a cell in each row for each column
	let cells = rows.selectAll('td')
	  .data(function (row) {
	    return column.map(function (column) {
	      return {column: column, value: row[column]};
	    });
	  })
	  .enter()
	  .append('td')
	    .text(function (d) { return d.value; });
  return table;
    } else {
        let new_id = '#' + table_id
        console.log(new_id)
        let errorDiv = d3.select(new_id);
        errorDiv.append('div')
        .attr('id', 'no_data')
        .style('padding-top', '100px')
        .html(`<strong><span
        style="text-align: center;
        font-size: 20px;
        font-family: Netflix Sans,Helvetica Neue,Helvetica,Arial;
        ">No Data</span></strong>`)
    }
    
}
function createData(data){
    var selected = d3.select("#dropdown_year").node().value;
    var selected2 = d3.select("#type_data").node().value;
    var dataUse = data.filter(function(d){return d.year==selected && d.category == selected2}) 
    let len = dataUse.length;
    list_dimen = ['quart_years','averageRating','Revenue','quarter_view','runtimeMinutes','top1','top2','top3']
    list_col = ['Quarter','Rating', 'Revenue','Views','Runtime', 'Top 1 Genre','Top 2 Genre','Top 3 Genre']
    var lsDimensions = []
    for (let i = 0; i < list_dimen.length; i++) {
        let dict = {
        };
        dimention_i = list_dimen[i]
        dict["label"] = list_col[i] ;
        let di_data = dataUse.map(function(data){return data[dimention_i];});
        if (dimention_i == 'quart_years' || dimention_i == 'top1' || dimention_i == 'top2' || dimention_i == 'top3'){
            let uni_data =  Array.from(new Set(dataUse.map(function(data) {return data[dimention_i];})));
            if (dimention_i == 'quart_years'){
                uni_data.sort((a, b) => b.localeCompare(a)) // sort localtion
            }
            // unique_index(index_,array_index)
            let listIndex = getIndex(uni_data)
            // console.log(listIndex)
            dict["range"] = [Math.min.apply(Math, getIndex(uni_data)),Math.max.apply(Math, getIndex(uni_data))]
            dict["values"] = unique_index(di_data,uni_data)
            dict['tickvals'] = listIndex
            dict['ticktext'] = uni_data
        } else{
            dict["range"] = [Math.floor(Math.min.apply(Math, di_data)),Math.ceil(Math.max.apply(Math, di_data))]
            dict["values"] = di_data
        }
        lsDimensions.push(dict);
    }
    // console.log(lsDimensions)
    var trace = {
        type: 'parcoords',
        // labelside: "bottom",
        labelfont: {
            size: 18,
            color: 'red',
        },
        line: {
          color: 'red',
          colorbar: {
            title: {
                side: "right",
            }
          }
          
        },
        
        dimensions:lsDimensions};
    var data_col = [trace]
    var layout = { 
        width: 1200, 
        height: 500, 
        margin: { t: 50, b: 50 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: {color: 'rgba(255,255,255,1)',size:12},
    title: {
        pad : {
            b: 100,
        }
    }
    };
    const config = {
        displayModeBar: false,
      };
    Plotly.newPlot('myDiv', data_col,layout,config);
}

document.addEventListener('DOMContentLoaded',function(){
    createdropyear(year_list)
    createData(data)
    createDirector(director_data)
    d3.select("#dropdown_year")
    .on("change",function(){
        createData(data)
        d3.selectAll("#table_quarter").remove()
        d3.selectAll("#no_data").remove()
        createDirector(director_data)
        test()
    });
    d3.select("#type_data")
    .on("change",function(){
        createData(data)
        d3.selectAll("#table_quarter").remove()
        d3.selectAll("#no_data").remove()
        createDirector(director_data)
        test()
    });
    test()

    
})

