function test(){
    let lstCat = ['TV', 'Films', 'All'];
let dfListRaw = [];
for (let i of lstCat) {

  if (i === 'All') {
    df_ = testData;
  } else {
    df_ = testData.filter(item => item.category === i);
  }

  let lstYrs = [...new Set(df_.map(item => item.year))];
  for (let yrs_i of lstYrs) {
    let dfYrs_i = df_.filter(item => item.year === yrs_i);
    let quarterLst = [...new Set(dfYrs_i.map(item => item.quarter_of_year))];
    for (let q_i of quarterLst) {
      let temp1 = dfYrs_i.filter(item => item.quarter_of_year === q_i);
      let count = temp1.reduce((acc, item) => {
        acc[item.netflixOriginal] = (acc[item.netflixOriginal] || 0) + 1;
        return acc;
      }, {});
      count['quarter_of_year'] = q_i;
      count['year'] = yrs_i;
      count['category'] = i;
    //   console.log(count);
      dfListRaw.push(count);
    }
  }
}
// console.log(dfListRaw);
var selected = d3.select("#dropdown_year").node().value;
var selected2 = d3.select("#type_data").node().value;
var dataUse = dfListRaw.filter(function(d){return d.year==selected && d.category == selected2})
// console.log(dataUse)
let oriall  = ['Yes','No']
var stackedData = []
for (let i of oriall) {
    let dict_i = {};
    dict_i['type'] = "stackedBar100";
    dict_i['showInLegend'] = true;
    dict_i['name'] = i;
    if (i === 'Yes'){
      dict_i['color'] = 'rgba(255, 0, 0, 1)'
    } else{
      dict_i['color']= 'rgba(197, 197, 197, 1)'
    }
    // console.log(i)
    let resultArray = dataUse.map(item => ({ y: item[i], "label": item.quarter_of_year,
    color: i === 'Yes' ? 'rgba(255, 0, 0, 1)' : 'rgba(197, 197, 197, 1)',
    markerColor: i === 'Yes' ? 'rgba(255, 0, 0, 1)' : 'rgba(197, 197, 197, 1)',
    indexLabel: "#percent %",
    toolTipContent: "{label}<br><b>{name}:</b> {y} (#percent%)",
  }));
  resultArray.sort((a, b) => {
    // Assuming "label" is a string, you may need to adjust the comparison based on your data type
    return b.label.localeCompare(a.label);
  });
    console.log(resultArray)
    dict_i['dataPoints'] = resultArray;
    // console.log(dict_i);
    stackedData.push(dict_i)
}
// console.log(stackedData)

createStackbar(stackedData)

}
function createStackbar(stackedData){

    var chart = new CanvasJS.Chart("chartContainer",
    {
      backgroundColor: "rgba(0, 0, 0, 0.0)",
      axisX:{
        title: "Quarter of Year",
        titleFontColor: "rgba(255, 255, 255, 0.6)",
        lineColor: "rgba(255, 255, 255, 0.6)",
        labelFontColor: "rgba(255, 255, 255, 0.6)",
        tickColor: "rgba(255, 255, 255, 0.6)"
        
      },
      toolTip: {
        shared: true
      },
      axisY:{
        title: "Percent",
        gridThickness: 1,
        gridColor: "rgba(255, 255, 255, 0.2)",
        titleFontColor: "rgba(255, 255, 255, 0.6)",
        lineColor: "rgba(255, 255, 255, 0.6)",
        labelFontColor: "rgba(255, 255, 255, 0.6)",
        tickColor: "rgba(255, 255, 255, 0.6)"

      },
      legend: {
        fontColor: "rgba(255, 255, 255, 0.6)",
        verticalAlign: "center",
		horizontalAlign: "right"
      },
      data: stackedData
    });

chart.render();
}


// function text_fi(data){
//   const genresData = data; // Make sure this is defined and contains data
//   // console.log(genresData)
//   if (genresData) {
//     // Split the 'genres' column by comma and explode it
//     const stackedGenres = genresData.split(',').map(genre => genre.trim());
//     // Count the occurrences of each genre and display the result
//     const genreCounts = {};
//     stackedGenres.forEach(genre => {
//       if (genreCounts[genre]) {
//         genreCounts[genre]++;
//       } else {
//         genreCounts[genre] = 1;
//       }
//     });
//     // Sort the genre counts in descending order and take the top 5 genres
//     const sortedGenres = Object.entries(genreCounts)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 5);
  
//     // Calculate the sum of occurrences for genres other than the top 5
//     const otherGenresSum = Object.entries(genreCounts)
//       .slice(5)
//       .reduce((sum, [, count]) => sum + count, 0);
  
//     // Create a new object combining the top genres and 'Other'
//     const result = {};
//     sortedGenres.forEach(([genre, count]) => {
//       result[genre] = count;
//     });
//     result['Other'] = otherGenresSum;
  
//     // Display the result
//     // console.log(result)
//   } else {
//     console.log("The 'genres' data is undefined or null.");
//   }
//   }