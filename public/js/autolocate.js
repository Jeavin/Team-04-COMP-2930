let geocoder = new google.maps.Geocoder();
$('#getLocationBtn').on('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let latlng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      geocoder.geocode({
          'location': latlng
        },
        function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              $('#startAddress').val(results[0].formatted_address);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
    });
  } else {
    console.log("Location information is unavailable.");
  }
});
