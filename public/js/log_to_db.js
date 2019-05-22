var months = [
  "January", "February", "March", "April", "May", "June", "July", "August",
  "September", "October", "November", "December"];
let d, year, month, date, currentTime;
let start, dest, distance, emission, transport;
let historyDB;

// Sets loading animation (spinner)
function logToDB_car() {
  $("#DRIVING .logBtn").append($("<span class=\"spinner-grow spinner-grow-sm align-baseline\" role=\"status\"></span>"));
  setTimeout(logToDB_car2, 500);
}

// Sets loading animation (spinner)
function logToDB_transit() {
  $("#TRANSIT .logBtn").append($("<span class=\"spinner-grow spinner-grow-sm align-baseline\" role=\"status\"></span>"));
  setTimeout(logToDB_transit2, 500);
}

// Logs information to database under user's history
function logToDB_car2() {
  setVariables();
  let time = $("#DRIVINGtime").text();
  distance = getDistance($("#DRIVINGdistance").text());

  if ($("#selectYourVehicle").val() != null) {
    userDB.child("cars/" + $("#selectYourVehicle").val()).on("value", snap => {
      emission = calcEmission(snap.child("g_km").val(), distance);
      transport = $("#selectYourVehicle").val() + " : " + emission;
    });
  } else if ($("#selectModel").val() != null) { // only checks if the model is selected
    vehicleData.child("/" + $("#selectYear").val() + "/" + $("#selectMake").val() + "/" + $("#selectModel").val()).on("value", snap => {
      emission = calcEmission(snap.child("CO2 EMISSIONS (g_km)").val(), distance);
      transport = $("#selectYear").val() + " " + $("#selectMake").val() + " " + $("#selectModel").val() + " : " + emission;
    });
  }

  distance = $("#DRIVINGdistance").text();

  historyDB.child(month + " " + year).update({
    [currentTime]: {
      date: date,
      destination: dest,
      distance: distance,
      emission: emission,
      start: start,
      time: time,
      transport: transport
    }
  });
  $('#messagePopup').text('Trip was saved.').animate({
    'margin-top': 0
  }, 200);
  setTimeout(function () {
    $('#messagePopup').animate({
      'margin-top': -25
    }, 200);
  }, 3 * 1000);
  $(".spinner-grow").remove();
}

// Logs information to database under user's history
function logToDB_transit2() {
  setVariables();
  let time = $("#TRANSITtime").text();
  distance = getDistance($("#TRANSITdistance").text());
  emission = calcEmission(transitEmission, distance);
  transport = "transit";
  distance = $("#TRANSITdistance").text();

  historyDB.child(month + " " + year).update({
    [currentTime]: {
      date: date,
      destination: dest,
      distance: distance,
      emission: emission,
      start: start,
      time: time,
      transport: transport
    }
  });
  $('#messagePopup').text('Trip was saved.').animate({
    'margin-top': 0
  }, 200);
  setTimeout(function () {
    $('#messagePopup').animate({
      'margin-top': -25
    }, 200);
  }, 3 * 1000);
  $(".spinner-grow").remove();
}

//returns distance as float
function getDistance(text) {
  let distanceStrAr = text.slice(0, -3).split(",");
  let distance = "";
  for (let i = 0; i < distanceStrAr.length; i++) {
    distance += distanceStrAr[i];
  }
  distance = parseFloat(distance);
  if (isNaN(distance)) {
    throw "Distance is NaN.";
  }
  return distance;
}

// returns emission in kg, as float
function calcEmission(emission, distance) {
  return parseFloat((emission * distance / 1000).toFixed(2));
}

// Set variables needed for logging to database
function setVariables() {
  userDB = firebase.database().ref().child("users/" + firebase.auth().currentUser.uid);
  historyDB = firebase.database().ref().child("users/" + firebase.auth().currentUser.uid + "/history");
  start = $("#startAddress").val();
  dest = $("#destination").val();
  d = new Date();
  year = d.getFullYear();
  month = months[d.getMonth()];
  date = d.getDate();
  currentTime = ("0" + date).slice(-2) + "|" +
    ("0" + d.getHours()).slice(-2) + ":" +
    ("0" + d.getMinutes()).slice(-2) + ":" +
    ("0" + d.getSeconds()).slice(-2);
  date = month + " " + date;
}
