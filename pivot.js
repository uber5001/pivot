/*
 * Scott Little
 * Andrew Koroluk
 * 12 OCT 2013
 */

/*
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

world = new b2World(
		new b2Vec2(0, 10)    //gravity
	,  true                 //allow sleep
);

var fixDef = new b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;

var bodyDef = new b2BodyDef;

//create ground
bodyDef.type = b2Body.b2_staticBody;
bodyDef.position.x = 9;
bodyDef.position.y = 13;
fixDef.shape = new b2PolygonShape;
fixDef.shape.SetAsBox(10, 0.5);
world.CreateBody(bodyDef).CreateFixture(fixDef);

//create some objects
bodyDef.type = b2Body.b2_dynamicBody;
for(var i = 0; i < 10; ++i) {
	if(Math.random() > 0.5) {
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(
				Math.random() + 0.1 //half width
			,  Math.random() + 0.1 //half height
		);
	} else {
		fixDef.shape = new b2CircleShape(
			Math.random() + 0.1 //radius
		);
	}
	bodyDef.position.x = Math.random() * 10;
	bodyDef.position.y = Math.random() * 10;
	world.CreateBody(bodyDef).CreateFixture(fixDef);
}

//setup debug draw
var debugDraw = new b2DebugDraw();
debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
debugDraw.SetDrawScale(30.0);
debugDraw.SetFillAlpha(0.1);
debugDraw.SetLineThickness(1.0);
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
world.SetDebugDraw(debugDraw);

window.setInterval(update, 1000 / 60);
function update() {
	world.Step(
			1 / 60   //frame-rate
		,  10       //velocity iterations
		,  10       //position iterations
	);
	world.DrawDebugData();
	world.ClearForces();
};
*/

world = new Box2D.Dynamics.b2World(
	new Box2D.Common.Math.b2Vec2(0, 10), //grav
	true //allow sleep
);


		var playerLegFixtureDef = new Box2D.Dynamics.b2FixtureDef;
			playerLegFixtureDef.density = 1;
			playerLegFixtureDef.friction = .8;
			playerLegFixtureDef.restitution = .2;
			playerLegFixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
			playerLegFixtureDef.shape.SetAsArray([
				new Box2D.Common.Math.b2Vec2(.2, 0),
				new Box2D.Common.Math.b2Vec2(0, .2),
				new Box2D.Common.Math.b2Vec2(-.2, 0),
				new Box2D.Common.Math.b2Vec2(0, -2)
			], 4);

		var playerLegBodyDef = new Box2D.Dynamics.b2BodyDef;
			playerLegBodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			playerLegBodyDef.position.x = 10;
			playerLegBodyDef.position.y = 5;

	var foo = world.CreateBody(playerLegBodyDef)
	foo.CreateFixture(playerLegFixtureDef);
	playerLegFixtureDef.shape.SetAsArray([
				new Box2D.Common.Math.b2Vec2(.2, 0),
				new Box2D.Common.Math.b2Vec2(0, .2),
				new Box2D.Common.Math.b2Vec2(-.2, 0),
				new Box2D.Common.Math.b2Vec2(0, -2.5)
			], 4);
	var bar = world.CreateBody(playerLegBodyDef)
	bar.CreateFixture(playerLegFixtureDef);

	var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef;
		jointDef.bodyA = foo;
		jointDef.bodyB = bar;
		jointDef.anchorPoint = foo.GetPosition();
		jointDef.maxMotorTorque = 100;
		jointDef.motorSpeed = 0;
		jointDef.enableMotor = true;
	var joo = world.CreateJoint(jointDef);


//hacky event handlers
var left = false;
var right = false;
window.addEventListener('keydown', function(e) {
	//TODO: add forwards compatible e.key or e.char
	if (e.keyCode == 37) {
		left = true;
	} else if (e.keyCode = 39) {
		right = true;
	}
	updateRotationSpeed();
});
window.addEventListener('keyup', function(e) {
	if (e.keyCode == 37) {
		left = false;
	} else if (e.keyCode = 39) {
		right = false;
	}
	updateRotationSpeed();
});
function updateRotationSpeed() {
	joo.SetMotorSpeed( (left ? -10 : 0) + (right ? 10 : 0) )
}


//ground stuffs
var fixDef = new Box2D.Dynamics.b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.8;
fixDef.restitution = .2;
fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
fixDef.shape.SetAsBox(4, 1);

var bodyDef = new Box2D.Dynamics.b2BodyDef;
bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
bodyDef.position.x = 10;
bodyDef.position.y = 10;
world.CreateBody(bodyDef).CreateFixture(fixDef);
/*

	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
	fixDef.shape.SetAsBox(
			Math.random()*1 + 0.1 //half width
		,  Math.random()*5 + 0.1 //half height
	);
	bodyDef.position.x = Math.random() * 10 + 5;
	bodyDef.position.y = Math.random() * 10 - 5;
	bodyDef.angle = Math.random() * Math.PI * 2;
	var foo = world.CreateBody(bodyDef)
	foo.CreateFixture(fixDef);

	bodyDef.angle += Math.PI/3;
	fixDef.shape.SetAsBox(
			Math.random()*1 + 0.1 //half width
		,  Math.random()*5 + 0.1 //half height
	);
	var bar = world.CreateBody(bodyDef)
	bar.CreateFixture(fixDef);

		var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef;
		jointDef.bodyA = foo;
		jointDef.bodyB = bar;
		jointDef.anchorPoint = foo.GetPosition();
		jointDef.maxMotorTorque = 100;
		jointDef.motorSpeed = 10;
		jointDef.enableMotor = true;
		var joo = world.CreateJoint(jointDef);
*/
			var debugDraw = new Box2D.Dynamics.b2DebugDraw;
			debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
			debugDraw.SetDrawScale(20.0);
			debugDraw.SetFillAlpha(0.1);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);

window.setInterval(update, 1000 / 60);
function update() {
	world.Step(
			1 / 60   //frame-rate
		,  10       //velocity iterations
		,  10       //position iterations
	);
	world.DrawDebugData();
	world.ClearForces();
};