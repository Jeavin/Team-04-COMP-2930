var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function logToDB_car() {
    event.stopPropagation(); //prevents parent element's click listener from firing

    let user = firebase.auth().currentUser;
    let userDB = firebase.database().ref().child("users/" + user.uid);
    let historyDB = userDB.child("history");

    let start = $("#startAddress").val();
    let dest = $("#destination").val();
    let time = $("#DRIVINGtime").text();
    let distance = getDistance($("#DRIVINGdistance").text());

    let emission;
    let transport;

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
    } else {
        alert("Please select a vehicle first.");
        return;
    }

    distance = $("#DRIVINGdistance").text();


    let d = new Date();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    let date = d.getDate();
    let currentTime = ("0" + date).slice(-2) + "|" +
        ("0" + d.getHours()).slice(-2) + ":" +
        ("0" + d.getMinutes()).slice(-2) + ":" +
        ("0" + d.getSeconds()).slice(-2);
    date = month + " " + date;
    firebase.database().ref().on("value", function (snap) {
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
    });
    $('#messagePopup').text('Trip was saved.').animate({ 'margin-top': 0 }, 200);
    setTimeout(function () {
        $('#messagePopup').animate({ 'margin-top': -25 }, 200);
    }, 3 * 1000);
}

function logToDB_transit() {
    event.stopPropagation(); //prevents parent element's click listener from firing

    let user = firebase.auth().currentUser;
    let userDB = firebase.database().ref().child("users/" + user.uid);
    let historyDB = userDB.child("history");

    let start = $("#startAddress").val();
    let dest = $("#destination").val();
    let time = $("#TRANSITtime").text();
    let distance = getDistance($("#TRANSITdistance").text());

    let emission = calcEmission(transitEmission, distance);
    let transport = "transit";

    distance = $("#TRANSITdistance").text();


    let d = new Date();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    let date = d.getDate();
    let currentTime = ("0" + date).slice(-2) + "|" +
        ("0" + d.getHours()).slice(-2) + ":" +
        ("0" + d.getMinutes()).slice(-2) + ":" +
        ("0" + d.getSeconds()).slice(-2);
    date = month + " " + date;
    firebase.database().ref().on("value", function (snap) {
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
    });
    $('#messagePopup').text('Trip was saved.').animate({ 'margin-top': 0 }, 200);
    setTimeout(function () {
        $('#messagePopup').animate({ 'margin-top': -25 }, 200);
    }, 3 * 1000);
}

//returns distance as float
function getDistance(text) {
    let distanceStrAr = text.slice(0, -3).split(",");
    let distance = "";
    for (let i = 0; i < distanceStrAr.length; i++) {
        distance += distanceStrAr[i];
    }
    distance = parseFloat(distance);
    return distance;
}

//returns emission in kg, as float
function calcEmission(emission, distance) {
    return parseFloat((emission * distance / 1000).toFixed(2));
}