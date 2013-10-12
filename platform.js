function Platform(world, x, y, shape) {
		//ground stuffs
		var fixDef = new Box2D.Dynamics.b2FixtureDef;
		fixDef.density = 1.0;
		fixDef.friction = 0.5;
		fixDef.restitution = .1;
		fixDef.shape = shape;

		this.shape = shape;

		var bodyDef = new Box2D.Dynamics.b2BodyDef;
		bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
		bodyDef.position.x = x;
		bodyDef.position.y = y;
		var myBody = world.CreateBody(bodyDef)
		myBody.CreateFixture(fixDef);


		Object.defineProperty(this, 'x', {
			get: function() {
				return myBody.GetPosition().x;
			}
		});
		Object.defineProperty(this, 'y', {
			get: function() {
				return myBody.GetPosition().y;
			}
		});
	}