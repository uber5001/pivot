Mode.Polygon = new function() {
	this.onmousedown = function(e) {};
	this.onmouseup = function(e) {};
	this.onmousemove = function(e) {};
	this.oncontextmenu = function(e) {};

	this.ontouchdown = function(e) {};
	this.ontouchup = function(e) {};
	this.ontouchmove = function(e) {};

	function ondown() {

	}
	function onup() {

	}
	function onmove() {

	}
	function onhover() {

	}
	window.addEventListener('click', function(e) {
		var ex = -x+(e.clientX-innerWidth/2)*z;
		var ey = -y+(e.clientY-innerHeight/2)*z;
		if (e.button === 0) {
			var point = {"x":ex, "y":ey};
			if (!pointInPolygon(point,currentPlatform)) {
				if (currentPlatform.length > 0) {
					if (currentPlatform.length > 1) {
						var region = voronoi(point, currentPlatform);
						while ((region.start+1)%currentPlatform.length != region.end) {
							var removed = (region.start+1)%currentPlatform.length;
							currentPlatform.splice((region.start+1)%currentPlatform.length, 1);
							if (removed < region.end) region.end--;
							if (removed < region.start) region.start--;
						}
						currentPlatform.splice((region.start+1)%currentPlatform.length,0,point);
					} else {
						currentPlatform.push(point);
					}
				} else {
					//no platform being created.
					for (var i = platforms.length-1; i >= 0; i--) {
						if (pointInPolygon(point, platforms[i])) {
							currentPlatform = platforms.splice(i,1)[0];
							break;
						}
					}
					if (currentPlatform.length === 0) {
						currentPlatform.push(point);
					}
				}
			} else {
				//clicking inside currentPlatform
				platforms.push(currentPlatform);
				currentPlatform = [];
			}
		}
		render();
	});
	window.addEventListener('contextmenu', function(e) {
		var ex = -x+(e.clientX-innerWidth/2)*z;
		var ey = -y+(e.clientY-innerHeight/2)*z;
		if (pointInPolygon({x:ex,y:ey}, currentPlatform)) {
			currentPlatform = [];
		} else if (currentPlatform.length == 0) {
			for (var i = platforms.length-1; i >= 0 ; i--) {
				if (pointInPolygon({x:ex,y:ey},platforms[i])) {
					platforms.splice(i,1);
					break;
				}
			}
		}
		e.preventDefault();
	});
	*/
	window.addEventListener('mousewheel', function(e) {
		var ex = -x+(e.clientX-innerWidth/2)*z;
		var ey = -y+(e.clientY-innerHeight/2)*z;
		if (e.wheelDelta > 0) {
			//up
			z /= zf;
			var newx = -x+(e.clientX-innerWidth/2)*z;
			var newy = -y+(e.clientY-innerHeight/2)*z;
			x += newx - ex;
			y += newy - ey;
		} else if (e.wheelDelta < 0) {
			//down
			z *= zf;
			var newx = -x+(e.clientX-innerWidth/2)*z;
			var newy = -y+(e.clientY-innerHeight/2)*z;
			x += newx - ex;
			y += newy - ey;
		}
		render();
	});



	/*
	window.addEventListener('keypress', function(e) {
		if (e.keyCode === 13) {
			//enter
			platforms.push(currentPlatform);
			currentPlatform = [];
		}
		render();
	});
	*/
	var highlightedPlatform = null;
	var highlightedPoint = -1;
	/*
	window.addEventListener('mousemove', function(e) {
		var ex = -x+(e.clientX-innerWidth/2)*z;
		var ey = -y+(e.clientY-innerHeight/2)*z;
		var i;
		highlightedPlatform = null;
		highlightedPoint = -1;
		if (currentPlatform.length > 0) {
			for (var i = 0; i < currentPlatform.length; i++) {
				var worldDist = Math.sqrt(Math.pow(ex - currentPlatform[i].x, 2) + Math.pow(ey - currentPlatform[i].y,2));
				var screenDist = worldDist/z;
				if (screenDist < 50) {
					highlightedPoint = i;
					break;
				}
			}
			if (i == currentPlatform.length && pointInPolygon({x:ex,y:ey}, currentPlatform)) {
				highlightedPlatform = currentPlatform;
			}
		} else  {
			for (i = platforms.length-1; i >= 0; i--) {
				if (pointInPolygon({x:ex,y:ey},platforms[i])) {
					highlightedPlatform = platforms[i];
					break;
				}
			}
		}
		render();
	});
	*/
}