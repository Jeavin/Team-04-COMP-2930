var autocomplete, autocomplete2;
/** 
 * Enables the Departure and Destination Text inputs boxes to autocomplete the user's geographical location,. 
 */
initAutocomplete();
$("#startAddress").focus(geolocate());
$("#destination").focus(geolocate());

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
  autocomplete.addListener('place_changed', function () {
    let place = autocomplete.getPlace();
    if ($('#destination').val() !== "❤" && (!place || !place.geometry)) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      document.getElementById('startAddress').value = "";
    }
  });
  $('#startAddress').on('focusout', function () {
    google.maps.event.trigger(autocomplete, 'place_changed');
  });

  //autocomplete.addListener('place_changed', fillInAddress);
  autocomplete2 = new google.maps.places.Autocomplete(
    // /** @type {!HTMLInputElement} */
    (document.getElementById('destination')), {
      types: ['geocode']
    });
  autocomplete2.setFields(['address_components', 'geometry']);

  autocomplete2.addListener('place_changed', function () {
    let place = autocomplete2.getPlace();
    if ($('#destination').val() !== "❤" && (!place || !place.geometry)) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      document.getElementById('destination').value = "";
    }
  });
  $('#destination').on('focusout', function () {
    google.maps.event.trigger(autocomplete2, 'place_changed');
  });
  //autocomplete2.addListener('place_changed', fillInAddress);
}