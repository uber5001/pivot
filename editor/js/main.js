window.addEventListener('load',function(){
	window.addEventListener('resize',resize);
	function resize() {
		canvas.height = innerHeight*devicePixelRatio;
		canvas.width = innerWidth*devicePixelRatio;
		render();
	}
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	var platforms = [];
	var currentPlatform = [];
	var bounds = {
		"top":  -50,
		"right": 50,
		"bottom":50,
		"left":  50
	}
	var spawns = [];

	var x = 0;
	var y = 0;
	var z = .1; //scale
	var zf = 1.1 //z factor
	function render() {
		requestAnimationFrame(function() {
			context.clearRect(0,0,innerWidth,innerHeight);


			//draw grid
			var left = (Math.ceil(-x -innerWidth/2*z) + x)/z;
			context.beginPath();
			context.strokeStyle = "rgba(153,221,221, .3)";
			context.lineWidth = 2;
			while (left < innerWidth) {
				context.moveTo(Math.round(left), 0);
				context.lineTo(Math.round(left), innerHeight);
				left += 1/z;
			}
			context.stroke();

			var top = (Math.ceil(-y -innerHeight/2*z) + y)/z;
			context.beginPath();
			context.strokeStyle = "rgba(153,221,221, .3)";
			context.lineWidth = 2;
			while (top < innerWidth) {
				context.moveTo(0, Math.round(top));
				context.lineTo(innerWidth, Math.round(top));
				top += 1/z;
			}
			context.stroke();

			for (var i = 0; i < platforms.length; i++) {
				var poly = platforms[i];
				context.beginPath();
				context.strokeStyle = "#00aba9";
				context.fillStyle = (platforms[i] != highlightedPlatform) ? "white" : "#99DDDD";
				context.moveTo((x+poly[poly.length-1].x)/z + innerWidth/2, (y+poly[poly.length-1].y)/z + innerHeight/2)
				for (var j = 0; j < poly.length; j++) {
					context.lineTo((x+poly[j].x)/z + innerWidth/2, (y+poly[j].y)/z + innerHeight/2);
				}
				context.fill();
				context.lineWidth = .5;
				context.stroke();
			}

			if (currentPlatform.length > 0) {
				context.beginPath();
				context.strokeStyle = "#99DDDD";
				context.moveTo((x+currentPlatform[currentPlatform.length-1].x)/z + innerWidth/2, (y+currentPlatform[currentPlatform.length-1].y)/z + innerHeight/2)
				for (var j = 0; j < currentPlatform.length; j++) {
					context.lineTo((x+currentPlatform[j].x)/z + innerWidth/2, (y+currentPlatform[j].y)/z + innerHeight/2);
				}
				if (currentPlatform == highlightedPlatform) {
					context.fillStyle = "rgba(153,221,221,.5)"
					context.fill();
				}
				context.lineWidth = 2;
				context.stroke();

				for (var j = 0; j < currentPlatform.length; j++) {
					context.beginPath();
					context.arc((x+currentPlatform[j].x)/z + innerWidth/2, (y+currentPlatform[j].y)/z + innerHeight/2,50,0,2*Math.PI);
					if (j == highlightedPoint) {
						context.fillStyle = "rgba(153,221,221,.5)";
						context.fill();
					}
					context.lineWidth = 2;
					context.stroke();
				}
			}
		});
	}
	function getSide(a,b) {return (a.x*b.y-a.y*b.x)>0;}
	function minus(a,b) {return {x:a.x-b.x,y:a.y-b.y}}
	function pointInPolygon(point, polygon) {
		if (polygon.length < 3) return false;
		var firstSide = getSide(minus(point, polygon[polygon.length-1]), minus(polygon[0],polygon[polygon.length-1]));
		for (var i = 0; i < polygon.length-1; i++) {
			var side = getSide(minus(point, polygon[i]), minus(polygon[i+1],polygon[i]));
			if (side != firstSide) return false;
		}
		return true;
	}
	function voronoi(point, polygon) {
		var start = 0;
		var end = 0;
		var prevSide;
		for (var i = 0; i < polygon.length; i++) {
			var currentSide = getSide(minus(point, polygon[i]), minus(polygon[(i+1)%polygon.length],polygon[i]));
			if (i != 0) {
				if (currentSide === false && prevSide === true) {
					end = i;
				} else if (currentSide === true && prevSide === false) {
					start = i;
				}
			}
			prevSide = currentSide;
		}
		return {start:start,end:end};
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
	window.addEventListener('keypress', function(e) {
		if (e.keyCode === 13) {
			//enter
			platforms.push(currentPlatform);
			currentPlatform = [];
		}
		render();
	});
	var highlightedPlatform = null;
	var highlightedPoint = -1;
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

	Object.defineProperty(window, 'data', {
		get: function() {
			return JSON.stringify({
				platforms:platforms,
				bounds:bounds,
				spawns:spawns
			});
		}
	})

	resize();
})