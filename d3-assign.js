function initialize (){
    
    
    var years = ["2009","2010","2011","2012","2013","2014","2015","2016","2017","2018"];
    
    var width = 1030;
    var height = 650;


d3.select("svg").remove(); 
var svg = d3.select(".container")
.append("svg")
.attr("width",width)
.attr("height", height),
inner = svg.append("g");
    
    
     // Map projection
    var projection = d3.geoMercator()
        // scale things down so see entire Australia
      .scale(1000)
      .center([132, -28])
     // move the center of the map to the center of our canvas
      .translate([width /1.75, height / 2]);
    
    

     // Define path generator
            // path generator that will convert GeoJSON to SVG paths    
    var path = d3.geoPath()
 // tell path generator to use the previous map projection
 .projection(projection);

    
    d3.json("d3-map.json", function (mapData) {

      var states = svg.selectAll("path")
                        // bind the geographic data to svg elements

        .data(mapData.features)
      // create one "path" svg element for each datum

        .enter().append("path")
         // using the map projection to convert geographic 
                  // information to screen coordinates
        .attr("d", path)
        .style("stroke", "white")
        .style("stroke-width", "1")
        .style("fill", "white");
    
        
       //assigning names on each state 
         svg.selectAll("text")
					.data(mapData.features)
					.enter()
					.append("text")
					.attr("fill", "darkblack")
					.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
					.attr("text-anchor", "middle")
    				.attr("dy", ".35em")
					.text(function(d) {
						return d.properties.STATE_NAME;
					});

        


      d3.json("d3-data.json", function (data) {

        var country2value = {};
        var minValue = Infinity;
        var maxValue = -1;
        data.forEach(function (d) {
          
            console.log(years);
           //linking dropdown to the years and its data. 
          var thisValue =  years.indexOf(document.getElementById("dropdown").value) > -1 ? d[document.getElementById("dropdown").value] : d["2009"];
            
          country2value[d.name] = thisValue;

          minValue = Math.min(minValue, thisValue);
          maxValue = Math.max(maxValue, thisValue);
        });
        var value2range = d3.scaleLinear()
          .domain([minValue, maxValue])
          .range([0, 1])

        var range2color = d3.interpolateBlues;

          //filling colors for the chloropath map

        states.style("fill", function (d) {
          return range2color(
            value2range(country2value[d.properties.STATE_NAME])
          );
        })
          .on('mouseover', function (d) {
   
            d3.select(this)
                .style("stroke", "white")
                .style("stroke-width", 1)
                .style("cursor", "pointer");

            d3.select(".data")
                .text("State: " + d.properties.STATE_NAME );

            d3.select(".value")
                .text("deaths: " + country2value[d.properties.STATE_NAME]);

            d3.select('.details')
                .style('visibility', "visible")
            
            
          })
          .on('mouseout', function (d) {
                d3.select(this)
                .style("stroke", null)
                .style("stroke-width", 0.25);

            d3.select('.details')
                .style('visibility', "hidden");
          });
      });
    });
}

function onChange(){
     initialize();
};