/*
 * Scott Little
 * Andrew Koroluk
 * 12 OCT 2013
 */

//canvas maintainence
var canvas = document.getElementById('canvas');
window.addEventListener('resize', resize);
function resize() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
} resize();

//run the game
var gameTest = new PivotGame(1/*player*/, canvas.getContext('2d'));
window.setInterval(function() {
	var input = 0;
	if (left) input++;
	if (right) input--;
	gameTest.update([input]);
}, 1000 / 60);
function render() {
	gameTest.render();
	requestAnimationFrame(render);
} render();

//TODO: don't hard-code it to be local!
var left = false;
var right = false;
window.addEventListener('keydown', function(e) {
	if (e.keyCode == 37) {
		left = true;
	} else if (e.keyCode == 39) {
		right = true;
	}
});
window.addEventListener('keyup', function(e) {
	if (e.keyCode == 37) {
		left = false;
	} else if (e.keyCode == 39) {
		right = false;
	}
});