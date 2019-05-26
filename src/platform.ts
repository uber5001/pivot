const Box2D = require("box2dweb");

export default class Platform { 
	public shape: any;
	public body: any;
	constructor(world: any, x: number, y: number, shape: any) {
		//ground stuffs
		const fixDef = new Box2D.Dynamics.b2FixtureDef();
		fixDef.density = 1.0;
		fixDef.friction = 0.4;
		fixDef.restitution = 0.1;
		fixDef.shape = shape;

		this.shape = shape;

		const bodyDef = new Box2D.Dynamics.b2BodyDef();
		bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
		bodyDef.position.x = x;
		bodyDef.position.y = y;
		const myBody = world.CreateBody(bodyDef);
		myBody.CreateFixture(fixDef);

		this.body = myBody;
	}
	public get x() {
		return this.body.GetPosition().x;
	}
	public get y() {
		return this.body.GetPosition().y;
	}
}