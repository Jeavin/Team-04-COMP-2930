$(() => {
  //listens for user authentication status.
  firebase.auth().onAuthStateChanged(function (user) {
    //if a user is logged in
    if (user) {
      //change the top right corner to the user icon and user name
      $('.userName').html('<img class="mr-2 ml-2" src="./images/avatar.png" ' +
        'height="25"/>' + user.displayName);
      $('button[data-toggle="modal"]').remove();
      console.log('user: ' + user.displayName);
      console.log('uid: ' + user.uid);
    } else {
      $('#settingIcon1, #settingIcon2').html('<button class="btn bg-success ' +
        'text-white" id="signInUpButton" data-toggle="modal" ' +
        'data-target="#exampleModal1">SIGN IN</button>');
      console.log('user: not log in');
    }
  });

  //when this modal shows, close the other one by triggering the click event the
  //close button
  $('#exampleModal1').on('shown.bs.modal', function () {
    $('#modal2CloseBtn').click();
  });

  //when this modal shows, close the other one by triggering the click event the
  //close button
  $('#exampleModal2').on('shown.bs.modal', function () {
    $('#modal1CloseBtn').click();
  });

  //when the user press the enter key after done inputing the password, handle
  //the sign in credential
  $('#inputPassword').on("keypress", function (e) {
    if (e.which === 13) {
      toggleSignIn();
    }
  });

  //when the user press the enter key after done inputing the password, handle
  //the sign up credential
  $('#createPassword').on("keypress", function (e) {
    if (e.which === 13) {
      handleSignUp();
    }
  });

  //sign lout the corrent user
  $('.signOutBtn').on('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    firebase.auth().signOut();
    window.location.href = "./index.html";
  });

  //store the user name into the local storage
  if (localStorage.checkBoxValidation &&
    localStorage.checkBoxValidation != '') {
    $('#rememberMe').attr('checked', 'checked');
    $('#inputEmail').val(localStorage.userName);
  } else {
    $('#rememberMe').removeAttr('checked');
    $('#inputEmail').val('');
  }

  $('#signIn').on('click', toggleSignIn);
  $('#modalSignUpBtn').on('click', handleSignUp);

  $("#signIn").click(function (e) {
    e.preventDefault();
    if ($('#rememberMe').is(':checked')) {
      // save username and password
      localStorage.userName = $('#inputEmail').val();
      localStorage.checkBoxValidation = $('#rememberMe').val();
    } else {
      localStorage.userName = '';
      localStorage.checkBoxValidation = '';
      $('#rememberMe').removeAttr('checked');
    }
  });

  //validate the credential when signing in
  function toggleSignIn() {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    } else {
      var email = $('#inputEmail').val();
      var password = $('#inputPassword').val();
      firebase.auth().signInWithEmailAndPassword(email, password).
        then(function () {
          location.reload(true);
        }).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          document.getElementById('signIn').disabled = false;
          // [END_EXCLUDE]
        });
      // [END authwithemail]
    }
    document.getElementById('signIn').disabled = false;
  }

  //validate the credential when signing up
  function handleSignUp() {
    var email = document.getElementById('createEmail').value;
    var password = document.getElementById('createPassword').value;

    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).
      then(function () {
        var database = firebase.database();

        var name = document.getElementById('name').value;
        var user = firebase.auth().currentUser;
        console.log(user);
        database.ref('users/' + user.uid).set({
          username: name,
          email: email,
        }, function (error) {
          if (error) {
            // The write failed..
          } else {
            user.updateProfile({
              displayName: $('#name').val()
            }).then(function () {
              location.reload(true);
            });
          }
        });
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  }
});
