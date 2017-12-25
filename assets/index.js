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
        })
    } else {
        $('#container').html("<div class = 'ui padded center aligned container'><p>現在有三組帳密分別為<br>帳:123 密:123<br>帳:456 密:456<br>帳:ctld 密:ctld<br><br>註冊還沒弄好</p><label class = 'ui large label'>帳號</label><input class = 'ui input' id = 'account'></input><br><br><label class = 'ui large label'>密碼</label><input class = 'ui input' id = 'pwd'></input><br><br><button class = 'ui button' id = 'login_btn'>登入</button><button class = 'ui button' id = 'reg_btn'>註冊</button></div>")
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
            $('#reg_modal').modal('show')
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
    var database = firebase.database();
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
})
