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
var remove_num = []

$(document).ready(function() {
    if (!user) {
        alert('請先登入')
        window.location = './index.html'
    } else {
        check_account()
    }
})

/****************** get user account ****************/
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

function check_account() {
    $('#load_admin').show()
    database.ref('/users').once('value').then(function(users) {
        user_count = 1
        users.forEach(function(u) {
            if (user == u.val()['account']) {
                c = user_count
                database.ref('/users/'+ c +'/admin').once('value').then (
                    function(snapshot) {
                        if (snapshot.val()) {
                            $('#toindex').before("<a href = './admin.html' class = 'large item'> 管理 </a>")
                            update_account()
                        } else {
                            alert('沒有權限')
                            window.location = './index.html'
                        }
                    }
                )
            }
            user_count++
        })
        $('#load_admin').hide()
    })
}

/*********** Update Function *****************/

function update_account() {
    $('#account_table > tbody').empty()
    
    $('#load_admin').show()
    database.ref('/users').once('value').then(function(users) {
        user_count = 1
        users.forEach(function(u) {
            var c = user_count
            database.ref('users/' + c ).once('value').then (
                function(snap) {
                    if (snap.val()['admin'] == 1) {
                        $('#account_table > tbody:last-child').append('<tr id = "user'+ c +'"><td>'+ c +'</td><td contenteditable="true" oninput = "edit_change()">'+ escapeHTML(snap.val()['account']) +'</td><td contenteditable="true" oninput = "edit_change()">'+ escapeHTML(snap.val()['pwd']) +'</td><td><div class = "ui selection dropdown" id = "drop' + snap.val()['account'] + '"><input type = "hidden" id = "admin"><i class = "dropdown icon"></i><div class = "default text">是</div></div></td><td><div class = "ui red basic animated button" onclick = "remove_edit(\''+ c +'\')"><div class = "visible content">刪除</div><div class = "hidden content"><i class = "remove circle outline large red icon"></i></div></div></td></tr>')
                        $('#drop' + snap.val()['account']).dropdown({
                            onChange: function() {
                                is_changed = true
                            },
                            values: [
                                {
                                    name: '是',
                                    value: '是',
                                    selected: true
                                },
                                {
                                    name: '否',
                                    value: '否'
                                }
                            ]
                        })
                    }
                    else {
                        $('#account_table > tbody:last-child').append('<tr id = "user'+ c +'"><td>'+ c +'</td><td contenteditable="true" oninput = "edit_change()">'+ escapeHTML(snap.val()['account']) +'</td><td contenteditable="true" oninput = "edit_change()">'+ escapeHTML(snap.val()['pwd']) +'</td><td><div class = "ui selection dropdown" id = "drop' + snap.val()['account'] + '"><input type = "hidden" id = "admin"><i class = "dropdown icon"></i><div class = "default text">否</div></div></td><td><div class = "ui red basic animated button" onclick = "remove_edit(\''+ c +'\')"><div class = "visible content">刪除</div><div class = "hidden content"><i class = "remove circle outline large red icon"></i></div></div></td></tr>')
                        $('#drop' + snap.val()['account']).dropdown({
                            onChange: function() {
                                is_changed = true
                            },
                            values: [
                                {
                                    name: '是',
                                    value: '是',
                                },
                                {
                                    name: '否',
                                    value: '否',
                                    selected: true
                                }
                            ]
                        })
                    }
                }
            )
            remove_num[c] = 0
            user_count++
        })
        is_changed = false
        $('#load_admin').hide()
    })
}

/******** Edit ********************/

$('#edit_save').click(function(e) {
    
    e.preventDefault()
    
    if (is_changed) 
        $('#check_edit').modal('show')
    else
        $('#no_change').modal('show')
})

$('#edit_refresh').click(function(e) {

    e.preventDefault()
    update_account()
})

$('.ui.ok.button').click(function(e) {

    var i = 1
    var updates = {}
    var data = {}
    var account = {}
    var pwd = {}
    var admin = {}

    $('#load_admin').show()
    
    for (var i = 1; i < remove_num.length; i++) {
        if (remove_num[i] == 1) {
            database.ref('/users/' + i + '').remove().then(function() {
            }).catch(function(err) {
                console.log('Edit failed.' + err)
                $('#failed').modal('show')
            })
        }
    }
    
    $('#account_table > tbody > tr').each(function(i, item) {
        
        if ($('#drop'+item.cells[1].innerHTML).dropdown('get value') == '是') {
            data = {
                'account':item.cells[1].innerHTML,
                'pwd':item.cells[2].innerHTML,
                'admin':1
            }
        } else {
            data = {
                'account':item.cells[1].innerHTML,
                'pwd':item.cells[2].innerHTML,
                'admin':0
            }
        }

        database.ref('/users/' + item.cells[0].innerHTML + '').update(data).then(function() {
        }).catch(function(err) {
            console.log('Edit failed.' + err)
            $('#failed').modal('show')
        })
    })

    is_changed = false
    $('#load_admin').hide()
    $('#success').modal('show')
    update_account()
})

function edit_change(){
    is_changed = true
}

function remove_edit(e) {
    $('#user' + e + '').remove()
    remove_num[e] = 1
    is_changed = true
}

/******** Prevent attack ********************/

function escapeHTML(data) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return data.replace(/[&<>"']/g, function(m) { return map[m]; })
}
