(function() {
	Mode.Polygon = function(callback) {
		addListeners();
	}
	function addListeners() {
		window.addEventListener('mousedown',   onmousedown);
		window.addEventListener('mouseup',     onmouseup);
		window.addEventListener('mousemove',   onmousemove);
		window.addEventListener('touchdown',   ontouchdown);
		window.addEventListener('touchup',     ontouchup);
		window.addEventListener('touchmove',   ontouchmove);
		window.addEventListener('contextmenu', oncontextmenu);
	}
	function removeListeners() {
		window.removeEventListener('mousedown',   onmousedown);
		window.removeEventListener('mouseup',     onmouseup);
		window.removeEventListener('mousemove',   onmousemove);
		window.removeEventListener('touchdown',   ontouchdown);
		window.removeEventListener('touchup',     ontouchup);
		window.removeEventListener('touchmove',   ontouchmove);
		window.removeEventListener('contextmenu', oncontextmenu);
	}
	function onmousedown() {

	}
	function onmouseup() {

	}
	function onmousemove() {

	}
	function ontouchdown() {

	}
	function ontouchup() {

	}
	function ontouchmove() {

	}
	function oncontextmenu(e) {
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
	}
	function onmousewheel(e) {
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
	}
	window.addEventListener('mousewheel', function(e) {
	});
}