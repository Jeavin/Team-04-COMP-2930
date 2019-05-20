// To show today's date
var today = new Date();
const curyear = today.getFullYear();
const curmonth = `${today.getMonth() + 1}`.padStart(2, 0);
const curday = `${today.getDate()}`.padStart(2, 0);
const stringToday = [curyear, curmonth, curday].join('-');
document.getElementById("curdate").innerHTML = stringToday;

// To split the URL and assign that info
var url = document.location.href;
var year = url.split('#')[1];
var make = url.split('#')[2];
var model = url.split('#')[3];
var start = url.split('#')[4];
var dest = url.split('#')[5];

while(start.includes("%20")){
    start = start.replace('%20',' ');
}

while(dest.includes("%20")){
    dest = dest.replace('%20',' ');
}

while(year.includes("%20")){
    year = year.replace('%20',' ');
}

while(make.includes("%20")){
    make = make.replace('%20',' ');
}

while(model.includes("%20")){
    model = model.replace('%20',' ');
}


document.getElementById("vehicle").innerHTML = year + " " + make + " " + model;
document.getElementById("startAddress").innerHTML = start;
document.getElementById("destination").innerHTML = dest;

// initialized the google map
function initMap(){
  var cardinfo;
  if(start === "%E2%9D%A4" && dest ==="%E2%9D%A4"){
    cardinfo = '<iframe src="https://www.google.com/maps/d/embed?mid=144ORnQvKxfyfu9gCNtTiNSg0KtNUMY92&hl=en" width="640" height="480"></iframe>'
    $('#maps').append(cardinfo);
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

//   Find the distance and time between two points.
function getDistance()
  {
     var distanceService = new google.maps.DistanceMatrixService();
     var startPosition;
     var endPosition;

     startPosition = start;
     endPosition = dest;

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