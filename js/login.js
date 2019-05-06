$(document).ready(function () {
    console.log(firebase.auth().currentUser);

    firebase.auth().signOut();
    if (localStorage.checkBoxValidation && localStorage.checkBoxValidation != '') {
        $('#rememberMe').attr('checked', 'checked');
        $('#inputEmail').val(localStorage.userName);
    } else {
        $('#rememberMe').removeAttr('checked');
        $('#inputEmail').val('');
    }
    document.getElementById('signIn').addEventListener('click', toggleSignIn, false);

    $("#register").click(function (e) {
        $("#name").show(400);
        $("#phoneNumber").show(400);
        $("#profilephoto").show(400);
        e.preventDefault();
        $(this).html("Sign up");
        $("#signIn").removeClass("btn-primary");
        $("#signIn").addClass("btn-secondary");
        $("#signIn").html("Back");
        $("h1").html("Please Register");
        $(this).attr("id", "signUpbtn");
        document.getElementById('signUpbtn').addEventListener('click', handleSignUp, false);




    });
    $("#signIn").click(function (e) {
        if ($("#signIn").hasClass("btn-secondary")) {
            $("#signIn").html("Sign In");
            $("#signIn").addClass("btn-primary");
            $("#signIn").removeClass("btn-secondary");
            $("#name").hide(400);
            $("#phoneNumber").hide(400);
            $("#profilephoto").hide(400);
            $("h1").html("Please sign in");
            $("#signUpbtn").html("Register");

        }

        if ($('#rememberMe').is(':checked')) {
            // save username and password
            localStorage.userName = $('#inputEmail').val();
            localStorage.checkBoxValidation = $('#rememberMe').val();
        } else {
            localStorage.userName = '';
            localStorage.checkBoxValidation = '';
            $('#rememberMe').removeAttr('checked');
        }


        e.preventDefault();



    });

    //initApp();



});

function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = document.getElementById('inputEmail').value;
        var password = document.getElementById('inputPassword').value;

        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            initApp();
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


function handleSignUp() {
    var email = document.getElementById('inputEmail').value;
    var password = document.getElementById('inputPassword').value;

    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
        var database = firebase.database();
        var name = document.getElementById('name').value;
        var phonenumber = document.getElementById('phoneNumber').value;
        var profilepic = $("#profilephoto").val();
        var user = firebase.auth().currentUser;
        console.log(user);
        database.ref('users/' + user.uid).set({
            username: name,
            phonenumber: phonenumber,
            photourl: profilepic,
        }, function (error) {
            if (error) {
                // The write failed...
            } else {
                initApp();
            }
        });

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });



    // [END createwithemail]
}

function initApp() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            user.updateProfile({
                photoURL: $("#profilephoto").val()
            }).then(function () {
                window.location = '/pages/dashboard.html';
            });

        }
    });
}
/*function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function (user) {
        // [START_EXCLUDE silent]
        // [END_EXCLUDE]
        if (user) {
            var ref = firebase.database().ref("users/");
            ref.once("value")
                .then(function (snapshot) {
                    var idboolean = snapshot.child(user.uid).exists(); // {first:"Ada",last:"Lovelace"}
                    if (!idboolean) {
                        var database = firebase.database();
                        var name = document.getElementById('name').value;
                        var phonenumber = document.getElementById('phoneNumber').value;
                        var user = firebase.auth().currentUser;
                        console.log(user);
                        database.ref('users/' + user.uid).set({
                            username: name,
                            phonenumber: phonenumber,
                        });
                    }
                });
            // [END_EXCLUDE]
            //window.location = "/pages/dashboard.html";
        }
        // [END_EXCLUDE]
    });
} */