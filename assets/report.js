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

/**********  Report  **********/

$(document).ready(function() {
    update_use()
    update_buy()
    $('#report_date').datepicker({ dateFormat: 'yy/mm/dd' })
    $('#report_date').datepicker('setDate', new Date())
    $('#buy_money').val('NT$0')
    $('.modal').modal('setting', 'closable', false)
})

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

$('#buy_money').focusout(function() {
    if ($.isNumeric($('#buy_money').val())) {
        var num = $('#buy_money').val()
        $('#buy_money').val('NT$' + num)
    }
})

function update_use() {
    $('#load_report').show()
    $('#use_menu').empty()
    database.ref('/實施主軸').once('value').then (
        function(snapshot) {
            var i = 1
            while (snapshot.val()[i]) {
                $("#use_title").find('.menu').append("<div class = 'item' data-value = '" + snapshot.val()[i] + "'>" + snapshot.val()[i]  + "</div>");
                i++
            }
            $('#use_title').dropdown()
            $('#load_report').hide()
        }
    )
}

function update_buy() {
    $('#load_report').show()
    $('#buy_menu').empty()
    database.ref('/請購類別').once('value').then (
        function(snapshot) {
            var i = 1
            while (snapshot.val()[i]) {
                $("#buy_type").find('.menu').append("<div class = 'item' data-value = '" + snapshot.val()[i] + "'>" + snapshot.val()[i]  + "</div>");
                i++
            }
            $('#buy_type').dropdown()
            $('#load_report').hide()
        }
    )
}

$('#report_save').click(function(e) {
    e.preventDefault()
    $('#check_report').modal('show')
})

$('#report_ok').click(function(e){
    e.preventDefault()
    $('#load_report').show()
    database.ref('/users').once('value').then(function(users) {
        user_count = 1
        users.forEach(function(u) {
            if (user == u.val()['account']) {
                c = user_count
                database.ref('/users/'+ c +'/報表').once('value').then (
                    function(snapshot) {
                        var count = snapshot.numChildren()+1
                        var updates = {}
                        var data = {
                            '建檔日期':$('#report_date').val(),
                            '請購編號':$('#buy_num').val(),
                            '實施主軸':$('#use_title').dropdown('get value'),
                            '請購類別':$('#buy_type').dropdown('get value'),
                            '請購項目':$('#buy_name').val(),
                            '請購金額':$('#buy_money').val(),
                            '傳票號碼':$('#ticket_num').val()
                        }
                        updates['/users/'+ c +'/報表/'+ count] = data
                        database.ref().update(updates).then(function() {
                            $('#report_date').datepicker('setDate', new Date())
                            $('#buy_num').val('')
                            $('.ui.dropdown').dropdown('clear')
                            $('#buy_name').val('')
                            $('#buy_money').val('NT$0')
                            $('#ticket_num').val('')
                            $('#success').modal('show')
                        }).catch(function(err) {
                            console.log('Save failed.' + err)
                            $('#failed').modal('show')
                        })
                    }
                )
            }
            user_count++
        })
        $('#load_report').hide()
    })

})

/*****************************************************/
/***************  Edit use  **************************/

$('#edit_use').click(function(e) {
    
    e.preventDefault()

    $('#use_table > tbody').empty()

    database.ref('/實施主軸').once('value').then (
        function(snapshot) {
            var i = 1
            while (snapshot.val()[i]) {
                $("#use_table > tbody:last-child").append('<tr id = "'+ snapshot.val()[i] +'"><td contenteditable = "true">'+ snapshot.val()[i] +'</td><td><button class = "ui red basic button" onclick = "remove_use(\''+ snapshot.val()[i] +'\')"><i class = "remove circle outline large red icon"></i>刪除</button><button class = "circular ui green right floated icon button" onclick = "button_down(this)"><i class = "icon angle double down"></i></button><button class = "circular ui green right floated icon button" onclick = "button_up(this)"><i class = "icon angle double up"></i></button></td></tr>')
                i++
            }
            $('#use_modal').modal('show')
        }
    )
    
})

