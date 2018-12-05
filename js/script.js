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
            $('#types').fadeIn("slow", function() {
                $('#types').css('display', 'block');
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
        $('#types').fadeOut( "slow", function() {
            $('#types').css('display', 'none');
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

    // initialize map with 0,0 coordinates first since data from ajax call can't be retrieved outside success function
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
            mymap.setView([getLat(geocodedata), getLong(geocodedata)], 13);
        } 
    });

    // helper functions to get latitude and longitude of input location value
    function getLat(data) {
        return data.results[0].geometry.location.lat;
    }

    function getLong(data) {
        return data.results[0].geometry.location.lng;
    }

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

                for (var venue in coordinates) {
                    console.log(venue);
                    var obj = coordinates[venue];

                    marker = new L.marker([obj[0],obj[1]])
                            .bindPopup(venue)
                            .addTo(mymap);
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

            for (var venue in coordinates) {
                console.log(venue);
                var obj = coordinates[venue];

                marker = new L.marker([obj[0],obj[1]])
                        .bindPopup(venue)
                        .addTo(mymap);
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
        fun = $('li:nth-child(5)');
        sources = $('li:nth-child(6)');

    menu.on('click',() => {
        menuButton.toggleClass('active');
        if(menuButton.hasClass('active')){
            intro.animate({'left':'180px','opacity':'1','z-index':'8'},500);
            history.animate({'left':'340px','opacity':'1','z-index':'6'},500);
            stats.animate({'left':'500px','opacity':'1','z-index':'4'},500);
            fun.animate({'left':'680px','opacity':'1','z-index':'2'},500);
            sources.animate({'left':'840px','opacity':'1','z-index':'1'},500);
        } else {
            intro.animate({'left':'0','opacity':'0'},500);
            history.animate({'left':'0','opacity':'0'},500);
            stats.animate({'left':'0','opacity':'0'},500);
            fun.animate({'left':'0','opacity':'0'},500);
            sources.animate({'left':'0','opacity':'0'},500);
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
    $('#hover-classic').mouseover(function() {
        $("#hover-classic").attr("src","../img/blank_classic.png");
        // $('#hover-box-classic').fadeIn("slow", function() { 
            $('#hover-box-classic').css('display', 'block');
        // });
    });

    $('#hover-classic').mouseleave(function() {
        $("#hover-classic").attr("src","../img/hover_classic.png");
        // $('#hover-box-classic').fadeOut("slow", function() { 
            $('#hover-box-classic').css('display', 'none');
        // });
    });

    $('#hover-milk').mouseover(function() {
        $("#hover-milk").attr("src","../img/blank_milk.png");
        // $('#hover-box-milk').fadeIn("slow", function() { 
            $('#hover-box-milk').css('display', 'block');
        // });
    });

    $('#hover-milk').mouseleave(function() {
        $("#hover-milk").attr("src","../img/hover_milk.png");
        // $('#hover-box-milk').fadeOut("slow", function() { 
            $('#hover-box-milk').css('display', 'none');
        // });
    });

    $('#hover-slush').mouseover(function() {
        $("#hover-slush").attr("src","../img/blank_slush.png");
        // $('#hover-box-slush').fadeIn("slow", function() { 
            $('#hover-box-slush').css('display', 'block');
        // });
    });

    $('#hover-slush').mouseleave(function() {
        $("#hover-slush").attr("src","../img/hover_slush.png");
        // $('#hover-box-slush').fadeOut("slow", function() { 
            $('#hover-box-slush').css('display', 'none');
        // });
    });

    $('#hover-other').mouseover(function() {
        $("#hover-other").attr("src","../img/blank_other.png");
        $('#hover-box-other').css('display', 'block');
    });

    $('#hover-other').mouseleave(function() {
        $("#hover-other").attr("src","../img/hover_other.png");
        $('#hover-box-other').css('display', 'none');
    });

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

    // High Charts 
    // Prepare random data
    // var data = [
    //     ['DE.SH', 728],
    //     ['DE.BE', 710],
    //     ['DE.MV', 963],
    //     ['DE.HB', 541],
    //     ['DE.HH', 622],
    //     ['DE.RP', 866],
    //     ['DE.SL', 398],
    //     ['DE.BY', 785],
    //     ['DE.SN', 223],
    //     ['DE.ST', 605],
    //     ['DE.NW', 237],
    //     ['DE.BW', 157],
    //     ['DE.HE', 134],
    //     ['DE.NI', 136],
    //     ['DE.TH', 704],
    //     ['DE.', 361]
    // ];

    // var caliData = [];
    // $.ajax({
    //     url: '../data/bayarea_boba_spots.json',
    //     data: caliData,
    //     dataType: 'json',
    //     type: 'GET',
    //     success: function(caliData) {
    //         console.log(caliData);
    //         // Initiate the chart
    //         Highcharts.mapChart('caliChart', {
    //             chart: {
    //                 map: caliData
    //             },

    //             title: {
    //                 text: 'Boba Shops in the Bay Area'
    //             },

    //             mapNavigation: {
    //                 enabled: true,
    //                 buttonOptions: {
    //                     verticalAlign: 'bottom'
    //                 }
    //             },

    //             colorAxis: {
    //                 tickPixelInterval: 100
    //             },

    //             series: [{
    //                 data: caliData,
    //                 keys: ['code_hasc', 'value'],
    //                 joinBy: 'code_hasc',
    //                 name: 'Random data',
    //                 states: {
    //                     hover: {
    //                         color: '#a4edba'
    //                     }
    //                 },
    //                 dataLabels: {
    //                     enabled: true,
    //                     format: '{point.properties.postal}'
    //                 }
    //             }]
    //         });
    //     }
    // });

    // $.getJSON('../data/bayarea_boba_spots.json', function (caliData) {

        
    // });
  
});