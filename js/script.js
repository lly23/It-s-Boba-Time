$(function() {
    // FourSquare API
    // fetch('https://api.foursquare.com/v2/venues/explore?client_id=' + config.CLIENT_ID + '&client_secret=' + config.CLIENT_SECRET + '&v=20180323&limit=1&ll=40.7243,-74.0018&query=coffee')
    // .then(function() {
    //     // Code for handling API response
    //     var searchurl = 'https://api.foursquare.com/v2/venues/search';
    //     $.ajax({
    //         url: url,
    //         data: foursquaredata,
    //         type: 'GET',
    //         dataType: 'json',
    //         async: true,
    //         success: function(foursquaredata) {
    //             console.log(foursquaredata);
    //         }
    //     });    
    // })
    // .catch(function() {
    //     // Code for handling errors
    // });

    var location = 'Chapel Hill, NC';
    var searchURL = 'https://api.foursquare.com/v2/venues/search?client_id=' + config.CLIENT_ID + '&client_secret=' + config.CLIENT_SECRET + '&v=20180323&limit=1&ll=40.7243,-74.0018&query=boba&near=' + location;
    var foursquaredata = [];
    
    $.ajax({
        url: searchURL,
        data: foursquaredata,
        type: 'GET',
        dataType: 'json',
        async: true,
        success: function(foursquaredata) {
            console.log(foursquaredata);
        }
    });

    function searchBoba(location, foursquaredata) {

    }

    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();
        // var height = $(window).height();
        console.log(scrollTop);
        if (scrollTop >= $('#intro').offset().top) {
            $('#nav').css('display', 'block');
        }

        if (scrollTop <= $('#intro').offset().top) {
            $('#nav').css('display', 'none');
        }
        // $('#title').css({
        //     'opacity': ((height - scrollTop) / height)
        // });
    });

    // Parallax bubbles
    var red = document.getElementById('red');
    var parallaxInstance = new Parallax(red);
    
    // var map = kartograph.map('#map');

  
});