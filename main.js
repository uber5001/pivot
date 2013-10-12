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

function render() {
	gameTest.render();
	requestAnimationFrame(render);
} render();

var gameTest = undefined;
var ws = new WebSocket("ws://scottlittle.me:8080");
ws.addEventListener('message', function(e) {
	var msg = JSON.parse(e.data);
	console.log(e.data);
	if (msg.type == "tick") {
		if (gameTest == undefined) {
			console.log('foo');
			gameTest = new PivotGame(msg.inputs.length, canvas.getContext('2d'));
		}
		gameTest.update(msg.inputs);
	}
});


//TODO: don't hard-code it to be local!
var left = false;
var right = false;
window.addEventListener('keydown', function(e) {
	if (e.keyCode == 37) {
		left = true;
		updateControls();
	} else if (e.keyCode == 39) {
		right = true;
		updateControls();
	}
});
window.addEventListener('keyup', function(e) {
	if (e.keyCode == 37) {
		left = false;
		updateControls();
	} else if (e.keyCode == 39) {
		right = false;
		updateControls();
	}
});
function updateControls() {
	var input = 0;
	if (left) input++;
	if (right)input--;
	ws.send(JSON.stringify({
		"type": "input",
		"input": input
	}));
}