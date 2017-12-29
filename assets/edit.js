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
var user = getCookie('account')
var user_count
var cb_count = {items: []}

$(document).ready(function() {
    refresh()
})

database.ref('/實施主軸').once('value').then(function(snapshot) {
    $('#show_select').append ("<div class = 'ui segment' id = 'date_seg'><div class = 'ui top left attached large label'>設定日期範圍</div></div>")
    $('#show_select').append ("<div class = 'ui segment' id = 'use_seg'><div class = 'ui top left attached large label'>實施主軸</div></div>")
    snapshot.forEach(function(snap) {
        $('#use_seg').append ("<div class = 'ui checkbox' id = 'cb"+ snap.val() +"'><input type = 'checkbox' checked = ''><label>" + snap.val() + "</label></div><br>")
        $('#cb'+ snap.val()).checkbox({
            onChecked: function() {
                show_count($(this.nextSibling.firstChild)[0].textContent, 'show')
            },
            onUnchecked: function() {
                show_count($(this.nextSibling.firstChild)[0].textContent, 'hide')
            }
        })
        database.ref('/請購類別').once('value').then(function(buy) {
            buy.forEach(function(b) {
                cb_count.items.push({use_id: snap.val(), buy_id: b.val(), count: 2})
            })
        })
    })
    console.log(cb_count.items)
})

database.ref('/請購類別').once('value').then(function(snapshot) {
    $('#show_select').append ("<div class = 'ui segment' id = 'buy_seg'><div class = 'ui top left attached large label'>請購類別</div></div>")
    snapshot.forEach(function(snap) {
        $('#buy_seg').append ("<div class = 'ui checkbox' id = 'cb"+ snap.val() +"'><input type = 'checkbox' checked = ''><label>" + snap.val() + "</label></div><br>")
        $('#cb'+ snap.val()).checkbox({
            onChecked: function() {
                show_count($(this.nextSibling.firstChild)[0].textContent, 'show')
            },
            onUnchecked: function() {
                show_count($(this.nextSibling.firstChild)[0].textContent, 'hide')
            }
        })
    })
})

function show_count(e, str) {

    for (i in cb_count.items) {
        if (e == cb_count.items[i].use_id)
            if (str == 'show')
                cb_count.items[i].count++
            else if (str == 'hide')
                cb_count.items[i].count--
        
        if (e == cb_count.items[i].buy_id)            
            if (str == 'show')
                cb_count.items[i].count++
            else if (str == 'hide')
                cb_count.items[i].count--
        
        if (cb_count.items[i].count == 2)
            $("#"+ cb_count.items[i].use_id + cb_count.items[i].buy_id +"").show()
        if (cb_count.items[i].count < 2)
            $("#"+ cb_count.items[i].use_id + cb_count.items[i].buy_id +"").hide()
    }
}

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

function refresh() {
    $('#report_table > tbody').empty()
    is_changed = false
    $('#load_edit').show()
    database.ref('/users').once('value').then(function(users) {
        user_count = 1
        users.forEach(function(u) {
            if (user == u.val()['account']) {
                var c = user_count
                database.ref('users/'+ c +'/報表').once('value').then (
                    function(snapshot) {
                        snapshot.forEach(function(snap) {
                            $('#report_table > tbody:last-child').append('<tr id = "'+ snap.val()['實施主軸'] + snap.val()['請購類別'] +'"><td contenteditable="true" oninput = "edit_change()" class = "date">'+ snap.val()['建檔日期'] +'</td><td contenteditable="true" oninput = "edit_change()">'+ snap.val()['請購編號'] +'</td><td contenteditable="true" oninput = "edit_change()">'+ snap.val()['實施主軸'] +'</td><td contenteditable="true" oninput = "edit_change()">'+ snap.val()['請購類別'] +'</td><td contenteditable="true" oninput = "edit_change()">'+ snap.val()['請購項目'] +'</td><td contenteditable="true" oninput = "edit_change()">'+ snap.val()['請購金額'] +'</td><td contenteditable="true" oninput = "edit_change()">'+ snap.val()['傳票號碼'] +'</td><td><button class = "ui red basic button" onclick = "remove_edit(\''+ snap.val()['請購編號'] +'\')"><i class = "remove circle outline large red icon"></i>刪除</button></td></tr>')
                        })
                        $('#load_edit').hide()
                    }
                )
            }
            user_count++
        })
    })
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

    $('#load_edit').show()
    database.ref('/users').once('value').then(function(users) {
        user_count = 1
        users.forEach(function(u) {
            if (user == u.val()['account']) {
                var c = user_count
                updates['users/'+ c +'/報表'] = data
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
            }
            user_count++
        })
    })
})
