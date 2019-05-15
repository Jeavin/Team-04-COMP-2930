var tMode = "TRANSIT";




$('#DRIVING').on('click', () => {
  $('#collapseCar').collapse('show');
  $('#vehicle').show();
})

$(' #TRANSIT, #BICYCLING, #WALKING').on('click', () => {
  $('#collapseCar').collapse('hide');
  $('#vehicle').hide();
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
    dest = $('#destination').val();
    if(!(year === "Choose.." || make === "Choose.." || model === "Choose..")){
      document.getElementById("vehicle").innerHTML = year + " " + make + " " + model;
    }
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
document.getElementById("destination").value = dest;
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
  // while (start.includes("%20")) {
  //   start = start.replace('%20', ' ');
  // }

  // while (dest.includes("%20")) {
  //   dest = dest.replace('%20', ' ');
  // }

  // startPosition = start;
  // endPosition = dest;

  distanceService.getDistanceMatrix({
    origins: [start],
    destinations: [dest],
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