var autocomplete, autocomplete2;
$(document).ready(function () {
  /** 
   * Enables the Departure and Destination Text inputs boxes to autocomplete the user's geographical location,. 
   */
  initAutocomplete();


  $("#startAddress").focus(geolocate());
  $("#dest").focus(geolocate());
});
/** 
 * Enables the Departure and Destination Text inputs boxes to autocomplete the user's geographical location,. 
 */
function geolocate() {

  var geolocation = {
    lat: 49.25,
    lng: -122.8
  };
  var circle = new google.maps.Circle({
    center: geolocation,
    radius: 80000
  });
  autocomplete.setBounds(circle.getBounds());
  autocomplete2.setBounds(circle.getBounds());
}

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
    // /** @type {!HTMLInputElement} */
    (document.getElementById('startAddress')), {
      types: ['geocode']
    });
  autocomplete.setFields(['address_components', 'geometry']);


  //autocomplete.addListener('place_changed', fillInAddress);
  autocomplete2 = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */
    (document.getElementById('dest')), {
      types: ['geocode']
    });
  autocomplete2.setFields(['address_components', 'geometry']);
  //autocomplete2.addListener('place_changed', fillInAddress);
}



$('#DRIVING').on('click', () => {
  $('#collapseCar').collapse('show');
})

$('#DRIVING').on('click', () => {
  console.log($(this).id);
})

$(' #TRANSIT, #BICYCLING, #WALKING').on('click', () => {
  $('#collapseCar').collapse('hide');
})

let startA, destB;
$(document).on('click', '#impactBtn',
  function redirect(e) {
    e.preventDefault();
    let year = $('#selectYear option:selected').val();
    let make = $('#selectMake option:selected').val();
    let model = $('#selectModel option:selected').val();
    startA = $('#startAddress').val();
    destB = $('#dest').val();
    initMap();
    // window.location.href = "./mytrip.html" + "#" + year + "#" + make + "#"
    // + model + "#"+ startA + "#"+ destB;
  });







var today = new Date();
const curyear = today.getFullYear();
const curmonth = `${today.getMonth() + 1}`.padStart(2, 0);
const curday = `${today.getDate()}`.padStart(2, 0);
const stringToday = [curyear, curmonth, curday].join('-');
console.log(stringToday);
//document.getElementById("curdate").innerHTML = stringToday;


// var map;
// function initMap() {
//   map = new google.maps.Map(document.getElementById('maps'), {
//     center: {lat: 49.2807323, lng: -123.117211},
//     zoom: 14
//   });
// }

var url = document.location.href;
var year = url.split('#')[1];
var make = url.split('#')[2];
var model = url.split('#')[3];
var start = url.split('#')[4];
var dest = url.split('#')[5];
//document.getElementById("startAddress").innerHTML = start;
//document.getElementById("destination").innerHTML = dest;
// $('#startAddress').html(start);
// $('#destination').html(dest);

function initMap() {
  var cardinfo;
  if (start === "%E2%9D%A4" && dest === "%E2%9D%A4") {
    cardinfo = '<iframe src="https://www.google.com/maps/d/embed?mid=144ORnQvKxfyfu9gCNtTiNSg0KtNUMY92&hl=en" width="640" height="480"></iframe>'
  } else {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('maps'), {
        center: {lat: 49.2807323, lng: -123.117211},
        zoom: 14
    });
    var geocoder = new google.maps.Geocoder();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('right-panel'));
    geocodeAddress(geocoder, map);
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  }
  getDistance();
  $('#busMap').html(cardinfo)
}

// To adjust center of the map after you show the route
function geocodeAddress(geocoder, resultsMap) {
  geocoder.geocode({'address': start}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: start,
    destination: dest,
    travelMode: 'WALKING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setOptions({ preserveViewport: true });
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function getDistance() {
  //Find the distance
  var distanceService = new google.maps.DistanceMatrixService();
  var startPosition;
  var endPosition;
  while (startA.includes("%20")) {
    startA = startA.replace('%20', ' ');
  }

  while (destB.includes("%20")) {
    destB = destB.replace('%20', ' ');
  }

  startPosition = startA;
  endPosition = destB;

  distanceService.getDistanceMatrix({
    origins: [startPosition],
    destinations: [endPosition],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    durationInTraffic: true,
    avoidHighways: false,
    avoidTolls: false
  },
    function (response, status) {
      if (status !== google.maps.DistanceMatrixStatus.OK) {
        console.log('Error:', status);
      } else {
        $("#distance").text(response.rows[0].elements[0].distance.text).show();
        $("#time").text(response.rows[0].elements[0].duration.text).show();
      }
    });
}