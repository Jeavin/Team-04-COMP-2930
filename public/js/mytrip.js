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
  // var cardinfo = '<iframe width="900" height="500" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyCAscZ2CNummIoeC_ihIV-3sKkjr3QypsU&origin=' + start + '&destination=' + dest + '&waypoints=' + start + '|' + dest + '" allowfullscreen> </iframe>';

  var cardinfo = '<iframe src="https://www.google.com/maps/d/embed?mid=144ORnQvKxfyfu9gCNtTiNSg0KtNUMY92&hl=en" width="640" height="480"></iframe>'
  $('#maps').append(cardinfo)
}
