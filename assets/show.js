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
var user = getCookie('account')
var user_count

function getCookie(cname) {
    var name = cname + "="
    var decodedCookie = decodeURIComponent(document.cookie)
    var ca = decodedCookie.split(';')
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while(c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

database.ref('/users').once('value').then(function(users) {
    user_count = 1
    users.forEach(function(u) {
        if (user == u.val()['account']) {
            c = user_count
            database.ref('users/'+ c +'/報表').once('value').then (
                function(snapshot) {
                    snapshot.forEach(function(snap) {
                        $('#report_table tr:contains("'+ snap.val()['實施主軸'] +'")').after('<tr id = "row'+ snap.val()['實施主軸'] +'"><td>'+ snap.val()['建檔日期'] +'</td><td>'+ snap.val()['請購編號'] +'</td><td>'+ snap.val()['請購類別'] +'</td><td>'+ snap.val()['請購項目'] +'</td><td>'+ snap.val()['請購金額'] +'</td><td>'+ snap.val()['傳票號碼'] +'</td></tr>')
                    })
                    $('#load_show').hide()
                }
            )
        }
        user_count++
    })
})

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

function print_screen(e) {
    $('#report_table').attr('width', '1000px')
    var value = $('#print_table').html()

    var print_page = window.open('', 'PRINT', 'height=400,eidth=600')
    print_page.document.write('<HTML><head><title> Report </title></head><body>')
    print_page.document.write(value)
    print_page.document.write('</body></html>')
    
    print_page.document.close()
    print_page.focus()
    
    print_page.print()
    print_page.close()
    
    $('#report_table').attr('width', '1200px')
}
