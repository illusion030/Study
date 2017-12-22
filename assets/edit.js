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

var is_changed = false

$(document).ready(function() {
    refresh()
})

function refresh() {
    $('#report_table > tbody').empty()
    is_changed = false
    $('#load_edit').show()
    database.ref('/報表').once('value').then (
        function(snapshot) {
            snapshot.forEach(function(snap) {
                $('#report_table > tbody:last-child').append('<tr id = "'+ snap.val()['請購編號'] +'"><td contenteditable="true" oninput = "edit_change()" class = "date">'+ snap.val()['建檔日期'] +'</td><td contenteditable="true" oninput = "edit_change()">'+ snap.val()['請購編號'] +'</td><td contenteditable="true" oninput = "edit_change()">'+ snap.val()['實施主軸'] +'</td><td contenteditable="true" oninput = "edit_change()">'+ snap.val()['請購類別'] +'</td><td contenteditable="true" oninput = "edit_change()">'+ snap.val()['請購項目'] +'</td><td contenteditable="true" oninput = "edit_change()">'+ snap.val()['請購金額'] +'</td><td contenteditable="true" oninput = "edit_change()">'+ snap.val()['傳票號碼'] +'</td><td><button class = "ui red basic button" onclick = "remove_edit(\''+ snap.val()['請購編號'] +'\')"><i class = "remove circle outline large red icon"></i>刪除</button></td></tr>')
            })
            $('#load_edit').hide()
        }
    )
}

function edit_change(){
    is_changed = true
}

function remove_edit(e) {
    $('#' + e + '').remove()
    is_changed = true
}

$('#edit_save').click(function(e) {
    
    e.preventDefault()
    
    if (is_changed) 
        $('#check_edit').modal('show')
    else
        $('#no_change').modal('show')
})

$('#edit_refresh').click(function(e) {

    e.preventDefault()
    refresh()    
})

$('.ui.ok.button').click(function(e) {

    var i = 1
    var updates = {}
    var data = {}

    $('#report_table > tbody > tr').each(function(i, item) {
        data[i+1] = {
            '建檔日期':item.cells[0].innerHTML,
            '請購編號':item.cells[1].innerHTML,
            '實施主軸':item.cells[2].innerHTML,
            '請購類別':item.cells[3].innerHTML,
            '請購項目':item.cells[4].innerHTML,
            '請購金額':item.cells[5].innerHTML,
            '傳票號碼':item.cells[6].innerHTML
        }
    })
    updates['/報表'] = data
    $('#load_edit').show()
    database.ref().update(updates).then(function() {
        is_changed = false
        $('#load_edit').hide()
        $('#success').modal('show')
    }).catch(function(err) {
        console.log('Edit failed.' + err)
        is_changed = false
        $('#load_edit').hide()
        $('#failed').modal('show')
    })
})
