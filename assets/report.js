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

$(document).ready(function() {

$('#report_date').datepicker({ dateFormat: 'yy/mm/dd' })
$('#report_date').datepicker('setDate', new Date())
$('#buy_money').val('NT$0')

})

$('#buy_money').focusout(function() {
    if ($.isNumeric($('#buy_money').val())) {
        var num = $('#buy_money').val()
        $('#buy_money').val('NT$' + num)
    }
})

database.ref('/實施主軸').once('value').then (
    function(snapshot) {
        var i = 1
        while (snapshot.val()[i]) {
            $("#use_title").find('.menu').append("<div class = 'item' data-value = '" + snapshot.val()[i] + "'>" + snapshot.val()[i]  + "</div>");
            i++
        }
        $('#use_title').dropdown()
    }
)

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

$('#save_report').click(function(e) {
    
    e.preventDefault()

    $('#check_save').modal('show')
})
    
$('.ui.ok.button').click(function(e){
    e.preventDefault()
    database.ref('/報表').once('value').then (
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
            updates['/報表/' + count] = data
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

})

$('.ui.cancel.button').click(function(e){
      e.preventDefault()
})
