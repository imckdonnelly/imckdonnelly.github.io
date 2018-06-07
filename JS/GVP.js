$(document).ready(function () {
  
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
  d3.selection.prototype.moveToFront = function() {  
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };
    d3.selection.prototype.moveToBack = function() {  
        return this.each(function() { 
            var firstChild = this.parentNode.firstChild; 
            if (firstChild) { 
                this.parentNode.insertBefore(this, firstChild); 
            } 
        });
    };
  
  var statePaths = [
    {
    "stateName": "Arizona",
    "filePath": "../State_JSON/Arizona.json",
    "center": [-111.6602, 34.2744],
    "scale": "4500"
    },
    {
    "stateName": "Massachusetts",
    "filePath": "../State_JSON/Massachusetts.json",
    "center": [-71.8083, 42.1596],
    "scale": "11300"
    },
    {
    "stateName": "North Carolina",
    "filePath": "../State_JSON/North_Carolina.json",
    "center": [-79.3877, 35.5557],
    "scale": "4500"
    },
    {
    "stateName": "Wisconsin",
    "filePath": "../State_JSON/Wisconsin.json",
    "center": [-89.9941, 44.8243],
    "scale": "4800"
    },
    
  ];
    
  var width = 750;
  var height = 570;
    
  var svg = d3.select("#map")
    .append("svg")
    .attr("height", height)
    .attr("width", width);
  
  //Main function
  function createPage() {
    //create SVG and <g> for map
    var svg = d3.select("#map")
      .append("svg")
      .attr("height", height)
      .attr("width", width);
    
    var g = d3.select("svg")
      .append("g");
    
    //Variables defined
    var slider = $('#state-dates')[0];
    var dropdown = $('#date-chooser')[0];
    var position;
    var lowerBound;
    var upperBound;
    var stateFile = statePaths[index].filePath;
    
    //store json file as variable
    $.getJSON(stateFile, function(json) {
      jdata = json;
      //Page start content generation
      //generate slider ticks
      jdata.forEach(function(i, f) {
        var ticks = $("#date-list option");
        $(ticks[f]).html(i.sYear);
      });
      jdata.forEach(function(i, f) {
        var dates = $('#dates option');
        $(dates[f]).html(i.sYear);
      });
      //Slider info
      var yearSpan = jdata.length;
      var jstart = jdata[0];
      $("#year-start").html(jstart.sYear);
      $("#year-end").html(jstart.eYear);
      $("#time-start").html(jstart.sYear);
      $("#time-end").html(jdata[yearSpan-1].eYear);
      $("#state-dates")
        .prop("min", jstart.sYear)
        .prop("value", jstart.sYear)
        .prop("max", jdata[yearSpan-1].eYear);
      //Written context
      $("#leg-control").html(jstart.legControl);
      $("#gov-control").html(jstart.govControl);
      $("#rep-num").html(jstart.repNum);
      $("#pop").html(jstart.pop);
      $("#redist-type").html(jstart.redistType);
      $("#context-one").html(jstart.context);
      $("#context-two").html(jstart.contextTwo);
      $("#context-three").html(jstart.contextThree);
      $("#state-name").html(statePaths[index].stateName);
      //First map
      d3.json(jstart.fileName, renderMap);
    });
    
    //change text based on slider position
    function changeText() {
      var jrows = jdata.filter(function (i, n) {
        return i.sYear <= position && i.eYear > position;
      });
        lowerBound = jrows[0].sYear;
        upperBound = jrows[0].eYear;
        $("#year-start").html(jrows[0].sYear);
        $("#year-end").html(jrows[0].eYear);
        $("#leg-control").html(jrows[0].legControl);
        $("#gov-control").html(jrows[0].govControl);
        $("#rep-num").html(jrows[0].repNum);
        $("#pop").html(jrows[0].pop);
        $("#redist-type").html(jrows[0].redistType);
        $("#context-one").html(jrows[0].context);
        $("#context-two").html(jrows[0].contextTwo);
        $("#context-three").html(jrows[0].contextThree);
    }
    
    //Map path creation
    var projection = d3.geoMercator()
        .translate([width/2, height/2])
        .center(statePaths[index].center)
        .scale(statePaths[index].scale); 
      

    var path = d3.geoPath()
      .projection(projection);
    
    //load map
    function renderMap(error, state) {
      g.selectAll("path")
        .data(topojson.feature(state, state.objects.details).features)
      .enter().append("path")
        .attr("d", path)
        .attr("class", "district")
        .attr("id", function(d) {return "district-" + d.properties.district;})
        .on('mouseover', function(d) {
            d3.select(this).moveToFront();
        })
        .on('click', function(d) {
            d3.select(this).moveToBack();
        });

        // .attr("opacity",0)
        // .transition()
        // .duration(1000)
        // .attr("opacity",1);
    }
    
    //change map depending on slider position
    function changeMap() {
      jdata.forEach(function(d) {
        if (position >= d.sYear && position < d.eYear) {
          var fileName = d.fileName;
          d3.json(fileName, renderMap);
        }
      });
    }
    
    //clear the svg for a new map
    function clearPath(){
      g.selectAll("path")
        .remove();
    }
   
    //generate content with slider movement
    slider.oninput = function changePage() {
      position = this.value;
      if (position < upperBound && position >= lowerBound) {
        return false;
      }
      else if (position >= 2013) {
         return false;
      }
      else {
        clearPath();
        changeText();
        changeMap();
      }
    };
    
  }
  
  
      // if(g.selectAll("path").nodes().length > 0) {
      //   g.selectAll("path")
      //     .transition()
      //     .duration(1000)
      //     .attr("opacity",0)
      //     .on("end", function() {
      //       g.selectAll("path").remove();
      //       changeMap();
      //       changeText();
      //     });
      // }
  
  
  
  function generatePage() {
    d3.select("#map").selectAll("*").remove();
    createPage();
  }
  
  //Choose state and load everything
  $("#state-chooser").change(function() {
    index = $("#state-chooser").val();
    generatePage();
  });
  
  index = getUrlParameter('index');
  generatePage();

   
   
    

});