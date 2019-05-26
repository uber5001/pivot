const Box2D = require("box2dweb");
import {PLAYER_DENSITY, PLAYER_FRICTION, PLAYER_RESTITUTION, HINGE_SIZE, SHORT_LEG_LENGTH, LONG_LEG_LENGTH, PLAYER_JOINT_TORQUE} from "./constants";

export default class Player {
	public shortLeg: any;
	public longLeg: any;
	public joint: any;
	constructor(world: any, x: number, y: number) {
		//start with the definitions of the fixtures and bodies
		const playerLegFixtureDef = new Box2D.Dynamics.b2FixtureDef();
			playerLegFixtureDef.density = PLAYER_DENSITY;
			playerLegFixtureDef.friction = PLAYER_FRICTION;
			playerLegFixtureDef.restitution = PLAYER_RESTITUTION;
			playerLegFixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
			playerLegFixtureDef.shape.SetAsArray([
				new Box2D.Common.Math.b2Vec2(HINGE_SIZE, 0),
				new Box2D.Common.Math.b2Vec2(0, SHORT_LEG_LENGTH),
				new Box2D.Common.Math.b2Vec2(-HINGE_SIZE, 0),
				new Box2D.Common.Math.b2Vec2(0, -HINGE_SIZE)
			], 4);

		const playerLegBodyDef = new Box2D.Dynamics.b2BodyDef();
			playerLegBodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
			playerLegBodyDef.position.x = x;
			playerLegBodyDef.position.y = y;


		//then create instances of those definitions
		this.shortLeg = world.CreateBody(playerLegBodyDef);
		this.shortLeg.CreateFixture(playerLegFixtureDef);

			//change definition's shape for long leg
			playerLegFixtureDef.shape.SetAsArray([
					new Box2D.Common.Math.b2Vec2(HINGE_SIZE, 0),
					new Box2D.Common.Math.b2Vec2(0, LONG_LEG_LENGTH),
					new Box2D.Common.Math.b2Vec2(-HINGE_SIZE, 0),
					new Box2D.Common.Math.b2Vec2(0, -HINGE_SIZE)
			], 4);

		playerLegFixtureDef.density *= 2;
		this.longLeg = world.CreateBody(playerLegBodyDef);
		this.longLeg.CreateFixture(playerLegFixtureDef);

		//gotta do the joint afterwards.
		const jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
			jointDef.bodyA = this.shortLeg;
			jointDef.bodyB = this.longLeg;
			jointDef.anchorPoint = this.shortLeg.GetPosition();
			jointDef.maxMotorTorque = PLAYER_JOINT_TORQUE;
			jointDef.motorSpeed = 0;
			jointDef.enableMotor = true;

		this.joint = world.CreateJoint(jointDef);
	}
	get x() {
		return this.shortLeg.GetPosition().x;
	}
	get y() {
		return this.shortLeg.GetPosition().y;
	}
}
