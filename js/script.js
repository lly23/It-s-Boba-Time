$(function() {
    // $('#strawberry').click(function(e) {
    //     e.preventDefault();
    //     $('#intro').css('display','block');
    //     $('html','body').animate({
    //         scrollTop: $("#intro").offset().top
    //       }, 500);
    // });

    // Parallax bubbles
    var intro = document.getElementById('intro');
    var parallaxInstance = new Parallax(intro);

    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();
        var height = $(window).height();

        // $('#title').css({
        //     'opacity': ((height - scrollTop) / height)
        // });
    });
    
    var map = kartograph.map('#map');

    // Youtube API
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
     var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: 'M7lc1UVf-VE',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

    function onPlayerReady(event) {
    event.target.playVideo();
    }

    var done = false;
    function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
    }
    function stopVideo() {
    player.stopVideo();
    }    
});