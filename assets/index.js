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
var is_login

$(document).ready(function() {
    $('.modal').modal('setting', 'closable', false)
    checkCookie()

})

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";"
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

function checkCookie() {
    var user = getCookie("account")
    if (user != "") {
        $('#container').html("<div class = 'ui padded center aligned container'><p>現在帳號為: "+ user +"</p><button class = 'ui button' id = 'logout_btn'>登出</button></div>")
        $('#logout_btn').click(function() {
            setCookie('account', '')
            checkCookie()
            $('#logout_success').modal('show')
        })
    } else {
        $('#container').html("<div class = 'ui padded left aligned text container'><form id = 'login_form' class = 'ui form'><label class = 'ui large label'>帳號</label><input type = 'text' id = 'account'></input><br><br><label class = 'ui large label'>密碼</label><input type = 'password' id = 'pwd'></input><br><br></form><button class = 'ui right floated button' id = 'reg_btn'>註冊</button><button class = 'ui right floated button' id = 'login_btn'>登入</button></div>")
        var database = firebase.database();
        $('#login_btn').click(function() {
            is_login = false
            database.ref('/users').once('value').then(
                function(snapshot) {
                    snapshot.forEach(function(snap) {
                        if ($('#account').val() == snap.val()['account'] && $('#pwd').val() == snap.val()['pwd']) {
                            is_login = true
                        }
                    })
                   
                    if (is_login) {
                        $("#login_success").modal('show')
                        setCookie("account", $('#account').val())
                        checkCookie()
                    } else {
                        $("#login_failed").modal('show')
                    }
                }
            )
        })
        $('#reg_btn').click(function() {
            $('#reg_acc').val('')
            $('#reg_pwd').val('')
            $('#account').val('')
            $('#pwd').val('')
            $('#reg_err').remove()
            $('#reg_modal').modal('setting', {
                onApprove: function() {
                    return false;
                }
            }).modal('show')
        })
    }
}

$('#go_to_input').click(function() {
    
    var user = getCookie('account')
    if (user != "") {
        window.location = './report.html'
    } else {
        $('#not_login').modal('show')    
    }
})

$('#go_to_edit').click(function() {

    var user = getCookie('account')
    if (user != "") {
        window.location = './edit.html'
    } else {
        $('#not_login').modal('show')    
    }

})

$('#go_to_show').click(function() {

    var user = getCookie('account')
    if (user != "") {
        window.location = './show.html'
    } else {
        $('#not_login').modal('show')    
    }

})

$('#reg_ok').click(function(e) {
    e.preventDefault()
    var database = firebase.database()
    var repeat_acc = false

    if ($('#reg_acc').val() == "" || $('#reg_pwd').val() == "") {
        $('#reg_err').remove()
        $('<p id = "reg_err" style = "color:red;">帳號或密碼不得為空</p>').insertBefore('#reg_form')
    } else {
        database.ref('/users').once('value').then(function(users_exist) {
            var i = 1
            while(users_exist.val()[i]) {
                if ($('#reg_acc').val() == users_exist.val()[i]['account']) {
                    $('#reg_err').remove()
                    $('<p id = "reg_err" style = "color:red;"> 帳號名稱已被使用 </p>').insertBefore('#reg_form')
                    repeat_acc = true
                    break
                }
                i++
            }
            if (!repeat_acc) {
                $('#reg_err').remove()
                database.ref('/users').once('value').then(function(users) {
                    var count = users.numChildren()+1
                    var updates = {}
                    var data = {
                        'account':$('#reg_acc').val(),
                        'pwd':$('#reg_pwd').val()
                    }
                    updates['/users/' + count] = data
                    database.ref().update(updates).then(function() {
                        $('#reg_success').modal('show')
                    }).catch(function(err) {
                        console.log('Reg failed' + err)
                        $('#reg_failed').modal('show')
                    })
                })
            }
        })
    }
})
