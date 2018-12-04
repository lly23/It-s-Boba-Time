$(document).ready(function() {
  $('#push').on('click',function(){
    $('#push, #pushed-center, #pushed-left-1, #pushed-right-1, #pushed-right-2').toggleClass('move');
    $('#push').toggleClass('rotate');
  });
});