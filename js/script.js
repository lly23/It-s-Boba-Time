$(function() { 
    // Bokeh parallax bubbles
    $('#title').makeBokeh();
    $('#intro').makeBokeh();
    $('#history').makeBokeh();
    $('#interactive').makeBokeh();

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

    $('#list5').click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#sources").offset().top
          }, 500);
    });

    // location and radius will change based on user input
    var location = $('#location').val();
    var radius = $('#radius').val();

    // set map view to current city, state coordinates in the input field using Geocode API
    var geocodedata = [];
    // create a string array from the input value
    var locationSet = location.split(",");
    var setCity = locationSet[0];
    var setState =locationSet[1];

    // initialize map with 0,0 coordinates first since data from ajax call can't be retrieved outside success function and mymap needs to be initialized outside a function
    var mymap = L.map('mapid').setView([0, 0], 13);

    // Geocoding API
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + setCity + '+' + setState + '&key=' + config.GOOGLE_API_KEY,
        data: geocodedata,
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function(geocodedata) {
            console.log(geocodedata.results[0].geometry.location);
            mymap.setView([geocodedata.results[0].geometry.location.lat, geocodedata.results[0].geometry.location.lng], 13);
        } 
    });

    $('#search').click(function() {
        // once user inputs a new location or radius, value will change
        location = $('#location').val();
        radius = $('#radius').val();
        locationSet = location.split(",");
        setCity = locationSet[0];
        setState =locationSet[1];
        // calling Foursquare API AJAX call again for new location or radius
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/search?client_id=' + config.FOURSQUARE_CLIENT_ID + '&client_secret=' + config.FOURSQUARE_CLIENT_SECRET + '&v=20180323&categoryId=52e81612bcbc57f1066b7a0c,4bf58dd8d48988d1dc931735&radius=' + radius + '&near=' + location,
            data: foursquaredata,
            type: 'GET',
            dataType: 'json',
            async: true,
            success: function(foursquaredata) {
                // Geocoding API
                $.ajax({
                    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + setCity + '+' + setState + '&key=' + config.GOOGLE_API_KEY,
                    data: geocodedata,
                    dataType: 'json',
                    type: 'GET',
                    async: false,
                    success: function(geocodedata) {
                        console.log(geocodedata.results[0].geometry.location);
                        mymap.setView([geocodedata.lat, geocodedata.results[0].geometry.location.lng], 13);
                    } 
                });

                var results = searchBoba(foursquaredata);
                var coordinates = getCoordinates(foursquaredata);
                console.log(coordinates);

                // Leaflet JS and MapBox
                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox.streets',
                    accessToken: config.MAPBOX_TOKEN
                }).addTo(mymap);

                var lat = 0;
                var long = 1;
                for (var venue in coordinates) {
                    console.log(coordinates[venue][lat],coordinates[venue][long]);
                    console.log(coordinates[venue]);      
                    new L.marker([coordinates[venue][lat],coordinates[venue][long]])
                        // .bindPopup(venue)
                        .addTo(mymap);
                    lat+=2;
                    long+=2;
                }

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
        async: true,
        success: function(foursquaredata) {
            var results = searchBoba(foursquaredata);
            var coordinates = getCoordinates(foursquaredata);
            console.log(coordinates);

            // Leaflet JS and MapBox
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: config.MAPBOX_TOKEN
            }).addTo(mymap);

            var lat = 0;
            var long = 1;
            for (var venue in coordinates) {
                console.log(coordinates[venue]);
                new L.marker([coordinates[venue][lat],coordinates[venue][long]])
                    // .bindPopup(venue)
                    .addTo(mymap);
                lat+=2;
                long+=2;
            }

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
            bobaHTML += '</br>';
        }

        return bobaHTML;
    }

    // Sliding Navigation
    let menu = $('li:first-child'),
        menuButton = $('#menu-button'),
        intro = $('li:nth-child(2)'),
        history = $('li:nth-child(3)'),
        stats = $('li:nth-child(4)'),
        sources = $('li:nth-child(5)');

    menu.on('click',() => {
        menuButton.toggleClass('active');
        if(menuButton.hasClass('active')){
            intro.animate({'top':'15%','opacity':'1','z-index':'8'},500);
            history.animate({'top':'30%','opacity':'1','z-index':'6'},500);
            stats.animate({'top':'45%','opacity':'1','z-index':'4'},500);
            sources.animate({'top':'60%','opacity':'1','z-index':'2'},500);
        } else {
            intro.animate({'top':'0','opacity':'0'},500);
            history.animate({'top':'0','opacity':'0'},500);
            stats.animate({'top':'0','opacity':'0'},500);
            sources.animate({'top':'0','opacity':'0'},500);
        }
    });

    // Skew Effect
    $('[data-md-skew]').mdSkew({
        min: 0,
        max: 15,
        speed: 1,
        reset: false
    });

    //Hover in Intro: Different Types of Boba
    if ($(document).width() > 600) {
        $('#hover-classic').mouseover(function() {
            $("#hover-classic").attr("src","../img/blank_classic.png");
            $('#hover-box-classic').css('display', 'block');
        });

        $('#hover-classic').mouseleave(function() {
            $("#hover-classic").attr("src","../img/hover_classic.png");
            $('#hover-box-classic').css('display', 'none');
        });

        $('#hover-milk').mouseover(function() {
            $("#hover-milk").attr("src","../img/blank_milk.png");
            $('#hover-box-milk').css('display', 'block');
        });

        $('#hover-milk').mouseleave(function() {
            $("#hover-milk").attr("src","../img/hover_milk.png");
            $('#hover-box-milk').css('display', 'none');
        });

        $('#hover-slush').mouseover(function() {
            $("#hover-slush").attr("src","../img/blank_slush.png");
            $('#hover-box-slush').css('display', 'block');
        });

        $('#hover-slush').mouseleave(function() {
            $("#hover-slush").attr("src","../img/hover_slush.png");
            $('#hover-box-slush').css('display', 'none');
        });

        $('#hover-other').mouseover(function() {
            $("#hover-other").attr("src","../img/blank_other.png");
            $('#hover-box-other').css('display', 'block');
        });

        $('#hover-other').mouseleave(function() {
            $("#hover-other").attr("src","../img/hover_other.png");
            $('#hover-box-other').css('display', 'none');
        });
    }

    //Click in Intro: Different Types of Boba for mobile
    // if screen is mobile sized then switch to click function
    if ($(document).width() <= 600) {
        var classicClicks = 0;
        var milkClicks = 0;
        var slushClicks = 0;
        var otherClicks = 0;

        $('#hover-classic').click(function() { 
            if (classicClicks == 0) {
                classicClicks += 1; 
                $("#hover-classic").attr("src","../img/blank_classic.png");
                $('#hover-box-classic').css('display', 'block');
            } else {
                classicClicks -= 1;
                $("#hover-classic").attr("src","../img/hover_classic.png");
                $('#hover-box-classic').css('display', 'none');
            }
        });

        $('#hover-milk').click(function() {
            if (milkClicks == 0) {
                milkClicks += 1;
                $("#hover-milk").attr("src","../img/blank_milk.png");
                $('#hover-box-milk').css('display', 'block');
            } else {
                milkClicks -= 1;
                $("#hover-milk").attr("src","../img/hover_milk.png");
                $('#hover-box-milk').css('display', 'none');
            }
        });

        $('#hover-slush').click(function() {
            if (slushClicks == 0) {
                slushClicks += 1;
                $("#hover-slush").attr("src","../img/blank_slush.png");
                $('#hover-box-slush').css('display', 'block');
            } else {
                slushClicks -= 1;
                $("#hover-slush").attr("src","../img/hover_slush.png");
                $('#hover-box-slush').css('display', 'none');
            }  
        });

        $('#hover-other').click(function() {
            if (otherClicks == 0 ) {
                otherClicks += 1;
                $("#hover-other").attr("src","../img/blank_other.png");
                $('#hover-box-other').css('display', 'block');
            } else {
                otherClicks -= 1;
                $("#hover-other").attr("src","../img/hover_other.png");
                $('#hover-box-other').css('display', 'none');
            } 
        });
    }

    // History section animation
    // create a counter for the number of cls-1 classes touched when scrolling
    var clsCounter = 0;
    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();

        // Scroll Animation
        // if user has scrolled past the top of the history section...
        if (scrollTop > $('#history').offset().top && scrollTop < $('#interactive').offset().top) {
            clsCounter += 1; 
            $('#sidebox').fadeTo("slow", 1);
            $('.cls-1:nth-child(' + clsCounter + ')').fadeTo(1000, 1);
            $('#box1').fadeTo("slow", 1);

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
        } else if (scrollTop < $('#history').offset().top || scrollTop > $('#interactive').offset().top) {
        // if user goes past history section or before history section, reset yellow path animation
            clsCounter = 0; 
            $('#box1').css("opacity", 0);
            $('#box2').css("opacity", 0);
            $('#box3').css("opacity", 0);
            $('#box4').css("opacity", 0);
            $('#box5').css("opacity", 0);
            $('.cls-1').css("opacity", 0);
        }

    });    

    // helper functions to retrieve data from FourSquare API and get the coordinates for the markers used with Leaflet + MapBox
    function getCoordinates(data) {
        var coordinates = {};
        var coordinate = [];
        var searchList = [];
        var lat = '';
        var long = '';

        // use these filters to narrow down search results
        var filters = ['Bubble Tea Shop', 'Boba']; 

        for (var i = 0; i < filters.length; i++) {
            var filterItem = filters[i];
            data.response.venues.forEach(venue => {
                for (var j = 0; j < venue.categories.length; j++) {
                    // get each name
                    var name = venue.categories[j].name;
                    
                    // if name matches filter item then add it to boba results array
                    if (name == filterItem) {
                        searchList.push(venue);
                    }
                }
            });  
        }

        searchList.forEach(venue => {
            lat = venue.location.lat;
            long = venue.location.lng;
            coordinate.push(lat);
            coordinate.push(long);
            coordinates[venue.name] = coordinate;
        });

        return coordinates;
    }
  
});