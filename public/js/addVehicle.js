//listens for user authentication status.



var currentUser={};




$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $('.userName').html('<img class="mr-2 ml-2" src="./images/avatar.png" />'
                + user.displayName);
            console.log('user: ' + user.displayName);
            console.log('uid: ' + user.uid);
            currentUser.userid = user.uid;

        } else {
            $('#settingIcon1, #settingIcon2').html('<button class="btn"'
                + 'type="button" id="signInButton" data-toggle="dropdown" '
                + 'aria-haspopup="true" aria-expanded="false">'
                + 'Sign In/Up</button>');
            console.log('user: not log in');
        }
        
        displayRouteNames();
    });
    user = firebase.auth().currentUser;

    let db = firebase.database().ref().child("vehicleDatasets");
    db.on("value", snap => {
        snap.forEach(function (childSnap) {
            
            year = childSnap.key;
            let option = $("<option></option>");
            option.attr("value", year);
            option.attr("class", "data");
            option.html(year);
            $("#box1").append(option);
        });
    });

    
  
    //     console.log(currentUser.userid);
    //     let helloe = firebase.database().ref().child("users/" + currentUser.userid + "/cars/");
    //     helloe.on("value", snap => {
        
    //     snap.forEach(function (childSnapshot) {
    //         console.log(childSnapshot.key);
    //         var temp = childSnapshot.val();
    //         var key = childSnapshot.key;
            
    //         var year = temp["Year"];
    //         console.log(year);
    //         var make = temp["Make"];
    //         var cardinfo = $('<div class="not" id="not"><div class="carName"><label for="year" >' + key + '</label></div><div class="gray"><label for="year" >' + temp["Make"] + '</label><br><label for="year" >' + temp["Year"] + '</label><button class="button2" onclick="removeDummy()">X </button></div></div>');


    //         $("#why").prepend(cardinfo);


    //     });
    // });
    

});

function displayRouteNames( ) {
        
    let bo = firebase.database().ref().child('users').child(currentUser.userid+'/cars/');
    bo.on("value", snap => {
        $("#why").empty();    
        snap.forEach(function (childSnaper) {
            var year = childSnaper.val();

            var key = childSnaper.key;

            console.log(year);
            var cardinfo = $('<div class="not" id="not"><div class="carName"><label for="year" >' + key + '</label></div><div class="gray"><label for="year" >' + year["Make"] + '</label><br><label for="year" >' + year["Year"] + '</label><button id="delete" class="button2" onclick="removeDummy()">X </button></div></div>');
            $("#why").append(cardinfo);
        });
    });
}

function selectYear() {
    let bds = firebase.database().ref().child("vehicleDatasets/" + $('#box1').val());
    $("#box2").empty();
    $("#box3").empty();
    // let default = $("<option disabled selected value> -- select an option -- </option>");
    $("#box2").append($('<option disabled selected value="-1"> -- select an option -- </option>'));
    $("#box3").append($('<option disabled selected value="-1"> -- select an option -- </option>'));
    bds.on("value", snap => {
        snap.forEach(function (childSnap) {
            make = childSnap.key;
            let option = $("<option></option>");
            option.attr("value", make);
            option.html(make);
            $("#box2").append(option);
        });
    });
}

function selectMake() {
    let bd = firebase.database().ref().child("vehicleDatasets/" + $('#box1').val() + "/" + $('#box2').val());
    $("#box3").empty();
    // let default = $("<option disabled selected value> -- select an option -- </option>");
    $("#box3").append($('<option disabled selected value="-1"> -- select an option -- </option>'));
    bd.on("value", snap => {
        snap.forEach(function (childSnap) {
            make = childSnap.key;
            let option = $("<option></option>");
            option.attr("value", make);
            option.html(make);
            $("#box3").append(option);
        });
    });
}

var slice = [].slice;
var tabs = document.querySelector('.tabs');
var tabItems = slice.call(tabs.querySelectorAll('.tabs-nav-item'));
var tabContents = slice.call(tabs.querySelectorAll('.tabs-content-item'));
var currentIndex = 0;

function onClick(e) {
    e.preventDefault();
    var tab = this;
    var index = tabItems.indexOf(this);
    if (index !== currentIndex) {
        tabItems[currentIndex].classList.remove('active-tab-nav-item');
        tabContents[currentIndex].classList.remove('active-tab-content-item');
        tab.classList.add('active-tab-nav-item');
        tabContents[index].classList.add('active-tab-content-item');
        currentIndex = index;
    }
}

tabItems.forEach(function (item) {
    item.addEventListener('click', onClick, false);
});

// var e = document.getElementById("box1");
// var strUser = e.options[e.selectedIndex].innerHTML;

function newPerson() {
    $('#section-1').append(' <br><br><br><div class="d-flex justify-content-center"><div class="spinner-border mt-5" role="status"><span class="sr-only">Loading..</span></div></div>')
    var emissions;
    if (document.getElementById("box1").value != -1 && document.getElementById("box2").value != -1 && document.getElementById("box3").value != -1) {

        
        // $('#why').prepend('<div class="not" id="not"><div class="carName"><label for="year" >' + $('#box3 option:selected').text() + '</label></div><div class="gray"><label for="year" >' + $('#box2 option:selected').text() + '</label><br><label for="year" >' + $('#box1 option:selected').text() + '</label><button class="button2" onclick="removeDummy()">X </button></div></div>')
        var ref = firebase.database().ref();
        // console.log(ref);
        ref.on("value", function(snapshot) {
          emissions = snapshot.child("vehicleDatasets/" + $('#box1').val() + "/" + $('#box2').val() + "/" + $('#box3').val() + "/" + "CO2 EMISSIONS (g_km)").val();
         console.log(emissions);
         firebase.database().ref().child('users').child(currentUser.userid+'/cars/'+$('#box3 option:selected').text()).update({
            Make: $('#box2 option:selected').text(),
            Year: $('#box1 option:selected').text(),
            g_km: emissions
        });
        
        
        location.reload();
        });
        
        
    } else {
        alert('Please Select All Options');
    }

}
function removeDummy() {
   
    
    console.log(event.srcElement.parentElement.parentElement.firstChild.firstChild.innerHTML);
    var rideRef = firebase.database().ref().child('users').child(currentUser.userid+'/cars/'+
    event.srcElement.parentElement.parentElement.firstChild.firstChild.innerHTML);
                
                rideRef.remove();
                event.srcElement.parentElement.parentElement.remove();
}

