document.addEventListener('DOMContentLoaded', function(event) {
  $('.new-tweet textarea').on('keypress',function () {
    var enteredText = $('textarea').val();
    var count = enteredText.length + 1;
    var charLeft = 140 - count;
    if (charLeft < 0){
      $(this).parent().children('span').css('color', 'red');
    } else {
      $(this).parent().children('span').css('color', 'gray');
    }
    $(this).parent().children('span').text(charLeft);
  })
});