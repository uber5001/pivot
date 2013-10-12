/*
 * Scott Little
 * Andrew Koroluk
 * 12 OCT 2013
 */

var SHORT_LEG_LENGTH = 2;
var LONG_LEG_LENGTH = 2.5;
var HINGE_SIZE = .2

var PLAYER_RESTITUTION = .4;
var PLAYER_DENSITY = 1;
var PLAYER_FRICTION = .8;

var PLAYER_JOINT_TORQUE = 10;
var PLAYER_JOINT_SPEED = 10;

var GRAVITY = 10;

var TIMESCALE = 1;

function PivotGame(playerCount, debugContext) {

	var world = new Box2D.Dynamics.b2World(
		new Box2D.Common.Math.b2Vec2(0, GRAVITY), //grav
		true //allow sleep
	);

	var players = [];
	for (var i = 0; i < playerCount; i++) {
		players[i] = new Player(world, 10+i, 5);
	}
	var platforms = []
	var tmp = new Box2D.Collision.Shapes.b2PolygonShape;
		tmp.SetAsBox(4, 1);
	platforms[0] = new Platform(world, 10, 10, tmp);
	platforms[1] = new Platform(world, 20, 20, tmp);
	var tmp2 = new Box2D.Collision.Shapes.b2PolygonShape;
		tmp2.SetAsBox(5, 1);
	platforms[2] = new Platform(world, 0, 20, tmp2);

	if (debugContext != undefined) {
		var debugDraw = new Box2D.Dynamics.b2DebugDraw;
		debugDraw.SetSprite(debugContext);
		debugDraw.SetDrawScale(1.0);
		debugDraw.SetFillAlpha(0.1);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
		world.SetDebugDraw(debugDraw);
	}

	function updateRotationSpeed() {
		joo.SetMotorSpeed( (left ? -PLAYER_JOINT_SPEED : 0) + (right ? PLAYER_JOINT_SPEED : 0) );
	}

	this.timeScale = TIMESCALE;

	this.render = function(context) {
		var xmax = -Infinity;
		var xmin = Infinity;
		var ymax = -Infinity;
		var ymin = Infinity;
		for (var i = 0; i < playerCount; i++) {
			xmax = Math.max(xmax, players[i].x);
			xmin = Math.min(xmin, players[i].x);
			ymax = Math.max(ymax, players[i].y);
			ymin = Math.min(ymin, players[i].y);
		}
		var width = (xmax-xmin)*2+30;
		var height = (ymax-ymin)*2+30;

		var xcenter = (xmin+xmax)/2;
		var ycenter = (ymin+ymax)/2;

		var aspect = width/height;
		var windowAspect = innerWidth/innerHeight;

		var sizeRatio = -1;
		if (aspect > windowAspect) {
			//players are super wide
			height = width/windowAspect;
			sizeRatio = innerWidth/width;
		} else {
			//players are super tall
			width = height*windowAspect;
			sizeRatio = innerHeight/height;
		}
		context.clearRect(0,0,innerWidth,innerHeight);
		context.save();
		context.translate(innerWidth/2,innerHeight/2);
		context.scale(sizeRatio, sizeRatio);
		context.translate(-xcenter, -ycenter);

		//draw with xcenter, ycenter, width, and height
		//subtract our center to move it to 0,0
		for (var i = 0; i < playerCount; i++) {
			context.beginPath();
			context.fillStyle = "blue";
			context.arc(players[i].x,players[i].y,HINGE_SIZE,0,2*Math.PI);
			context.fill();


			context.lineWidth = HINGE_SIZE;
			var rot = players[i].shortLeg.GetAngle();
			var len = SHORT_LEG_LENGTH
			context.beginPath();
			context.moveTo(players[i].x,players[i].y);
			context.lineTo(players[i].x-len*Math.sin(rot),players[i].y+len*Math.cos(rot));
			context.stroke();

			rot = players[i].longLeg.GetAngle();
			len = LONG_LEG_LENGTH
			context.moveTo(players[i].x,players[i].y);
			context.lineTo(players[i].x-len*Math.sin(rot),players[i].y+len*Math.cos(rot));
			context.stroke();
		}

		for (var i = 0; i < platforms.length; i++) {
			var verts = platforms[i].shape.GetVertices();
			context.beginPath();
			context.moveTo(platforms[i].x+verts[verts.length-1].x, platforms[i].y+verts[verts.length-1].y);
			for (var j = 0; j < verts.length; j++) {
				context.lineTo(platforms[i].x+verts[j].x, platforms[i].y+verts[j].y);
			}
			context.fill();
		}
		context.restore();
	}

	this.update = function(inputs) {
		for (var i = 0; i < playerCount; i++) {
			players[i].joint.SetMotorSpeed(PLAYER_JOINT_SPEED * inputs[i]);
		}

		world.Step(
				1 / 60 * this.timeScale   //frame-rate
			,  10       //velocity iterations
			,  10       //position iterations
		);
		world.DrawDebugData();
		world.ClearForces();
	};
}