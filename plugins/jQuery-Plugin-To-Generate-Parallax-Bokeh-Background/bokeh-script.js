/*
 * jQuery Bokeh Generator
 * http://www.sparkexperience.com
 *
 * Copyright 2013 James Pfleiderer
 * Free to use under the GPLv2 license.
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 */

/*  === To-do ===
	I think I can change the x and y positions to be percentage-based, that way the circles will be responsive as well.
*/

jQuery.fn.makeBokeh = function(settings){
	
	//Set the defaults for config.
	var config = {
		'count' : 100, // (int) The number of bokeh circles to be generated.
		'sizeMin' : 50, // (int) The minimum pixel diameter of each bokeh circle.
		'sizeMax' : 250, // (int) The maximum pixel diameter of each bokeh circle.
		'opacityMin' : 49, // (int) The minimum opacity in hundredths of each bokeh circle, e.g., 45 would become .045
		'opacityMax' : 99, // (int) The maximum opacity in hundredths of each bokeh circle., e.g., 45 would become .045
		'xMin' : -50, // (int) The minimum pixel position on the X axis.
		'xMax' : $(document).width(), // (int) The maximum pixel position on the X axis.
		'yMin' : -50, // (int) The minimum pixel position on the Y axis.
		'yMax' : $(document).height() // (int) The maximum pixel position on the Y axis.
		};
	if(settings){ $.extend(config, settings); }
	
	return this.each(function(){
		
		//Set up some defaults and counter variables.
		var bokeh_count = config.count;
		var bokeh_element = $(this);
		var bokeh_third = Math.floor( bokeh_count / 3 );
		var bokeh_counter = 1;
		
		//Make sure the element still exists.
		if( $(bokeh_element).length ){
			
			//Create the three <div>s that will hold the <div.bokeh> circles.
			$("<div>").attr('class','bokeh-parallax bokeh-parallax-1').appendTo($(bokeh_element));
			$("<div>").attr('class','bokeh-parallax bokeh-parallax-2').appendTo($(bokeh_element));
			$("<div>").attr('class','bokeh-parallax bokeh-parallax-3').appendTo($(bokeh_element));
			
			//Add the <div.bokeh> circles to the parallax containers.
			for(var i=0; i<bokeh_count; i++){
				
				//Use the min and max values to get random values for size, opacity, and position.
				var new_element_size = randomXToY( config.sizeMin, config.sizeMax);
				var new_element_opacity = randomXToY( config.opacityMin, config.opacityMax);
				var new_element_x_pos = randomXToY( config.xMin, config.xMax );
				var new_element_y_pos = randomXToY( config.yMin, config.yMax );
				
				//This gets incremented to assure that each of the 3 parallax containers gets 1/3 of the circles.
				var append_here = '.bokeh-parallax-'+bokeh_counter;
				
				//Create the <div.bokeh>, add the CSS values, and append it to the parallax container.
				$("<div>").attr('class','bokeh bokeh-'+i).css('width',new_element_size+'px').css('height',new_element_size+'px').css('opacity','.0'+new_element_opacity).css('left',new_element_x_pos+'px').css('top',new_element_y_pos+'px').appendTo( $(append_here) );
				
				//Use bokeh_third to incremement the counter once 1/3 of the circles are added to a container.
				if( i == bokeh_third ) { bokeh_counter++; }
				if( i == (bokeh_third*2) ) { bokeh_counter++; }
				
			} //END for
		}//END if
	});//END return
};//END function



// Function to get a random value between two values
//======================================================================
function randomXToY(minVal,maxVal) {
  var randVal = Math.floor((Math.random()*maxVal)+minVal); 
  return randVal;
}



//Parallax
//======================================================================
$(window).scroll(function(){
	var drag1 = .10; // The lower the decimal, the slower the scroll. This currently represents half speed
	var drag2 = .25;
	var drag3 = .40;
	
	//Multiple the distance scrolled by the drag.
	var pos1 = $(document).scrollTop()*drag1;
	var pos2 = $(document).scrollTop()*drag2;
	var pos3 = $(document).scrollTop()*drag3;
	
	//Put the new positions in an array, it makes for an easier for loop below.
	var positions = [pos1, pos2, pos3];
	
	//Use transform:translate3d() instead of top, the final result is much smoother.
	for(var i=0; i<3; i++){
		$('.bokeh-parallax-'+(i+1)).css('-moz-transform','translate3d(0,'+positions[i]+'px,0)');
		$('.bokeh-parallax-'+(i+1)).css('-webkit-transform','translate3d(0,'+positions[i]+'px,0)');
		$('.bokeh-parallax-'+(i+1)).css('transform','translate3d(0,'+positions[i]+'px,0)');
	}
	
});



// http://devheart.org/articles/tutorial-creating-a-jquery-plugin/