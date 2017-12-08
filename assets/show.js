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

database.ref('/實施主軸').once('value').then(function(snapshot) {
    snapshot.forEach(function(snap) {
        $('#report_table tr:last').after('<tr><td colspan = "6" align = "center" bgcolor = "F2FFFF">'+ snap.val() +'</td></tr>')
    })

})



database.ref('/報表').once('value').then (
    function(snapshot) {
        snapshot.forEach(function(snap) {
            $('#report_table tr:contains("'+ snap.val()['實施主軸'] +'")').after('<tr><td>'+ snap.val()['建檔日期'] +'</td><td>'+ snap.val()['請購編號'] +'</td><td>'+ snap.val()['請購類別'] +'</td><td>'+ snap.val()['請購項目'] +'</td><td>'+ snap.val()['請購金額'] +'</td><td>'+ snap.val()['傳票號碼'] +'</td></tr>')
        })
    }
)