$('#add_use').click(function(e) {
    e.preventDefault()
    var item = $('#add_use_input').val()
    
    if (item) { 
        $("#use_table > tbody:last-child").append('<tr id = "'+ item +'"><td contenteditable="true">'+ item +'</td><td><button class = "ui red basic button" onclick = "remove_use(\''+ item +'\')"><i class = "remove circle outline large red icon"></i>刪除</button><button class = "circular ui green right floated icon button" onclick = "button_down(this)"><i class = "icon angle double down"></i></button><button class = "circular ui green right floated icon button" onclick = "button_up(this)"><i class = "icon angle double up"></i></button></td></tr>')
        $('#add_use_input').val('')
    }
})

$('#use_save').click(function(e) {
    e.preventDefault()
    $('#check_use').modal('show')
})

$('#use_ok').click(function(e){
      e.preventDefault()
      
      var i = 1
      var updates = {}
      var data = {}

      $('#use_table > tbody > tr > td:first-child').each(function(i, item) {
          data[i+1] = item.innerHTML
      })
      updates['/實施主軸'] = data
      database.ref().update(updates).then(function() {
          update_use()
          $('#success').modal('show')
      }).catch(function(err) {
          console.log('Save failed.' + err)
          $('#failed').modal('show')
      })
})

$('#use_cancel').click(function(e){
      e.preventDefault()
      $('#use_modal').modal('show')
})

$('#use_close').click(function(e){
      e.preventDefault()
      $('#use_modal').modal('hide')
})

/***************************************************/
/***************  Edit buy  ************************/

$('#edit_buy').click(function(e) {
    
    e.preventDefault()

    $('#buy_table > tbody').empty()
   
    database.ref('/請購類別').once('value').then (
        function(snapshot) {
            var i = 1
            while (snapshot.val()[i]) {
                $("#buy_table > tbody:last-child").append('<tr id = "'+ snapshot.val()[i] +'"><td contenteditable="true">'+ snapshot.val()[i] +'</td><td><button class = "ui red basic button" onclick = "remove_use(\''+ snapshot.val()[i] +'\')"><i class = "remove circle outline large red icon"></i>刪除</button><button class = "circular ui green right floated icon button" onclick = "button_down(this)"><i class = "icon angle double down"></i></button><button class = "circular ui green right floated icon button" onclick = "button_up(this)"><i class = "icon angle double up"></i></button></td></tr>')
                i++
            }
            $('#buy_modal').modal('show')
        }
    )
})

$('#add_buy').click(function(e) {
    e.preventDefault()
    var item = $('#add_buy_input').val()
    
    if (item) { 
        $("#buy_table > tbody:last-child").append('<tr id = "'+ item +'"><td contenteditable="true">'+ item +'</td><td><button class = "ui red basic button" onclick = "remove_use(\''+ item +'\')"><i class = "remove circle outline large red icon"></i>刪除</button><button class = "circular ui green right floated icon button" onclick = "button_down(this)"><i class = "icon angle double down"></i></button><button class = "circular ui green right floated icon button" onclick = "button_up(this)"><i class = "icon angle double up"></i></button></td></tr>')
        $('#add_buy_input').val('')
    }
})

$('#buy_save').click(function(e) {
    e.preventDefault()
    $('#check_buy').modal('show')
})

$('#buy_ok').click(function(e){
      e.preventDefault()
      
      var i = 1
      var updates = {}
      var data = {}

      $('#buy_table > tbody > tr > td:first-child').each(function(i, item) {
          data[i+1] = item.innerHTML
      })
      updates['/請購類別'] = data
      database.ref().update(updates).then(function() {
          update_buy()
          $('#success').modal('show')
      }).catch(function(err) {
          console.log('Save failed.' + err)
          $('#failed').modal('show')
      })
})

$('#buy_cancel').click(function(e){
      e.preventDefault()
      $('#buy_modal').modal('show')
})

$('#buy_close').click(function(e){
      e.preventDefault()
      $('#buy_modal').modal('hide')
})

/****************************************************/
/***************  Event function  *******************/

function remove_use(e) {
    $('#'+ e +'').remove()
}

function button_down(e) {
    row = $(e).parents('tr:first')
    row.insertAfter(row.next())
}

function button_up(e) {
    row = $(e).parents('tr:first')
    row.insertBefore(row.prev())
}

$('#cancel').click(function(e){
      e.preventDefault()
})

/***************************************************/
