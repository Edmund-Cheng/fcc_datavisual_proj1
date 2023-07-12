var width = 800,
  height = 400,
  barWidth = width / 275;

var tooltip = d3
  .select('.visHolder')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var svgContainer = d3
  .select('.visHolder')
  .append('svg')
  .attr('width', width + 100)
  .attr('height', height + 60);

d3.json(
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
  .then(gdpData => {
    
    var years = gdpData.data.map(function (item) {
      var quarter;
      var temp = item[0].substring(5, 7);

      if (temp === '01') {
        quarter = 'Q1';
      } else if (temp === '04') {
        quarter = 'Q2';
      } else if (temp === '07') {
        quarter = 'Q3';
      } else if (temp === '10') {
        quarter = 'Q4';
      }

      return item[0].substring(0, 4) + ' ' + quarter;
    });

    // Convert the date string in json into Date object array
    var yearsDate = gdpData.data.map(function (item) {
      return new Date(item[0]);
    });

    // Get the max month from the data 
    var xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);

    var xScale = d3
      .scaleTime()
      .domain([d3.min(yearsDate), xMax])
      .range([0, width]);

    //var xAxis = d3.axisBottom().scale(xScale);
    var xAxis = d3.axisBottom(xScale);

    svgContainer
      .append('g')
      .call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', 'translate(60, 400)');

    var GDP = gdpData.data.map(function (item) {
      return item[1];
    });

    var scaledGDP = [];

    var maxGDP = d3.max(GDP) + 1000;

    var gdpScale = d3.scaleLinear().domain([0, maxGDP]).range([0, height]);

    scaledGDP = GDP.map(function (item) {
      return gdpScale(item);
    });

    var yAxisScale = d3.scaleLinear().domain([0, maxGDP]).range([height, 0]);

    var yAxis = d3.axisLeft(yAxisScale);

    svgContainer
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', 'translate(60, 0)');

    d3.select('svg')
      .selectAll('rect')
      .data(scaledGDP)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('data-date', function (d, i) {
        return gdpData.data[i][0];
      })
      .attr('data-gdp', function (d, i) {
        return gdpData.data[i][1];
      })
      .attr('x', function (d, i) {
        return xScale(yearsDate[i]);
      })
      .attr('y', function (d) {
        return height - d;
      })
      .attr('width', barWidth)
      .attr('height', function (d) {
        return d;
      })
      .attr('index', (d, i) => i)
      .style('fill', '#33adff')
      .attr('transform', 'translate(60, 0)')
      .on('mouseover', function (event, d) {
        // d or datum is the height of the current rect
        var i = this.getAttribute('index');
        
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(
            years[i] +
              '<br>' +
              '$' +
              GDP[i] +
              ' Billion'
          )
          .attr('data-date', gdpData.data[i][0])
          .style('left', i * barWidth + 30 + 'px')
          .style('top', height - 100 + 'px')
          .style('transform', 'translateX(60px)');
      })
      .on('mouseout', function () {
        tooltip.transition().duration(200).style('opacity', 0);
      });
  })
  .catch(e => console.log(e));