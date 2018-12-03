$(function() {
    // location is global variable, will change based on user input
    var location = 'Chapel Hill, NC';

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
    // use these filters to narrow down search results
    var filters = ['Bubble Tea Shop']; 
    var bobaResults = [];
    var bobaLocation = [];
    var bobaHTML = '';

    $.ajax({
        url: 'https://api.foursquare.com/v2/venues/search?client_id=' + config.CLIENT_ID + '&client_secret=' + config.CLIENT_SECRET + '&v=20180323&categoryId=52e81612bcbc57f1066b7a0c,4bf58dd8d48988d1dc931735&near=' + location,
        data: foursquaredata,
        type: 'GET',
        dataType: 'json',
        async: true,
        success: function(foursquaredata) {
            getUserInput();
            searchBoba(foursquaredata);
            // show results in div
            $('#boba-results').html(bobaHTML);
        }
    });

    function getUserInput() {
        $('#search').click(function() {
            var userInput = $('#location').val();
            location = userInput;
            console.log(location);
        });
    }

    function searchBoba(data) {
        // show all venues under category id's 'bubble tea shop' and 'tea rooms'
        console.log(data.response.venues);
        // check first filter item
        for (var i = 0; i < filters.length; i++) {
            var filterItem = filters[i];
            // go through all venues
            data.response.venues.forEach(venue => {
                // create variable to store shop name 
                var shop = venue.name;

                // go into categories list
                for (var j = 0; j < venue.categories.length; j++) {
                    // get each name
                    var name = venue.categories[j].name;
                    // if name matches filter item then add it to boba results array
                    if (name == filterItem) {
                        bobaResults.push(shop);
                    }
                }

                // create variable to store full address and reset each time looping through each locatino so that additional locations do not add onto html variable before pushing into array
                var fullAddress = '';

                // get location parts of venue
                
                var address = venue.location.address;
                var city = venue.location.city;
                var state = venue.location.state;

                fullAddress += address;
                fullAddress += ', ';
                fullAddress += city;
                fullAddress += ', ';
                fullAddress += state;

                console.log(fullAddress);
                bobaLocation.push(fullAddress);
            });
        }
        // results after being filtered
        console.log(bobaResults);
        //results of boba locations, should be aligned with results in bobaResults
        console.log(bobaLocation);

        // add names to bobaHTML
        for (var b = 0; b < bobaResults.length; b++) {
            bobaHTML += bobaResults[b];
            bobaHTML += '</br>';
            bobaHTML += bobaLocation[b];
            bobaHTML += '</br>';
        }
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