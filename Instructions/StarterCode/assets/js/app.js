// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from hours-of-tv-watched.csv
d3.csv("assets/data/data.csv").then(function(data) {

  console.log(data);

  // Cast the poverty and healthcare value to a number for each piece of data
  data.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
  });

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
//   var xLinearScale = d3.scaleLinear()
//     .domain(data.map(d => d.name))
//     .range([0, chartWidth])
//     .padding(0.1);

      // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([0,
      d3.max(data, d => d.poverty)
    ])
    .range([0, chartWidth]);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 12)
    // .attr("class", function(d){
    //     console.log(d.abbr)
    //     return "stateCircle"+d.abbr;
    // })
    .attr("fill", "blue")
    .attr("opacity", ".5");


    // circlesGroup.append("text")
    // .text(function (d){
    //     console.log(d.abbr)
    //     return d.abbr
    // })
    // .attr("class", "stateText");

    var textcirclesGroup = circlesGroup
    .append("text")
    .text((d) => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare));

    // chartGroup.selectAll("text")
    // .data(data)
    // .enter()
    // .append("text")
    // .text(function (d){
    //     console.log(d.abbr)
    //     return `${d.abbr}`
    // })
    // .attr("x", d => xLinearScale(d.poverty))
    // .attr("y", d => yLinearScale(d.healthcare))
    // .attr("fill", "white")
    // .attr("text-anchor", "middle")
    // .attr("alignment-baseline", "central");

 // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  var healthcareLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0-(chartHeight/2))
    .attr("y", 0-chartMargin.left+40)
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var povertyLabel = chartGroup.append("text")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight+chartMargin.top+30})`)
    .text("In Poverty (%)");

}).catch(function(error) {
  console.log(error);
});
