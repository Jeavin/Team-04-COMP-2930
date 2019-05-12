var today = new Date();
  const curyear = today.getFullYear();
  const curmonth = `${today.getMonth() + 1}`.padStart(2, 0);
  const curday = `${today.getDate()}`.padStart(2, 0);
  const stringToday = [curyear, curmonth, curday].join('-');
  console.log(stringToday);
  document.getElementById("curdate").innerHTML = stringToday;


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
document.getElementById("startAddress").innerHTML = start;
document.getElementById("destination").innerHTML = dest;
// $('#startAddress').html(start);
// $('#destination').html(dest);

function initMap(){
  var cardinfo;
  if(start === "%E2%9D%A4" && dest ==="%E2%9D%A4"){
    cardinfo = '<iframe src="https://www.google.com/maps/d/embed?mid=144ORnQvKxfyfu9gCNtTiNSg0KtNUMY92&hl=en" width="640" height="480"></iframe>'
  } else {
  cardinfo = '<iframe width="900" height="500" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyCAscZ2CNummIoeC_ihIV-3sKkjr3QypsU&origin=' + start + '&destination=' + dest + '&waypoints=' + start + '|' + dest + '" allowfullscreen> </iframe>';
  }
  getDistance();
  $('#maps').append(cardinfo)
}
function getDistance()
  {
     //Find the distance
     var distanceService = new google.maps.DistanceMatrixService();
     var startPosition;
     var endPosition;
     while(start.includes("%20")){
      start = start.replace('%20',' ');
     }

     while(dest.includes("%20")){
      dest = dest.replace('%20',' ');
     }

     startPosition = start;
     endPosition = dest;
    //  var startPosition = encodeURIComponent(start);
     console.log(startPosition);
    //  console.log(start);
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
            console.log(response);
            $("#distance").text(response.rows[0].elements[0].distance.text).show();
            $("#time").text(response.rows[0].elements[0].duration.text).show();
        }
    });
  }