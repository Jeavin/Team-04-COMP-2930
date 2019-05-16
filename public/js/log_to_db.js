var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function logToDatabase() {
    let start = $("#startAddress").val();
    let dest = $("#destination").val();
    let time = $("#time").text();
    let distanceStr = $("#distance").text().slice(0, -3).split(",");
    let distance = "";
    for (let i = 0; i < distanceStr.length; i++) {
        distance += distanceStr[i];
    }
    distance = parseFloat(distance);
    
    let emission;
    vehicleData.child("/" + $("#selectYear").val() + "/" + $("#selectMake").val() + "/" + $("#selectModel").val()).on("value", snap => {
        emission = parseFloat((snap.child("CO2 EMISSIONS (g_km)").val() * distance / 1000).toFixed(2));
    });

    let transport = $("#vehicle").text() + " : " + emission;
    emission = parseFloat((emission * distance / 1000).toFixed(2));
    distance = $("#distance").text();

    let user = firebase.auth().currentUser;
    let historyDB = firebase.database().ref().child("users/" + user.uid + "/history");
    let d = new Date();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    let date = d.getDate();
    let currentTime = ("0"+date).slice(-2) +"|"+
                      ("0"+d.getHours()).slice(-2) +":"+
                      ("0"+d.getMinutes()).slice(-2) +":"+
                      ("0"+d.getSeconds()).slice(-2);
    date = month + " " + date;
    firebase.database().ref().on("value", function(snap) {
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
}