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

var change_arr = [[],[],[],[],[],[],[]];

var is_changed = false

database.ref('/報表').once('value').then (
    function(snapshot) {
        var count = 1
        snapshot.forEach(function(snap) {
            $('#report_table tr:last').after('<tr><td contenteditable="true" oninput = "edit_change(this)" class = "date">'+ snap.val()['建檔日期'] +'</td><td contenteditable="true" oninput = "edit_change(this)">'+ snap.val()['請購編號'] +'</td><td contenteditable="true" oninput = "edit_change(this)">'+ snap.val()['實施主軸'] +'</td><td contenteditable="true" oninput = "edit_change(this)">'+ snap.val()['請購類別'] +'</td><td contenteditable="true" oninput = "edit_change(this)">'+ snap.val()['請購項目'] +'</td><td contenteditable="true" oninput = "edit_change(this)">'+ snap.val()['請購金額'] +'</td><td contenteditable="true" oninput = "edit_change(this)">'+ snap.val()['傳票號碼'] +'</td></tr>')
            for(i = 0; i < 7; i++)
                change_arr[i][count] = 0
            count++
        })
        $('#load_edit').hide()
    }
)

function edit_change(e){
    change_arr[e.cellIndex][e.parentNode.rowIndex] = e.innerHTML
    is_changed = true
}

$('#edit_save').click(function(e) {
    
    e.preventDefault()
    
    if (is_changed) 
        $('#check_edit').modal('show')
    else
        $('#no_change').modal('show')
})

$('.ui.ok.button').click(function(e) {

    for (i = 0; i < change_arr.length; i++) { 
        for (j = 1; j < change_arr[0].length; j++) {
            if (change_arr[i][j] != 0) {
                var select
                var updates = {}

                switch (i) {
                    case 0: select = '建檔日期'; break;
                    case 1: select = '請購編號'; break;
                    case 2: select = '實施主軸'; break;
                    case 3: select = '請購類別'; break;
                    case 4: select = '請購項目'; break;
                    case 5: select = '請購金額'; break;
                    case 6: select = '傳票號碼'; break;
                    default: break;
                }
                
                updates['/報表/' + j + '/' + select] = change_arr[i][j]
                database.ref().update(updates)
                change_arr[i][j] = 0
                is_changed = false
                    
            }
        }
    }
    
    $('#success').modal('show')
})
