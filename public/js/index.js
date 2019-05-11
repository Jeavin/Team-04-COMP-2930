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
      $('#settingIcon1, #settingIcon2').html('<button class="btn"'
      + 'type="button" id="signInButton" data-toggle="dropdown" '
      + 'aria-haspopup="true" aria-expanded="false">'
      + 'Sign In/Up</button>');
      console.log('user: not log in');
    }
  });

  $('#tripForm').on('click', (e)=>{
    e.preventDefault;
  })
})
