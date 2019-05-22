var currentUser = {};

$(document).ready(function () {
  //listens for user authentication status.
  firebase.auth().onAuthStateChanged(function (user) {
    //if a user is logged in
    if (user) {
      //change the top right corner to the user icon and user name
      $('.userName').html('<img class="mr-2 ml-2" src="./images/avatar.png" />' +
        user.displayName);
      console.log('user: ' + user.displayName);
      console.log('uid: ' + user.uid);
      currentUser.userid = user.uid;
    } else {
      //if no user logged in, just show the sign button.
      $('#settingIcon1, #settingIcon2').html('<button class="btn"' +
        'type="button" id="signInButton" data-toggle="dropdown" ' +
        'aria-haspopup="true" aria-expanded="false">' +
        'Sign In/Up</button>');
      console.log('user: not log in');
    }
  });
  user = firebase.auth().currentUser;

  //root reference to vehicleDatasets
  const db = firebase.database().ref().child("vehicleDatasets");
  db.on("value", snap => {
    //loop for each year
    snap.forEach(function (childSnap) {
      year = childSnap.key;
      let option = $("<option></option>");
      option.attr("value", year);
      option.attr("class", "data");
      option.html(year);
      $("#box1").append(option);
    });
  });
});



//display all the saved vehicles under the current user
function displayCars() {
  let bo = firebase.database().ref().
    child('users').child(currentUser.userid + '/cars/');

  bo.on("value", snap => {
    $("#section-2").empty();
    snap.forEach(function (childSnaper) {
      var year = childSnaper.val();
      var key = childSnaper.key;
      var cardinfo = $('<div class="carDiv"><div class="carName">' +
        '<label for="year" >' + key + '</label></div><div class="gray">' +
        '<label for="year" >' + year["Make"] +
        '</label><br><label for="year">' + year["Year"] +
        '</label><button id="delete" class="button2" ' +
        'onclick="displayConfirmationModal()">X </button></div></div>');
      $("#section-2").append(cardinfo);
    });
  });
}

//Loops for available makes for the selected year and wrap the makes inside
//option tags to display on the browser
function selectYear() {
  let bds = firebase.database().ref().
    child("vehicleDatasets/" + $('#box1').val());

  $("#box2").empty();
  $("#box3").empty();
  $("#box2").append(
    $('<option disabled selected value="-1">-- select an option --</option>'));
  $("#box3").append(
    $('<option disabled selected value="-1">-- select an option --</option>'));

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

//Loops for available models for the selected make and wrap the models inside
//option tags to display on the browser
function selectMake() {
  let bd = firebase.database().ref().child("vehicleDatasets/" +
    $('#box1').val() + "/" + $('#box2').val());

  $("#box3").empty();
  $("#box3").append(
    $('<option disabled selected value="-1">-- select an option --</option>'));

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

//attach "active" value to class attribute to make the chosen tab active
function onClick(e) {
  $('#section-2').append(' <div class="d-flex justify-content-center">' +
    '<div class="spinner-border mt-5" role="status">' +
    '<span class="sr-only">Loading..</span></div></div><br><br><br>');

  displayCars();
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

//attach an event listener to the tabs so that it can show up the corresponding
//tab when the user clicks
tabItems.forEach(function (item) {
  item.addEventListener('click', onClick, false);
});

//add the chosen vehicle to the signed in user
function addVehicle() {
  //if one of the select box is empty, alert the user to select all in order to
  //save the vehicle
  if (document.getElementById("box1").value == -1 ||
    document.getElementById("box2").value == -1 ||
    document.getElementById("box3").value == -1) {
    alert('Please Select All Options');
    return;
  }
  //if all the select boxes are filled, then add the vehicle to the current user
  $('#add').append(
    '<span class="spinner-border spinner-border-sm align-baseline ml-1" ' +
    'role="status"></span>');
  setTimeout(addVehicle2, 500);
}

//save the chosen vehicle and its CO2 emission per kilometer under the current
//user
function addVehicle2() {
  var emissions;
  const ref = firebase.database().ref();

  ref.on("value", function (snapshot) {
    emissions = snapshot.child("vehicleDatasets/" + $('#box1').val() +
      "/" + $('#box2').val() + "/" + $('#box3').val() + "/" +
      "CO2 EMISSIONS (g_km)").val();

    firebase.database().ref().child('users').child(
      currentUser.userid + '/cars/' +
      $('#box3 option:selected').text()).update({
        Make: $('#box2 option:selected').text(),
        Year: $('#box1 option:selected').text(),
        g_km: emissions
      });
    location.reload();
  });
}

let smt;

//remove the saved vehicle from database
function removeDummy() {
  var rideRef = firebase.database().ref().child('users').child(currentUser.userid + '/cars/' +
    smt.parentElement.parentElement.firstChild.firstChild.innerHTML);

  rideRef.remove();
  smt.parentElement.parentElement.remove();
}

//when the user clicks delete the saved vehicle, this confirmation modal will
//show up
function displayConfirmationModal() {
  smt = event.srcElement;
  $("#logYes").attr("onclick", "removeDummy()");
  $("#confirmModal").modal();
}
