/*
 * Scott Little
 * Andrew Koroluk
 * 12 OCT 2013
 */


document.getElementById("play").addEventListener("click", newConnection);

//load map
var map = {};

var mapRequest = new XMLHttpRequest();
mapRequest.open("GET","map1.json");
mapRequest.addEventListener("load", function(data) {
	// console.log(mapRequest.response);
	map = JSON.parse(mapRequest.response);
});
mapRequest.send();

//canvas maintainence
var canvas = document.getElementById('canvas');
window.addEventListener('resize', resize);
function resize() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
} resize();

function render() {
	try {
	gameTest.render(canvas.getContext('2d'));
		requestAnimationFrame(render);
	} catch(e) {}
}

function broadcast(msg, shadow) {
	document.getElementById('broadcast').firstChild.innerText = msg;
	if(shadow) 
		document.getElementById('broadcast').style["text-shadow"]="0 1px 3px black";
	else 
		document.getElementById('broadcast').style["text-shadow"]="none";
}

function newConnection() {
	document.getElementById("play").style.display="none";

	gameTest = undefined;
	ws = new WebSocket("ws://scottlittle.me:8080");
	broadcast("Connecting to server...");
	ws.addEventListener('message', function(e) {
		var msg = JSON.parse(e.data);
		if (msg.type == "tick") {
			if (gameTest == undefined) {
				gameTest = new PivotGame(msg.inputs.length, map);
				render();
			}

			if(!gameTest.update(msg.inputs)) {
				broadcast("Game Over", true);
				setTimeout(function() {ws.close();}, 5000);
			}
		} else if (msg.type == "broadcast") {
			broadcast(msg.message);
		}
	});
	ws.addEventListener('open', function() {
		broadcast("Connected, waiting for another player to join...");
	})
	ws.addEventListener('error', function() {
		broadcast("Something went wrong...");
	});
	ws.addEventListener('close', function() {
		//broadcast("Connection lost. Connecting to a new game...");
		delete gameTest;
		broadcast("");
		document.getElementById("play").style.display="block";
		canvas.getContext("2d").clearRect(0,0,innerWidth,innerHeight);
		//newConnection();
	});
}


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