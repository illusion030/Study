$('#login_send').click(function(e){

  e.preventDefault()
  $.ajax({
    method: "post",
    url: "assets/login.php",
    data: {
      account: $('#login_account').val(),
      pwd: $('#login_password').val()
    },
    error: function(data) {
      alert('Ajax request error');  
    },
    success: function(data) {
      console.log(data)
      $('#return').html(data);
    }
  })
})
