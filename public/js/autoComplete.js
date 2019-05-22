var autocomplete, autocomplete2;
//Enables the Start and Destination Text input boxes to autocomplete the
//locatinos from the Google place library
initAutocomplete();
$("#startAddress").focus(geolocate());
$("#destination").focus(geolocate());

//Set the boundary for available autocompletion locations for the Start and
//Destination Text input boxes
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

//Instantiate two new Autocomplete instances for the Start and Destination
//input fileds
function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
    (document.getElementById('startAddress')), {
      types: ['geocode']
    });
  autocomplete.setFields(['address_components', 'geometry']);
  autocomplete.addListener('place_changed', function() {
    let place = autocomplete.getPlace();
    //if it is heart emoji, or the locations from Goolge place library, do not
    //clear the input fileds
    if ($('#startAddress').val() !== "❤" && (!place || !place.geometry)) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      document.getElementById('startAddress').value = "";
    }
  });
  $('#startAddress').on('focusout', function() {
    google.maps.event.trigger(autocomplete, 'place_changed');
  });

  //autocomplete.addListener('place_changed', fillInAddress);
  autocomplete2 = new google.maps.places.Autocomplete(
    // /** @type {!HTMLInputElement} */
    (document.getElementById('destination')), {
      types: ['geocode']
    });
  autocomplete2.setFields(['address_components', 'geometry']);

  autocomplete2.addListener('place_changed', function() {
    let place = autocomplete2.getPlace();
    //if it is heart emoji, or the locations from Goolge place library, do not
    //clear the input fileds
    if ($('#destination').val() !== "❤" && (!place || !place.geometry)) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      document.getElementById('destination').value = "";
    }
  });
  $('#destination').on('focusout', function() {
    google.maps.event.trigger(autocomplete2, 'place_changed');
  });
  //autocomplete2.addListener('place_changed', fillInAddress);
}
