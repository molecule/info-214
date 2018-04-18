'use strict';

$(function(){
  console.log("helloooooo");
  // Setting up the chart area
  var margin = {
    top: 40,
    right: 20,
    bottom: 30,
    left: 40
  };
  var canvasWidth = 400;
  var canvasHeight = 300;
  var width = canvasWidth - margin.left - margin.right;
  var height = canvasHeight - margin.top - margin.bottom;
  var svg = d3.select('svg')
    .attr('width', canvasWidth)
    .attr('height', canvasHeight);
  // Add area for points
  var graphArea = svg.append('g') // g is a 'group' SVG attribute: https://stackoverflow.com/questions/17057809/d3-js-what-is-g-in-appendg-d3-js-code
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  var xScale;
  var yScale;

  console.log("finished setup...");

  // Resources
  // lab 9: https://docs.google.com/presentation/d/1bgEzog4Q3VxWgwIEy_2vXcXy-ewvkxmrMujWrw5XTQ0/edit#slide=id.g11e3d2a418_0_35
  // lab 10: https://docs.google.com/presentation/d/1htlDGbI8VcPTU3VqBa_D2JppW1NZtM6ZaC0mMvPp3Ac/edit#slide=id.g11e75756cf_1_11
  // assignment on bcourses: https://bcourses.berkeley.edu/courses/1469246/assignments/7879590?module_item_id=15574946
  // Lab 10 github repo: https://github.com/waternova/D3_Lab_Exercise

  // Step 1: edit data.csv to include the data you want to show
  d3.csv('data.csv', function(data) {
    // Step 2: Create x and y scales (scaleLinear) to draw points. 
    // Set xScale and yScale to the scales so you can use them outside this function.
    
    // Add code here
    // data_copy was "real" data:
    // x axis is amount of ice cream
    // Sweden source: https://www.statista.com/statistics/562480/per-capita-consumption-of-ice-cream-in-sweden/
    // US source: https://www.foodmanufacturing.com/data-focus/2017/09/capita-consumption-ice-cream-us-2000-2016
    // y axis is temp.
    // data harvested by hand from here: https://www.timeanddate.com/weather/usa/berkeley/historic
    
    xScale = d3.scaleLinear().domain([0, 15]).range([0, width]);
    svg.append('g').attr('class', 'x axis').call(d3.axisTop(xScale));

    yScale = d3.scaleLinear().domain([0, 15]).range([height, 0]);
    svg.append('g').attr('class', 'y axis').call(d3.axisLeft(yScale));

    console.log("created scales...");

    // Now let's bind that data to our SVG.
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d=> { 
        console.log(d["xValue_2012"]);
        return xScale(+d["xValue_2012"]) }) 
      .attr('r', 10)
      .attr('cy', d=> yScale(+d["yValue_2012"]))
      .style("fill", function(d) { 
          if (d["category"] == "Normal"){
            return "red";
          } else{
            return "black"; 
          }});

    // // Add axes (uncomment this code to add axes)
    graphArea.append('g')
       .attr('class', 'x axis')
       .attr('transform', 'translate(0,' + (height) + ')')
       .call(d3.axisBottom(xScale));

    graphArea.append('g')
       .attr('class', 'y axis')
       .call(d3.axisLeft(yScale));
  });

  // Animate points
  var originalYear = 2012;
  var maxYear = 2015;
  var year = originalYear;
  d3.select('#nextButton').on('click', function(event) {
    if (year == maxYear) {
      year = originalYear;
    } else {
      year = year + 1;
    }
    console.log(year)
    
    // Step 4: Animate changing the points shown by year here
    // Make the changes
    svg.selectAll("circle").transition()
    // custom rainbow interpolator: https://github.com/d3/d3-transition#modifying-elements
    .styleTween("fill", function(d) {
      return function(t) {
        if (d["category"] == "Rainbow"){
          return "hsl(" + t * 360 + d["xValue_"+year]*10+d["yValue_"+year]*10+",100%,50%)";
        } else {
          return "black";
        }
      }
    })
    .duration(1500)
    // ease bounce: https://github.com/d3/d3-transition#transition_ease
    .ease(d3.easeBounce)
    .attr("cx", d=> xScale(+d['xValue_'+year]))
    .attr("cy", d=> yScale(+d['yValue_'+year]))

  });

});



// Step 5: make some other change to the graph
