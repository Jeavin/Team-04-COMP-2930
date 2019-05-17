$(() => {

  var tMode = "TRANSIT";
  let start, dest;
  initMap();
  let url = decodeURIComponent(document.location.href);
  if (url.split('?')[1]) {
    let urlParts = url.split('?')[1].split('&');
    start = urlParts[0].split('=')[1].replace(/\+/g, ' ');
    dest = urlParts[1].split('=')[1].replace(/\+/g, ' ');
    $("#startAddress").val(start);
    $("#destination").val(dest);
    initMap();
  }

  //Autocomplete for start and destination address
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

  $('#DRIVING').on('click', () => {
    $('#collapseCar').collapse('show');
    $('#vehicle').show();
  })

  $(' #TRANSIT, #BICYCLING, #WALKING').on('click', () => {
    $('#collapseCar').collapse('hide');
    $('#vehicle').hide();
  })

  $(".travelMode").click(function () {
    tMode = $(this).val();
    initMap();
  });


  $(document).on('click', '#impactBtn',
    function redirect(e) {
      e.preventDefault();
      let year = $('#selectYear option:selected').val();
      let make = $('#selectMake option:selected').val();
      let model = $('#selectModel option:selected').val();
      start = $('#startAddress').val();
      dest = $('#destination').val();
      if (!(year === "Choose.." || make === "Choose.." || model === "Choose..")) {
        // document.getElementById("vehicle").innerHTML = year + " " + make + " " + model;
      }
      if (start === '' || dest === '') {
        
      }
      initMap();
    });


  // var today = new Date();
  // const curyear = today.getFullYear();
  // const curmonth = `${today.getMonth() + 1}`.padStart(2, 0);
  // const curday = `${today.getDate()}`.padStart(2, 0);
  // const stringToday = [curyear, curmonth, curday].join('-');

  // while (start.includes("%20")) {
  //   start = start.replace('%20', ' ');
  // }

  // while (dest.includes("%20")) {
  //   dest = dest.replace('%20', ' ');
  // }
  // document.getElementById("vehicle").innerHTML = year + " " + make + " " + model;

  function initMap() {
    var cardinfo;
    if (start === "❤" && dest === "❤") {
      cardinfo = '<iframe src="https://www.google.com/maps/d/embed?mid=1Bzw8XeW1VSzbZImwhCeWfTHMMMJJJ54d" width="100%" height="100%"></iframe>'
      $('#maps').html(cardinfo);
      return;
    } else {
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
      var map = new google.maps.Map(document.getElementById('maps'), {
        center: { lat: 49.2807323, lng: -123.117211 },
        zoom: 14
      });
      var geocoder = new google.maps.Geocoder();
      directionsDisplay.setMap(map);
      // directionsDisplay.setPanel(document.getElementsByClassName('rcorners')[0]);
      geocodeAddress(geocoder, map);
      calculateAndDisplayRoute(directionsService, directionsDisplay);
    }
    if ($("#startAddress").val() !== "" && $("#destination").val() !== "") {
      getDistance();
    }

  }

  // To adjust center of the map after you show the route
  function geocodeAddress(geocoder, resultsMap) {
    geocoder.geocode({ 'address': start }, function (results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: start,
      destination: dest,
      travelMode: google.maps.TravelMode[tMode]
    }, function (response, status) {
      if (status === 'OK') {
        directionsDisplay.setOptions({ preserveViewport: true });
        directionsDisplay.setDirections(response);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });
  }

  function getDistance() {
    //Find the distance
    var distanceService = new google.maps.DistanceMatrixService();
    distanceService.getDistanceMatrix({
      origins: [start],
      destinations: [dest],
      travelMode: google.maps.TravelMode[tMode],
      unitSystem: google.maps.UnitSystem.METRIC,
      durationInTraffic: true,
      avoidHighways: false,
      avoidTolls: false
    }, function (response, status) {
      if (status !== google.maps.DistanceMatrixStatus.OK) {
        console.log('Error:', status);
      } else {
        $("#distance").text(response.rows[0].elements[0].distance.text).show();
        $("#time").text(response.rows[0].elements[0].duration.text).show();
      }
    });
  }
})