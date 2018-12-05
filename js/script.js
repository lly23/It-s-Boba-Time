$(function() {
    // switching between sections in intro
    $('#right-click').click(function() {
        $('#intro1').fadeOut( "slow", function() {
            $('#intro1').css('display', 'none');
            $('#intro2').fadeIn("slow", function() {
                $('#intro2').css('display', 'block');
            });
        });
        $('#what').fadeOut( "slow", function() {
            $('#what').css('display', 'none');
            $('#how').fadeIn("slow", function() {
                $('#how').css('display', 'block');
            });
        });
    });

    $('#left-click').click(function() {
        $('#intro2').fadeOut( "slow", function() {
            $('#intro2').css('display', 'none');
            $('#intro1').fadeIn("slow", function() {
                $('#intro1').css('display', 'block');
            });
        });
        $('#how').fadeOut( "slow", function() {
            $('#how').css('display', 'none');
            $('#what').fadeIn("slow", function() {
                $('#what').css('display', 'block');
            });
        });
    });

    // navigation menu
    $('#list1').click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#intro").offset().top
          }, 500);
    });

    $('#list2').click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#history").offset().top
          }, 500);
    });

    $('#list3').click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#stats").offset().top
          }, 500);
    });

    $('#list4').click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#interactive").offset().top
          }, 500);
    });

    // location and radius will change based on user input
    var location = $('#location').val();
    var radius = $('#radius').val();

    $('#search').click(function() {
        // once user inputs a new location or radius, value will change
        location = $('#location').val();
        radius = $('#radius').val();
        // calling Foursquare API AJAX call again for new location or radius
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/search?client_id=' + config.FOURSQUARE_CLIENT_ID + '&client_secret=' + config.FOURSQUARE_CLIENT_SECRET + '&v=20180323&categoryId=52e81612bcbc57f1066b7a0c,4bf58dd8d48988d1dc931735&radius=' + radius + '&near=' + location,
            data: foursquaredata,
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function(foursquaredata) {
                var results = searchBoba(foursquaredata);
                // show results in div
                $('#boba-results').html(results);
            }
        });
    });

    console.log(location);

    // FourSquare API
    var foursquaredata = [];

    $.ajax({
        url: 'https://api.foursquare.com/v2/venues/search?client_id=' + config.FOURSQUARE_CLIENT_ID + '&client_secret=' + config.FOURSQUARE_CLIENT_SECRET + '&v=20180323&categoryId=52e81612bcbc57f1066b7a0c,4bf58dd8d48988d1dc931735&radius=' + radius + '&near=' + location,
        data: foursquaredata,
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function(foursquaredata) {
            var results = searchBoba(foursquaredata);
            // show results in div
            $('#boba-results').html(results);
        }
    });

    function searchBoba(data) {
        var bobaResults = [];
        var bobaLocation = [];
        // use these filters to narrow down search results
        var filters = ['Bubble Tea Shop', 'Boba']; 
        var bobaHTML = '';

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
                        console.log(venue);
                        // create variable to store full address and reset each time looping through each locatino so that additional locations do not add onto html variable before pushing into array
                        var fullAddress = '';

                        // get location parts of venue
                        if (venue.location.address) {
                            var address = venue.location.address;
                            var city = venue.location.city;
                            var state = venue.location.state;

                            // add to full address
                            fullAddress += address;
                            fullAddress += ', ';
                            fullAddress += city;
                            fullAddress += ', ';
                            fullAddress += state;
                        } else {
                            var address = venue.location.formattedAddress;

                            // add to full address
                            fullAddress += address;
                        }
                        
                        // store shop name in bobaResults array and shop location in bobaLocation array
                        bobaResults.push(shop);
                        bobaLocation.push(fullAddress);
                    }
                }
                console.log(fullAddress);
            });
        }
        // results after being filtered
        console.log(bobaResults);
        console.log(bobaLocation);

        // add names to bobaHTML
        for (var b = 0; b < bobaResults.length; b++) {
            bobaHTML += bobaResults[b];
            bobaHTML += '</br>';
            bobaHTML += bobaLocation[b];
            bobaHTML += '</br>';
        }

        return bobaHTML;
    }

    // Google Places API
    // var placesdata = [];

    // $.ajax({
    //     url: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=mongolian%20grill&inputtype=textquery&fields=photos,formatted_address,name,opening_hours,rating&locationbias=circle:2000@47.6918452,-122.2226413&key=' + config.GOOGLE_API_KEY,
    //     data: placesdata,
    //     type: 'GET',
    //     dataType: 'jsonp',
    //     success: function(placesdata) {
    //         console.log(placesdata);
    //     }
    // });

    // Sliding Navigation
    let menu = $('li:first-child'),
        menuButton = $('#menu-button'),
        intro = $('li:nth-child(2)'),
        history = $('li:nth-child(3)'),
        stats = $('li:nth-child(4)'),
        fun = $('li:nth-child(5)');

    menu.on('click',() => {
        menuButton.toggleClass('active');
        if(menuButton.hasClass('active')){
            intro.animate({'left':'180px','opacity':'1','z-index':'8'},500);
            history.animate({'left':'340px','opacity':'1','z-index':'6'},500);
            stats.animate({'left':'500px','opacity':'1','z-index':'4'},500);
            fun.animate({'left':'680px','opacity':'1','z-index':'2'},500);
        } else {
            intro.animate({'left':'0','opacity':'0'},500);
            history.animate({'left':'0','opacity':'0'},500);
            stats.animate({'left':'0','opacity':'0'},500);
            fun.animate({'left':'0','opacity':'0'},500);
        }
    });


    // Skew Effect
    $('[data-md-skew]').mdSkew({
        min: 0,
        max: 15,
        speed: 1,
        reset: false
    });

    // Parallax bubbles
    var red = document.getElementById('red');
    var parallaxInstance = new Parallax(red);

    // History section animation
    // create a counter for the number of cls-1 classes touched when scrolling
    var clsCounter = 0;
    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();

        // display menu button after title
        if (scrollTop >= $('#title').offset().top) {
            $('#nav').css('display', 'block');
        }

        // hide menu button on title
        if (scrollTop < $('#intro').offset().top) {
            $('#nav').css('display', 'none');
        }

        // Scroll Animation
        // if user has scrolled past the top of the history section...
        if (scrollTop > $('#history').offset().top && scrollTop < $('#stats').offset().top) {
            clsCounter += 1; 
            $('#box1').fadeTo("slow", 1);
            $('.cls-1:nth-child(' + clsCounter + ')').fadeTo(1000, 1);

            if (scrollTop >= $('.cls-1:nth-child(8)').offset().top) {
                $('#box2').fadeTo("slow", 1);
            }

            if (scrollTop >= $('.cls-1:nth-child(12)').offset().top) {
                $('#box3').fadeTo("slow", 1);
            }

            if (scrollTop >= $('.cls-1:nth-child(16)').offset().top) {
                $('#box4').fadeTo("slow", 1);
            }

            if (scrollTop >= $('.cls-1:nth-child(20)').offset().top) {
                $('#box5').fadeTo("slow", 1);
            }
            
            // if user has reached the top of a yellow rectangle
            // if (scrollTop >= $('.cls-1').offset().top) {
            //     clsCounter += 1;
            //     $('.cls-1:nth-child(' + clsCounter + ')').fadeTo("slow", 0);
            //     console.log(clsCounter);
            // }  else if (scrollTop <= $('.cls-1').offset().top){
            //     clsCounter -= 1;
            //     $('.cls-1:nth-child(' + clsCounter + ')').fadeTo("slow", 1);
            //     console.log(clsCounter);
            // }
            // $('.cls-1:nth-child(' + clsCounter + ')').fadeTo("slow", 1);
        }

        // if (scrollTop > $('#history').offset().top) {
            // console.log($('.cls-1:nth-child(' + 3 + ')').offset().top);
            // clsCounter += 1; 
            // $('.cls-1:nth-child(' + clsCounter + ')').fadeTo("slow", 1);

            // $('.cls-1').first().fadeTo( "slow" , 1, function() {
            //     $('#box1').fadeTo("slow", 1);
            //     clsCounter += 1; 
            // });
            // if (clsCounter >= 1) {
            //     clsCounter += 1; 
            //     $('.cls-1:nth-child(' + clsCounter + ')').fadeTo("slow", 1);
            // }
        // } 

    });    

    // Leaflet JS and MapBox
    var mymap = L.map('mapid').setView([51.505, -0.09], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: config.MAPBOX_TOKEN
    }).addTo(mymap);
    
    
    // var map = kartograph.map('#map');

  
});