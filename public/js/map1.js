var autocomplete, autocomplete2;
var tMode = "TRANSIT";

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
    (document.getElementById('startAddress')), {
      types: ['geocode']
    });
  autocomplete.setFields(['address_components', 'geometry']);


  //autocomplete.addListener('place_changed', fillInAddress);
  autocomplete2 = new google.maps.places.Autocomplete(
    (document.getElementById('dest')), {
      types: ['geocode']
    });
  autocomplete2.setFields(['address_components', 'geometry']);
  //autocomplete2.addListener('place_changed', fillInAddress);
}



$('#DRIVING').on('click', () => {
  $('#collapseCar').collapse('show');
})

// $('#DRIVING').on('click', () => {
//   console.log($(this).id);
// })

$(' #TRANSIT, #BICYCLING, #WALKING').on('click', () => {
  $('#collapseCar').collapse('hide');
})

$(".travelMode").click(function() {
  tMode = $(this).val();
  initMap();
});

let start, dest;
$(document).on('click', '#impactBtn',
  function redirect(e) {
    e.preventDefault();
    let year = $('#selectYear option:selected').val();
    let make = $('#selectMake option:selected').val();
    let model = $('#selectModel option:selected').val();
    start = $('#startAddress').val();
    dest = $('#dest').val();
    document.getElementById("vehicle").innerHTML = year + " " + make + " " + model;
    initMap();
    // window.location.href = "./mytrip.html" + "#" + year + "#" + make + "#"
    // + model + "#"+ startA + "#"+ destB;
  });







var today = new Date();
const curyear = today.getFullYear();
const curmonth = `${today.getMonth() + 1}`.padStart(2, 0);
const curday = `${today.getDate()}`.padStart(2, 0);
const stringToday = [curyear, curmonth, curday].join('-');


var url = document.location.href;
start = url.split('#')[1];
dest = url.split('#')[2];

while(start.includes("%20")){
  start = start.replace('%20',' ');
}

while(dest.includes("%20")){
  dest = dest.replace('%20',' ');
}

document.getElementById("startAddress").value = start;
document.getElementById("dest").value = dest;
// document.getElementById("vehicle").innerHTML = year + " " + make + " " + model;

initMap();


function initMap() {
  var cardinfo;
  if (start === "%E2%9D%A4" && dest === "%E2%9D%A4") {
    cardinfo = '<iframe src="https://www.google.com/maps/d/embed?mid=144ORnQvKxfyfu9gCNtTiNSg0KtNUMY92&hl=en" width="640" height="480"></iframe>'
    $('#maps').html(cardinfo);
  } else {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('maps'), {
        center: {lat: 49.2807323, lng: -123.117211},
        zoom: 14
    });
    var geocoder = new google.maps.Geocoder();
    directionsDisplay.setMap(map);
    // directionsDisplay.setPanel(document.getElementById('right-panel'));
    geocodeAddress(geocoder, map);
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  }
  getDistance();
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
    travelMode: google.maps.TravelMode[tMode]
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
  while (start.includes("%20")) {
    start = start.replace('%20', ' ');
  }

  while (dest.includes("%20")) {
    dest = dest.replace('%20', ' ');
  }

  startPosition = start;
  endPosition = dest;

  distanceService.getDistanceMatrix({
    origins: [startPosition],
    destinations: [endPosition],
    travelMode: google.maps.TravelMode[tMode],
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