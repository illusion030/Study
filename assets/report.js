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

$('#report_date').datepicker({ dateFormat: 'yy/mm/dd' })
$('#report_date').datepicker('setDate', new Date())
$('#buy_money').val('NT$0')

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
            $("#use_title").append("<option value='Value'>" + snapshot.val()[i]  + "</option>");
            i++
        }
    }
)

database.ref('/請購類別').once('value').then (
    function(snapshot) {
        var i = 1
        while (snapshot.val()[i]) {
            $("#buy_type").append("<option value='Value'>" + snapshot.val()[i]  + "</option>");
            i++
        }
    }
)

$('#save_report').click(function(e) {
    
    e.preventDefault()
    
    database.ref('/報表').once('value').then (
        function(snapshot) {
            var count = snapshot.numChildren()+1
            var updates = {}
            var data = {
                '建檔日期':$('#report_date').val(),
                '請購編號':$('#buy_num').val(),
                '實施主軸':$('#use_title option:selected').text(),
                '請購類別':$('#buy_type option:selected').text(),
                '請購項目':$('#buy_name').val(),
                '請購金額':$('#buy_money').val(),
                '傳票號碼':$('#ticket_num').val()
            }
            updates['/報表/' + count] = data
            database.ref().update(updates).then(function() {
                alert('Save success!!')
                $('#report_date').datepicker('setDate', new Date())
                $('#buy_num').val('')
                $('#use_title').prop('selectedIndex', 0)
                $('#buy_type').prop('selectedIndex', 0)
                $('#buy_name').val('')
                $('#buy_money').val('NT$0')
                $('#ticket_num').val('')
            }).catch(function(err) {
                alert('Save faild.' + err)
            })
        }

    )
})
