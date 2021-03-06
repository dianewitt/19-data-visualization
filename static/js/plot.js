// initialize arrays to be plotted and default beach

var readings = [];
var timestamps = [];
var beachName = "12th Street"; //default beach name
var query_url = "/dna"

function buildPlot(){
    var plotData = [
        {
            x: timestamps,
            y: readings,
            type: 'scatter'
        }
    ];

    // chart layout
    var layout = {
        title: `${beachName} Bacteria Levels`,
        yaxis: {title: "Enterococci CCE per 100ml of water"},
        shapes: [{
            type: 'line',
            xref: 'paper',
            x0: 0,
            y0: 1000,
            x1: 1,
            y1: 1000,
            line: {
                color: 'rgb(255,0,0)',
                width: 4,
                dash: 'dot'
            }
        }],

        // Creates annotated line to indicate swim advisory level
        annotations: [{
            xref:'paper',
            yref: 'y',
            x: 0.5,
            y: 1000,
            text: 'Swim Advisories go into effect at 1000 CCE',

        }]

    };
    // creates default plot at div with ID: #myChart
    Plotly.newPlot('myChart', plotData, layout);
};

// reads bacteria levels and timestamps from returned JSON
function getData(data){
    readings = [];
    timestamps = [];
    data.forEach((sample) => {
        if (sample.beach === beachName) {
            readings.push(parseFloat(sample.dna_reading_mean));
            timestamps.push(sample.dna_sample_timestamp);
        };
        
    });
    // takes the most recent 100 readings, if that many exist
    readings.slice(1).slice(-100);
    timestamps.slice(1).slice(-100);
    console.log(readings);
    console.log(timestamps); 
    
    buildPlot();
};

// API call to return JSON
d3.json(query_url).then(getData);


// selects drop down of beaches with ID: #selDataset
d3.selectAll("#selDataset").on("change", updateData);

// updates plot with new data based off of Beach Name
function updateData() {
   var dropDownMenu = d3.select("#selDataset");
   beachName = dropDownMenu.property("value");
   d3.json(query_url).then(getData);
   var layout_update = {
       title: `${beachName} Bacteria Levels`,
   }
   var data_update = [
    {
        x: timestamps,
        y: readings,
    }];
    Plotly.update('myChart', data_update, layout_update);
}