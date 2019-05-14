var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function logToDatabase() {
    let start = $("#startAddress").text();
    let dest = $("#destination").text();
    let distance = parseFloat($("#distance").text().slice(0, -3));
    let time = parseFloat($("#time").text().slice(0, -5));
    
    let emission = 123;
    let transport = "car";

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