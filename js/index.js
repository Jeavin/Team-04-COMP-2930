$(() => {
  const database = firebase.database();
  const rootRef = database.ref();

  $(window).on('resize', function () {
    var win = $(this); //this = window
    if (win.height() >= 920) {
      $('#settingIcon').html(
        '<button class="btn text-uppercase" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        '<img class="mr-2" src="../images/avatar.png" />' + user.displayName + '</button>' +
        '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">' +
        '<a class="dropdown-item" href="#">Setting</a>' +
        '<a class="dropdown-item" href="#">History</a>' +
        '<a class="dropdown-item" href="#">Sign Out</a></div>'
      );
    } else {
      $('#settingIcon').html('<button class="btn " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="../images/settingsIcon.png" /></button><div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton"><a class="dropdown-item text-uppercase" href="#"><img class="mr-2" src="../images/avatar.png" />' + user.displayName + '</a><a class="dropdown-item" href="#">History</a><a class="dropdown-item" href="#">Sign Out</a></div>');
    }
  });

  //listens for user authentication status.
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      if ($(window).width <= 992) {
        $('#settingIcon').html('<button class="btn " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="../images/settingsIcon.png" /></button><div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton"><a class="dropdown-item text-uppercase" href="#"><img class="mr-2" src="../images/avatar.png" />' + user.displayName + '</a><a class="dropdown-item" href="#">History</a><a class="dropdown-item" href="#">Sign Out</a></div>');
      } else {
        $('#settingIcon').html('<button class="btn text-uppercase" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img class="mr-2" src="../images/avatar.png" />' + user.displayName + '</button><div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton"><a class="dropdown-item" href="#">Setting</a><a class="dropdown-item" href="#">History</a><a class="dropdown-item" href="#">Sign Out</a></div>');
      }
      // var userUid = user.uid;
      // var currentUserRef = database.ref('users/' + userUid);
      // console.log('onAuthStateChanged: ' + userUid);
      // setUsername(currentUserRef);
      // loopForUserGroups(currentUserRef);
      // //loopForUserAgendas(currentUserRef);
      console.log('user: ' + user.displayName);
    } else {
      $('#settingIcon').html('<button class="btn " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <a href="#"><img src="../images/avatar.png" width="30" height="30"/>Sign In/Up</a> </button>');
      console.log('user not log in');
    }
  });
})