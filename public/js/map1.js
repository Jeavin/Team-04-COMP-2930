$(() => {
  initMap();

  let url = decodeURIComponent(document.location.href);
  if (url.split('?')[1]) {
    let urlParts = url.split('?')[1].split('&');
    let start = urlParts[0].split('=')[1].replace(/\+/g, ' ');
    let dest = urlParts[1].split('=')[1].replace(/\+/g, ' ');
    $("#startAddress").val(start);
    $("#destination").val(dest);
    $('#impactBtn').trigger('click');
  }

  //select car
  $("#selectYear").change(function () {
    $("#selectYourVehicle").val(null);
  });
  $("#selectMake").change(function () {
    $("#selectYourVehicle").val(null);
  });
  $("#selectModel").change(function () {
    $("#selectYourVehicle").val(null);
    vehicleData.child($("#selectYear").val() + "/" + $("#selectMake").val() + "/" + $("#selectModel").val()).on("value", snap => {
      let emission = calcEmission(snap.child("CO2 EMISSIONS (g_km)").val(), getDistance($("#DRIVINGdistance").text()));
      $("#DRIVINGco2").text(emission + " kg");
    });
  });
  $("#selectYourVehicle").change(function () {
    firebase.database().ref().child("users/" + firebase.auth().currentUser.uid + "/cars/" + $("#selectYourVehicle").val()).on("value", snap => {
      $("#selectYear").val(snap.child("Year").val());

      let make = snap.child("Make").val();
      $("#selectMake").empty();
      $("#selectMake").append($("<option value=\"" + make + "\">" + make + "</option>"));
      $("#selectMake").val(snap.child("Make").val());

      let model = snap.key;
      $("#selectModel").empty();
      $("#selectModel").append($("<option value=\"" + model + "\">" + model + "</option>"));
      $("#selectModel").val(snap.key);

      let emission = calcEmission(snap.child("g_km").val(), getDistance($("#DRIVINGdistance").text()));
      $("#DRIVINGco2").text(emission + " kg");
    });
  });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $('.userName').html(
        '<img class="mr-2 ml-2" src="./images/avatar.png" />' +
        user.displayName);
      console.log('user: ' + user.displayName);
      console.log('uid: ' + user.uid);
      //load saved vehicles for the current user, if any
      firebase.database().ref().child('users/').child(user.uid + '/cars').on("value", snap => {
        $("#selectYourVehicle").empty();
        $("#selectYourVehicle").append($("<option disabled selected>Choose...</option>"));
        snap.forEach(function (childSnapy) {

          car = childSnapy.key;
          let option2 = $("<option></option>");
          option2.attr("value", car);
          option2.html(car);
          console.log(car);
          $("#selectYourVehicle").append(option2);
        });
      });
    } else {
      $('#settingIcon1, #settingIcon2').html('<button class="btn"' +
        'type="button" id="signInButton" data-toggle="dropdown"' +
        'aria-haspopup="true" aria-expanded="false">' +
        'Sign In/Up</button>');

      $('#savedVehicles').remove();
      $('.logBtn').remove();
      console.log('user: not log in');
    }
    console.log('user: not log in');
  });

  //initializes four maps for the four different modes and places the four maps
  //into four tabs/divs container.
  function initMap() {
    let tMode = ['TRANSIT', 'DRIVING', 'WALKING', 'BICYCLING'];
    tMode.forEach((mode) => {
      let directionsDisplay = new google.maps.DirectionsRenderer();
      let directionsService = new google.maps.DirectionsService();
      let map = new google.maps.Map(document.getElementById(mode + 'map'), {
        center: { lat: 49.2807323, lng: -123.117211 },
        zoom: 14
      });
      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(document.getElementById(mode + 'Step'));
      let onClickHandler = function () {
        let start = $('#startAddress').val();
        let dest = $('#destination').val();
        //for the easter egg
        if (start === "❤" && dest === "❤") {
          let easterEgg = '<iframe src="https://www.google.com/maps/d/embed?mid=1Bzw8XeW1VSzbZImwhCeWfTHMMMJJJ54d" width="100%" height="100%"></iframe>';
          $('#' + mode + 'map').html(easterEgg);
        } else if (start !== '' && dest !== '') {
          //if start location and destination are not empty, then display the
          //routes and calculate the distance and time.
          calculateAndDisplayRoute(directionsService, directionsDisplay, start, dest, mode);
          getDistanceAndTime(start, dest, mode);
          geocodeAddress(geocoder, map, start);
        } else {
          //either start location, or destination, is empty
          console.log('empty value');
        }
      };
      document.getElementById('impactBtn').addEventListener('click', onClickHandler);
    });
  }

  // To adjust center of the map after you show the route
  function geocodeAddress(geocoder, resultsMap, from) {
    geocoder.geocode({ 'address': from }, function (results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  //shows the routes from one point to another in different mode.
  function calculateAndDisplayRoute(directionsService, directionsDisplay, from, to, mode) {
    directionsService.route({
      origin: from,
      destination: to,
      travelMode: google.maps.TravelMode[mode]
    }, function (response, status) {
      if (status === 'OK') {
        directionsDisplay.setOptions({ preserveViewport: true });
        directionsDisplay.setDirections(response);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });
  }

  //calculates the distance and time from one point to another in different mode
  function getDistanceAndTime(from, to, mode) {
    var distanceService = new google.maps.DistanceMatrixService();
    distanceService.getDistanceMatrix({
      origins: [from],
      destinations: [to],
      travelMode: google.maps.TravelMode[mode],
      unitSystem: google.maps.UnitSystem.METRIC,
      durationInTraffic: true,
      avoidHighways: false,
      avoidTolls: false
    }, function (response, status) {
      if (status !== google.maps.DistanceMatrixStatus.OK) {
        console.log('Error:', status);
      } else {
        let distanceObj = response.rows[0].elements[0].distance;
        $('#' + mode + 'distance').text(distanceObj.text).append('<br/>');
        $('#' + mode + 'time').text(response.rows[0].elements[0].duration.text).append('<br/>');
        if (mode === 'DRIVING') {
          let yearKey = $("#selectYear").val();
          let makeKey = $("#selectMake").val();
          let modelKey = $("#selectModel").val();
          //if all the values in the select boxes are not empty, retrieve co2
          //emission per km from database to calculate.
          if (yearKey != null && makeKey != null && modelKey != null) {
            vehicleData.child(yearKey + "/" + makeKey + "/" + modelKey).on("value", snap => {
              let emission = calcEmission(snap.child("CO2 EMISSIONS (g_km)").val(), getDistance($("#DRIVINGdistance").text()));
              $("#DRIVINGco2").text(emission + " kg");
            });
          } else {
            $("#DRIVINGco2").text("Unknown Vehicle");
          }
        } else if (mode === 'TRANSIT') {
          $("#TRANSITco2").text(calcEmission(transitEmission, getDistance($("#TRANSITdistance").text())) + " kg");
        }
      }
    });
  }

  $('#DRIVING').on('click', () => {
    $('#collapseCar').collapse('show');
    $('#vehicle').show();
  });

  $(' #TRANSIT, #BICYCLING, #WALKING').on('click', () => {
    $('#collapseCar').collapse('hide');
    $('#vehicle').hide();
  });

  $(".travelMode").click(function (e) {
    let chosenMode = $(this).val();
    $('#' + chosenMode + '-tab').trigger('click');
  });
});
