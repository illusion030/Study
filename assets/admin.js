// Initialize Firebase
/*var config = {
    apiKey: "AIzaSyBU_I-ktYmDZYAZVV5B47Ki6pYTKA0yrB8",
    authDomain: "reportsys-30221.firebaseapp.com",
    databaseURL: "https://reportsys-30221.firebaseio.com",
    projectId: "reportsys-30221",
    storageBucket: "",
    messagingSenderId: "654646484556"
};*/

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
        c = 1
        users.forEach(function(u) {
            if (u.val()['admin'] == 1) {
                $('#account_table > tbody:last-child').append('<tr id = "user'+ c +'"><td>'+ c +'</td><td>'+ escapeHTML(u.val()['account']) +'</td><td><div class = "ui selection dropdown" id = "drop' + u.val()['account'] + '"><input type = "hidden" id = "admin"><i class = "dropdown icon"></i><div class = "default text">是</div></div></td><td><div class = "ui blue basic animated button" onclick = "edit_number(\''+ c +'\')"><div class = "visible content">修改</div><div class = "hidden content"><i class = "large edit icon"></i></div></div></td><td><div class = "ui red basic animated button" onclick = "remove_edit(\''+ c +'\')"><div class = "visible content">刪除</div><div class = "hidden content"><i class = "remove circle outline large red icon"></i></div></div></td></tr>')
                $('#drop' + u.val()['account']).dropdown({
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
                $('#account_table > tbody:last-child').append('<tr id = "user'+ c +'"><td>'+ c +'</td><td>'+ escapeHTML(u.val()['account']) +'</td><td><div class = "ui selection dropdown" id = "drop' + u.val()['account'] + '"><input type = "hidden" id = "admin"><i class = "dropdown icon"></i><div class = "default text">否</div></div></td><td><div class = "ui blue basic animated button" onclick = "edit_number(\''+ c +'\')"><div class = "visible content">修改</div><div class = "hidden content"><i class = "large edit icon"></i></div></div></td><td><div class = "ui red basic animated button" onclick = "remove_edit(\''+ c +'\')"><div class = "visible content">刪除</div><div class = "hidden content"><i class = "remove circle outline large red icon"></i></div></div></td></tr>')
                $('#drop' + u.val()['account']).dropdown({
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
            remove_num[c] = 0
            c++
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

$('edit_ok').click(function(e) {

    var i = 1
    var updates = {}
    var data = {}

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

    var all_users = {}
    var each_users = {}

    database.ref('/users').once('value').then(function(users) {
        c = 1
        users.forEach(function(u) {
            each_users[c] = u.val()
            c++
        })
        c = 1
        $('#account_table > tbody > tr').each(function(i, item) {
            if ($('#drop'+item.cells[1].innerHTML).dropdown('get value') == '是') {
                each_users[c]['account'] = item.cells[1].innerHTML
                each_users[c]['admin'] = 1
            } else {
                each_users[c]['account'] = item.cells[1].innerHTML
                each_users[c]['admin'] = 0
            }
            c++
        })
        all_users["users"] = each_users
        database.ref('/').update(all_users).then(function() {
            is_changed = false
            $('#load_admin').hide()
            $('#success').modal('show')
            update_account()
        }).catch(function(err) { 
            console.log('Edit failed.' + err)
            $('failed').modal('show')
        })
    })
})

function edit_change(){
    is_changed = true
}

function remove_edit(e) {
    $('#user' + e + '').remove()
    remove_num[e] = 1
    is_changed = true
}

/***************  Edit number  **************************/
var user_number

function edit_number(user_num) {
    var has_insert = []
    has_insert.length = 0
    var insert_count = 0
    user_number = user_num
    $('#user_table > tbody').empty()
    $('#number_table > tbody').empty()
    database.ref('/users/' + user_num).once('value').then (function(snapshot) {
        i = 1
        if (snapshot.val()) {
            for (var y in snapshot.val()['會編']) {
                j = 1
                while (snapshot.val()['會編'][y][j]) {
                    $("#user_table > tbody:last-child").append('<tr id = "'+ snapshot.val()['會編'][y][j] +'"><td>' + y + '</td><td>'+ snapshot.val()['會編'][y][j] +'</td><td><div class = "ui buttons"><div class = "ui green basic animated vertical button" onclick = "button_move(this)"><div class = "visible content">移動</div><div class = "hidden content"><i class = "exchange large icon"></i></div></div><div class = "ui red basic animated vertical button" onclick = "remove_item(\''+ snapshot.val()['會編'][y][j] +'\')"><div class = "visible content">刪除</div><div class = "hidden content"><i class = "remove circle outline large red icon"></i></div></div></div></td></tr>')
                    has_insert[insert_count] = snapshot.val()['會編'][y][j]
                    insert_count++
                    j++
                }
            }
        }
        database.ref('/年度').once('value').then (function(snapshot) {
            snapshot.forEach(function(snap) {
                database.ref('/會編/' + snap.val()).once('value').then(function(s) {
                    s.forEach(function(num) {
                        flag = 0
                        for (i = 0; i < insert_count; i++) {
                            if (has_insert[i] == num.val())
                                flag = 1
                        }
                        if (!flag)
                            $("#number_table > tbody:last-child").append('<tr id = "'+ num.val() +'"><td>' + snap.val() + '</td><td>'+ num.val() +'</td><td><div class = "ui buttons"><div class = "ui green basic animated vertical button" onclick = "button_move(this)"><div class = "visible content">移動</div><div class = "hidden content"><i class = "exchange large icon"></i></div></div><div class = "ui red basic animated vertical button" onclick = "remove_item(\''+ num.val() +'\')"><div class = "visible content">刪除</div><div class = "hidden content"><i class = "remove circle outline large red icon"></i></div></div></div></td></tr>')
                    })
                })
            })
        $('#number_modal').modal('show')
        })
    })
}

$('#add_number').click(function(e) {
    e.preventDefault()
    var item = $('#add_number_input').val()
    
    if (item) { 
        $("#number_table > tbody:last-child").append('<tr id = "'+ item +'"><td contenteditable = "true">'+ item +'</td><td><div class = "ui buttons"><div class = "ui green basic animated vertical button" onclick = "button_up(this)"><div class = "visible content">上移</div><div class = "hidden content"><i class = "angle double up large icon"></i></div></div><div class = "ui green basic animated vertical button" onclick = "button_down(this)"><div class = "visible content">下移</div><div class = "hidden content"><i class = "angle double down large icon"></i></div></div><div class = "ui red basic animated vertical button" onclick = "remove_item(\''+ item +'\')"><div class = "visible content">刪除</div><div class = "hidden content"><i class = "remove circle outline large red icon"></i></div></div></div></td></tr>')
        $('#add_number_input').val('')
    }
})

$('#number_save').click(function(e) {
    e.preventDefault()
    $('#check_number').modal('show')
})

$('#number_ok').click(function(e){
      
    e.preventDefault()
    var data = {}
    var updates = {}
    var count = {}
    var eachdata = {}
    var eachyear = {}
    var c_array = []
    $('#load_admin').show()

    $('#user_table > tbody > tr').each(function(i, item) {
        if (!count[item.cells[0].innerHTML]) {
            count[item.cells[0].innerHTML] = 1
        } else {
            count[item.cells[0].innerHTML] += 1
        }
        if (!c_array.includes(item.cells[0].innerHTML)) {
            c_array.push("|||")
            c_array.push(item.cells[0].innerHTML);
        }
        for (i = 0; i < c_array.length; i++) {
            if (c_array[i] == item.cells[0].innerHTML) {
                c_array.splice(i + 2, 0, item.cells[1].innerHTML)
            }
        }
    })
    for (i = 0; i < c_array.length; i++) {
        if (c_array[i] == "|||") {
            for (j = 1; i + 1 + j < c_array.length; j++) {
                if (c_array[i + 1 + j] == "|||")
                    break;
                eachdata[j] = c_array[i + 1 + j]
            }
            eachyear[c_array[i + 1]] = Object.assign({}, eachdata)
        }
    }
    data['會編'] = eachyear
    database.ref('/users').once('value').then(function(users) {
        i = 1
        users.forEach(function(u) {
            if (u.val()['account'] == user) {
                database.ref('/users/' + user_number).update(data).then(function() {
                    $('#load_admin').hide()
                    $('#success').modal('show')
                }).catch(function(err) { 
                    console.log('Edit failed.' + err)
                    $('failed').modal('show')
                })
            }
            i++
        })
    })
})

function remove_item(e) {
    $('#'+ e +'').remove()
}

/********************************************/


$('#number_cancel').click(function(e){
    e.preventDefault()
    $('#number_modal').modal('show')
})

          
$('#number_close').click(function(e){
    e.preventDefault()
    $('#number_modal').modal('hide')
})

function button_move(e) {
    row = $(e).parents('tr:first')
    if (row.parents('table:first').attr('id') == 'number_table') {
        $('#user_table tbody').append(row)
    } else {
        $('#number_table tbody').append(row)
    }
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
