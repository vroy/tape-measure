$(document).ready(function() {
	
	// Globals that holds the x and y position that the mousemove will pivot around.
	var $start_x = null;
	var $start_y = null;

	// Start a ruler resize on mousedown of a handle.
	$("body .ruler-container .handle").live("mousedown", function(e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		
		var handle_name = $(this).clone().removeClass("handle").attr("class");

		var ruler = $("body .ruler-container .ruler");
		
		var coords = {
			width: ruler.width(),
			height: ruler.height(),
			top: parseInt(ruler.css("top")),
			left: parseInt(ruler.css("left"))
		};
		
		// Set $start_y and $start_x to the opposite corner of the handle that was selected so that when
		// the mouse is moved, it pivots around the opposite corner.
		$start_x = handle_name.match(/left/) ? coords.left+coords.width : coords.left;
		$start_y = handle_name.match(/top/) ? coords.top+coords.height : coords.top;
	});

	// On mousedown with the "alt key" pressed, initialize a ruler that will be resized on mousemove.
	$(document).mousedown(function(e) {
		e.preventDefault();
		if (e.altKey) {
			// Log where we started building 
			$start_x = e.pageX;
			$start_y = e.pageY;

			// Clear previous ruler
			$("body .ruler-container").remove();

			// Create all necessary HTML for ruler.
			var container = $( "<div class='ruler-container'></div>" ).append(
				$( "<div class='ruler'></div>" ).hide(),
				$( "<div class='coordinates'></div>" ).hide(),
				$( "<div class='handle handle-top-left'></div>" ).hide(),
				$( "<div class='handle handle-top-right'></div>" ).hide(),
				$( "<div class='handle handle-bottom-left'></div>" ).hide(),
				$( "<div class='handle handle-bottom-right'></div>" ).hide()	
			);
			$("body").append(container);
		}
	});

	// Cancel all previously initialized ruler 
	$(document).mouseup(function(e) {
		$start_x = null;
		$start_y = null;

		if ( $("body .ruler-container .ruler").width() == 0 || $("body .ruler-container .ruler").height() == 0 ) {
			$("body .ruler-container").remove();
		}
	});

	// As the mouse moves, whether the ruler resize was triggered by a new ruler being started or a resize
	// handle being click, we pivot around what $start_x and $start_y were set to.
	$(document).mousemove(function(e) {
		if ($start_x != null && $start_y != null) {
			var small_x = smaller($start_x, e.pageX);
			var large_x = larger($start_x, e.pageX);
			
			var small_y = smaller($start_y, e.pageY);
			var large_y = larger($start_y, e.pageY);

			$("body .ruler-container .ruler").css({
				"left": small_x, "top": small_y,
				"width": large_x-small_x, "height": large_y-small_y
			}).show();
			
			updateCoordinatesAndHandles();
		}
	});

	function smaller(a, b) {
		return (a < b) ? a : b;
	}

	function larger(a, b) {
		return (a > b) ? a : b;
	}

	// Update the position of the supporting objects to reflect the size of the ruler div.
	// 22px is the size of the handle+borders
	function updateCoordinatesAndHandles() {
		var ruler = $("body .ruler-container .ruler");

		// var coords = ruler.getBoundingClientRect();
		var coords = {
			width: ruler.width(),
			height: ruler.height(),
			top: parseInt(ruler.css("top")),
			left: parseInt(ruler.css("left"))
		}

		$("body .ruler-container .coordinates").css({
			"left": coords.left, "top": coords.top+coords.height+2
		}).show().text("width: "+coords.width+" height: "+coords.height);

		$("body .ruler-container .handle-top-left").css({
			"left": coords.left, "top": coords.top
		}).show();

		$("body .ruler-container .handle-top-right").css({
			"left": coords.left+coords.width-20, "top": coords.top
		}).show();

		$("body .ruler-container .handle-bottom-left").css({
			"left": coords.left, "top": coords.top+coords.height-20
		}).show();

		$("body .ruler-container .handle-bottom-right").css({
			"left": coords.left+coords.width-20, "top": coords.top+coords.height-20
		}).show();
	}

});
