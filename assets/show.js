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
        $('#show_select').append ("<div class = 'ui checkbox'><input type = 'checkbox' checked = ''><label>" + snap.val() + "</label></div><br>")
        $('#report_table tr:last').after('<tr id = "row' + snap.val() + '"><td colspan = "6" align = "center" bgcolor = "F2FFFF">'+ snap.val() +'</td></tr>')
    })
    
    $('#show_select').append ("<br><button class = 'ui blue basic button' onclick = 'print_screen($(\"#print_table\"))'>列印</button><br>")
    $('.checkbox').checkbox({
        onChecked: function() {
            $('#row'+ $(this.nextSibling.firstChild)[0].textContent +'').show()
        },
        onUnchecked: function() {
            $('#row'+ $(this.nextSibling.firstChild)[0].textContent +'').hide()
        }
    })
})

database.ref('/報表').once('value').then (
    function(snapshot) {
        snapshot.forEach(function(snap) {
            $('#report_table tr:contains("'+ snap.val()['實施主軸'] +'")').after('<tr id = "row'+ snap.val()['實施主軸'] +'"><td>'+ snap.val()['建檔日期'] +'</td><td>'+ snap.val()['請購編號'] +'</td><td>'+ snap.val()['請購類別'] +'</td><td>'+ snap.val()['請購項目'] +'</td><td>'+ snap.val()['請購金額'] +'</td><td>'+ snap.val()['傳票號碼'] +'</td></tr>')
        })
        $('#load_show').hide()
    }
)

function print_screen(e) {
    $('#report_table').attr('width', '1000px')
    var value = $('#print_table').html()
    var print_page = window.open('', 'Printing...', '')
    print_page.document.open()
    print_page.document.write('<HTML><head></head><BODY onload = "window.print();window.close()">')
    print_page.document.write('<PRE>')
    print_page.document.write(value)
    print_page.document.write('</PRE>')
    print_page.document.close('</BODY></HTML>')
    $('#report_table').attr('width', '1200px')
}