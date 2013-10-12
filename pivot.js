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

function PivotGame(playerCount, debugContext) {

	var world = new Box2D.Dynamics.b2World(
		new Box2D.Common.Math.b2Vec2(0, GRAVITY), //grav
		true //allow sleep
	);

	var players = [];
	for (var i = 0; i < playerCount; i++) {
		players[i] = new Player(world, 10+i, 5);
	}

	var tmp = new Box2D.Collision.Shapes.b2PolygonShape;
		tmp.SetAsBox(4, 1);
	var platform = new Platform(world, 10, 10, tmp);

	var debugDraw = new Box2D.Dynamics.b2DebugDraw;
	debugDraw.SetSprite(debugContext);
	debugDraw.SetDrawScale(20.0);
	debugDraw.SetFillAlpha(0.1);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);

	function updateRotationSpeed() {
		joo.SetMotorSpeed( (left ? -PLAYER_JOINT_SPEED : 0) + (right ? PLAYER_JOINT_SPEED : 0) );
	}

	this.timeScale = .5;

	this.render = function(context) {
		//TODO: real drawing pls
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