$(function() {
    var location = 'Raleigh, NC';
    // Geocode
    var locationData = '';
    $.ajax({
       url: 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=' + config.GOOGLE_API_KEY,
       data: locationData,
       type: 'GET',
       dataType: 'json',
       async: true, 
       success: function(locationData) { 
            console.log(locationData);
       }
    });
    // FourSquare API
    var foursquaredata = [];
    var filters = ['Tea Room', 'Bubble Tea Shop'];

    $.ajax({
        url: 'https://api.foursquare.com/v2/venues/search?client_id=' + config.CLIENT_ID + '&client_secret=' + config.CLIENT_SECRET + '&v=20180323&query=tea&near=' + location,
        data: foursquaredata,
        type: 'GET',
        dataType: 'json',
        async: true,
        success: function(foursquaredata) {
            console.log(foursquaredata.response.venues);
            for (var i = 0; i < filters.length; i++) {
                foursquaredata.response.venues.forEach(venue => {
                    console.log(venue);
                });
            }
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