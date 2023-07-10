// Assign URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Define global variables
let dropDown = d3.select("#selDataset");
let names, samples, metadata; // Declare variables to store data

// Fetch the JSON data
d3.json(url).then(function(data) {
  names = data.names;
  samples = data.samples;
  metadata = data.metadata;

  // Call the initialization function
  init(metadata, samples);
});

//Define init function
function init(metadata, samples) {
  createDropdown();
  // Set default ID
  let id = "940";
  // Set default metadata
  let currentMetadata = metadata.find(function(item) {
    return item.id.toString() === id;
  });
  console.log("currentMetadata", currentMetadata);
  // Set default sample
  let currentSample = samples.find(function(item) {
    return item.id.toString() === id;
  });
  console.log("currentSample", currentSample);

  // Update metadata display
  updateMetadata(currentMetadata);
  // Update bar chart
  updateBar(currentSample);
  // Update bubble chart
  updateBubble(currentSample);
};




// Function to populate dropdown 
function createDropdown() {
  for (let i = 0; i < names.length; i++) {
    // Append option for each name
    let option = dropDown.append("option").attr("value", i).text(names[i]);
  }
};

// Define the optionChanged function
function optionChanged(value) {
  // Call the updatePlotly function or perform any necessary actions
  updatePlotly(value);
};

// On change event for dropdown
dropDown.on("change", function() {
  optionChanged(dropDown.property("value"));
});

// Function to run when dropdown updates
function updatePlotly(value) {
  //use the names list to find the correct ID value
  let selectedValue = names[value];
  console.log(selectedValue);

  // Get the corresponding sample for the selected ID
  let currentMetadata = metadata.find(function(item) {
    return item.id.toString() === selectedValue;
  });
  console.log("currentMetadata", currentMetadata);

  // Set default sample
  let currentSample = samples.find(function(item) {
    return item.id.toString() === selectedValue;
  });
  console.log("currentSample", currentSample);
  
  // Update metadata display
  updateMetadata(currentMetadata);
  // Update bar chart
  updateBar(currentSample);
  // Update bubble chart
  updateBubble(currentSample);
};



// Create/Update the Demographic Info box
function updateMetadata(currentMetadata) {
  let metadataDiv = d3.select("#sample-metadata");
  metadataDiv.html(""); // Clear existing content

  // Iterate over the metadata properties and append them to the div
  if (currentMetadata) {
    Object.entries(currentMetadata).forEach(function([key, value]) {
      metadataDiv.append("p").text(key + ": " + value);
    });
  }
};

function updateBar(currentSample) {
  // Get top 10 sample values, otu_ids, and otu_labels
  if (currentSample) {
    let sampleValues = currentSample.sample_values.slice(0, 10).reverse();
    let otuIds = currentSample.otu_ids.slice(0, 10).reverse();
    let otuLabels = currentSample.otu_labels.slice(0, 10).reverse();

    // Create array for bar chart
    let trace = {
      x: sampleValues,
      y: otuIds.map(function(id) {
        return "OTU " + id;
      }),
      text: otuLabels,
      type: "bar",
      orientation: "h"
    };

    let data = [trace];

    // Configure layout for the chart
    let layout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" }
    };

    // Create the bar chart using Plotly
    Plotly.newPlot("bar", data, layout);
  }
};

function updateBubble(currentSample) {
  // Get sample values, otu_ids, and otu_labels
  if (currentSample) {
    let sampleValues = currentSample.sample_values;
    let otuIds = currentSample.otu_ids;
    let otuLabels = currentSample.otu_labels;

    // Create array for bubble chart
    let trace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds
      }
    };

    let data = [trace];

    // Configure layout for the chart
    let layout = {
      title: "OTU Bubble Chart",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    // Create the bubble chart using Plotly
    Plotly.newPlot("bubble", data, layout);
  }
};

// Call initialization function
init(metadata, samples);
