$(() => {
  const database = firebase.database();
  const rootRef = database.ref();

  //listens for user authentication status.
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $('.userName').html('<img class="mr-2 ml-2" src="./images/avatar.png" />'
        + user.displayName);
      console.log('user: ' + user.displayName);
      console.log('uid: ' + user.uid);
    } else {
      $('#settingIcon1, #settingIcon2').html('<a class="btn" id="signInUpButton"'
      + 'href="https://team-04-comp-2930.firebaseapp.com/html/login.html">'
      + 'SIGN IN/UP</a>');
      console.log('user: not log in');
    }
  });

 $('.signOutBtn').on('click', (e)=> {
    e.preventDefault();
    e.stopPropagation();
    firebase.auth().signOut();
    window.location.href = "https://team-04-comp-2930.firebaseapp.com/";
});

  $('#tripForm').on('click', (e)=>{
  });
})
