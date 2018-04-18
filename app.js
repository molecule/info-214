'use strict';
$(function() {
  // Declare your chart variable and connect it to the #barchart in your HTML
  // Give it a width of 200 and a height of 240
    // Why is the height 240? 
      // In our sample CSV, we have 11 values.
      // Later on, we'll set each bar to have a height of 20 with a space of 2.
      // The last bar will not have the space of 2.
      // 10*22 + 20 = 240
    // It is translated 40 pixels down to leave room for axis labels
  var chart = d3.select('#barchart').attr('transform', 'translate(0,40)')
  
  // Set up a xScale (scaleLinear) with a domain from 0 to 100 and a range from 0 to 200
    // CODE HERE
  var xScale = d3.scaleLinear().domain([0, 100]).range([0, 200]);
  chart.append('g').attr('class', 'x axis').call(d3.axisTop(xScale));

  // Instead of loading in data from within the doc, such as...
    // var data = [ 1, 2, 3, 4, 5, 4, 3, 4, 3, 2, 1 ];
  // ...let's try loading in the data from the included CSV using d3.csv
  d3.csv("D3Sample.csv", function(error, data) {
    if(error) {
      console.log('csv error: ', error);
      return;
    }
    // Now let's bind that data to our SVG.
    chart.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      // Let's add in the following attributes:
        // The y position of each rectangle will be based on the value's index position,
        // with a space of 2 between each rectangle (for a total difference of 22)
        // Each rectangle will have a height of 20.
        // The rectangles will have an x position of 0.
        // At the beginning, the rectangles will have a width of 0 so that they will "grow in" through animation.
        // but for now, set their width to xScale(parseFloat(d.population)) so that you can see the chart.
      .attr('width', 20)
      .attr('y', 0)
      .attr('height', 0)
      .attr('x', function(d,i) {return 22*i})
      .transition()
        // Here we will configure the attributes for our transition animation:
          // The delay will be based on each value's index position, staggered by a multiple of 100 of the index to create a "one-by-one" effect.
            // https://github.com/d3/d3-transition/blob/master/README.md#timing
          // The duration will be constant and set at 200ms.
          // The width for each rectangle will be set to the final value: xScale(parseFloat(d.population))
          // The value is loaded as a String from the csv, so we convert it with parseFloat()
      .duration(200)
      .delay(function(d, i) {return i * 100})
      .attr('height', function(d) {return xScale(parseFloat(d.percentageUsed))});
  });
});