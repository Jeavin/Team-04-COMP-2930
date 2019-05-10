var today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, 0);
  const day = `${today.getDate()}`.padStart(2, 0);
  const stringToday = [year, month, day].join('-');
  console.log(stringToday);
  document.getElementById("curdate").innerHTML = stringToday;


var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('maps'), {
    center: {lat: 49.2807323, lng: -123.117211},
    zoom: 14
  });
}
