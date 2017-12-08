// Initialize Firebase
var config = {
    apiKey: "AIzaSyBFGPR8vup0avlwXWn7P0p--ucM9JOz_Is",
    authDomain: "study-c1f03.firebaseapp.com",
    databaseURL: "https://study-c1f03.firebaseio.com",
    projectId: "study-c1f03",
    storageBucket: "study-c1f03.appspot.com",
    messagingSenderId: "1098207976094"
};
firebase.initializeApp(config);

var database = firebase.database();

$('#login_send').click(function(e){

    e.preventDefault()

    database.ref('/users/user_1').once('value').then (
        function(snapshot) {
            if ($('#login_account').val() != snapshot.val().account)
                alert('wrong account')
            else if ($('#login_password').val() != snapshot.val().pwd) 
                alert('wrong pwd')
            else
                document.location.href = "./choose.html"
        }
    )
})
