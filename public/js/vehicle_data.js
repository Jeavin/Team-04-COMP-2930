/*  make sure the select tags' id attribute's values are set to
    "selectYear", "selectMake", "selectModel" respectively */


$(document).ready(function() {
  loadListOfYears();
});

var vehicleData = firebase.database().ref().child("vehicleDatasets");
const transitEmission = 48.66;
var selectedYear;
var selectedMake;

function loadListOfYears() {
  vehicleData.on("value", snap => {
    snap.forEach(function(childSnap) {
      year = childSnap.key;
      let option = $("<option></option>");
      option.attr("value", year);
      option.html(year);
      $("#selectYear").append(option);
    });
  });
}

function yearSelected() {
  selectedYear = $("#selectYear").val();
  vehicleData.child(selectedYear).on("value", snap => {
    $("#selectMake").empty();
    $("#selectMake").append($("<option disabled selected>Choose...</option>"));
    $("#selectModel").empty();
    $("#selectModel").append($("<option disabled selected>Choose...</option>"));
    snap.forEach(function(childSnap) {
      make = childSnap.key;
      let option = $("<option></option>");
      option.attr("value", make);
      option.html(make);
      $("#selectMake").append(option);
    });
  });
}

function makeSelected() {
  selectedMake = $("#selectMake").val();
  vehicleData.child(selectedYear + "/" + selectedMake).on("value", snap => {
    $("#selectModel").empty();
    $("#selectModel").append($("<option disabled selected>Choose...</option>"));
    snap.forEach(function(childSnap) {
      model = childSnap.key;
      let option = $("<option></option>");
      option.attr("value", model);
      option.html(model);
      $("#selectModel").append(option);
    });
  });
}
