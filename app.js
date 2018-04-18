'use strict';
$(function() {
  var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]),
        color = d3.scaleOrdinal()
        .range(["#5DDEC9", "#EF64AD", "#7b6888", "#BA67E5", "#E0E23B", "#d0743c", "#ff8c00"]);

    var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Instead of loading in data from within the doc, such as...
    // var data = [ 1, 2, 3, 4, 5, 4, 3, 4, 3, 2, 1 ];
  // ...let's try loading in the data from the included CSV using d3.csv
  d3.csv("D3Sample.csv", function(error, data) {
    if(error) {
      console.log('csv error: ', error);
      return;
    }

    x.domain(data.map(function(d) { return d.tool; }));
    y.domain([0, d3.max(data, function(d) { return d.percentageUsed; })]);

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.tool); })
      .attr("y", function(d) { return y(d.percentageUsed); })
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .transition()
      // Here we will configure the attributes for our transition animation:
      // The delay will be based on each value's index position, staggered by a multiple of 100 of the index to create a "one-by-one" effect.
        // https://github.com/d3/d3-transition/blob/master/README.md#timing
      // The duration will be constant and set at 200ms.
      // The width for each rectangle will be set to the final value: xScale(parseFloat(d.population))
      // The value is loaded as a String from the csv, so we convert it with parseFloat()
      .duration(200)
      .delay(function(d, i) {return i * 100})
      .attr('height', function(d) { return height - y(d.percentageUsed)})
      .attr("fill", function(d, i) { return color(i); })
      

      /*
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
      */
  });
});