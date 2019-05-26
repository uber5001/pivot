const Box2D = require("box2dweb");
import {SHORT_LEG_LENGTH, LONG_LEG_LENGTH, HINGE_SIZE, PLAYER_JOINT_SPEED, GRAVITY, TIMESCALE} from "./constants";
import Player from "./player";
import Platform from "./platform";

export default class PivotGame { 
	private world: any;
	private players: Array<Player> = [];
	private platforms: Array<Platform> = [];
	private map: any;

	private playerFinished = false;

	private timeScale = TIMESCALE;

	private pxcenter = 0;
	private pycenter = 0;
	private pwidth = 100;
	private pheight = 100;

	constructor(playerCount: number, map: any) {
		this.map = map;
		this.world = new Box2D.Dynamics.b2World(
			new Box2D.Common.Math.b2Vec2(0, GRAVITY), //gravity
			true //allow sleep
		);
		this.world.SetContactListener({
			BeginContact: (x: any) => {
				try {
					if (x.m_fixtureA.GetBody() == this.platforms[0].body ||
						x.m_fixtureB.GetBody() == this.platforms[0].body ) {
						//console.log('gg');
						this.playerFinished = true;
					}
				} catch (e) {}
			},
			EndContact() {},
			PreSolve() {},
			PostSolve() {}
		});

		for (let i = 0; i < playerCount; i++) {
			this.players[i] = new Player(this.world, map.spawns[i].x, map.spawns[i].y);
		}

		const platforms = [];
		for (let i = 0; i < map.platforms.length; i++) {
			const tmpShape = new Box2D.Collision.Shapes.b2PolygonShape();
			const verts = [];
			let x = 0;
			let y = 0;
			for (let j = 0; j < map.platforms[i].length; j++) {
				verts.push(new Box2D.Common.Math.b2Vec2(map.platforms[i][j].x, map.platforms[i][j].y));
				x += verts[j].x;
				y += verts[j].y;
			}
			x /= map.platforms[i].length;
			y /= map.platforms[i].length;
			for (let j = 0; j < verts.length; j++) {
				verts[j].x-=x;
				verts[j].y-=y;
			}
			tmpShape.SetAsArray(verts, verts.length);
			this.platforms[i] = new Platform(this.world, x, y, tmpShape);
		}
	}

	public render(context: CanvasRenderingContext2D) {
		let xmax = 0;
		let xmin = 0;
		let ymax = 0;
		let ymin = 0;
		for (const player of this.players) {
			if (player.y > 50) continue;
			xmax = Math.max(xmax, player.x);
			xmin = Math.min(xmin, player.x);
			ymax = Math.max(ymax, player.y);
			ymin = Math.min(ymin, player.y);
		}
		let width = (xmax-xmin)*2+30;
		let height = (ymax-ymin)*2+30;

		let xcenter = (xmin+xmax)/2;
		let ycenter = (ymin+ymax)/2;

		this.pwidth =   width =   width*0.02 +   this.pwidth*0.98;
		this.pheight =  height =  height*0.02 +  this.pheight*0.98;
		this.pxcenter = xcenter = xcenter*0.02 + this.pxcenter*0.98;
		this.pycenter = ycenter = ycenter*0.02 + this.pycenter*0.98;




		const aspect = width/height;
		const windowAspect = innerWidth/innerHeight;

		let sizeRatio = -1;
		if (aspect > windowAspect) {
			//players are super wide
			height = width/windowAspect;
			sizeRatio = innerWidth/width;
		} else {
			//players are super tall
			width = height*windowAspect;
			sizeRatio = innerHeight/height;
		}
		//context.fillStyle = "#00ABA9";
		context.clearRect(0,0,innerWidth,innerHeight);
		context.save();
		context.translate(innerWidth/2,innerHeight/2);
		context.scale(sizeRatio, sizeRatio);
		context.translate(-xcenter, -ycenter);

		//draw with xcenter, ycenter, width, and height
		//subtract our center to move it to 0,0
		context.fillStyle = "white";
		for (const player of this.players) {
			context.beginPath();
			context.arc(player.x, player.y, HINGE_SIZE, 0, 2*Math.PI);
			context.fill();


			context.lineWidth = HINGE_SIZE;
			let rot = player.shortLeg.GetAngle();
			let len = SHORT_LEG_LENGTH;
			let rotOff = Math.acos(HINGE_SIZE/len);
			context.beginPath();
			context.moveTo(player.x,player.y);
			context.lineTo(player.x-HINGE_SIZE*Math.sin(rot+rotOff),player.y+HINGE_SIZE*Math.cos(rot+rotOff));
			context.lineTo(player.x-len*Math.sin(rot),player.y+len*Math.cos(rot));
			context.lineTo(player.x-HINGE_SIZE*Math.sin(rot-rotOff),player.y+HINGE_SIZE*Math.cos(rot-rotOff));
			context.fill();

			rot = player.longLeg.GetAngle();
			len = LONG_LEG_LENGTH;
			rotOff = Math.acos(HINGE_SIZE/len);
			context.moveTo(player.x,player.y);
			context.lineTo(player.x-HINGE_SIZE*Math.sin(rot+rotOff),player.y+HINGE_SIZE*Math.cos(rot+rotOff));
			context.lineTo(player.x-len*Math.sin(rot),player.y+len*Math.cos(rot));
			context.lineTo(player.x-HINGE_SIZE*Math.sin(rot-rotOff),player.y+HINGE_SIZE*Math.cos(rot-rotOff));
			context.fill();
		}

		for (const platform of this.platforms) {
			const verts = platform.shape.GetVertices();
			context.beginPath();
			context.moveTo(platform.x+verts[verts.length-1].x, platform.y+verts[verts.length-1].y);
			for (const vert of verts) {
				context.lineTo(platform.x+vert.x, platform.y+vert.y);
			}
			context.fill();
		}
		context.restore();
	};
	public update(inputs: any) {
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].joint.SetMotorSpeed(PLAYER_JOINT_SPEED * inputs[i]);
		}

		this.world.Step(
				1 / 60 * this.timeScale,   //frame-rate
					10,       //velocity iterations
					10        //position iterations
		);
		this.world.DrawDebugData();
		this.world.ClearForces();

		let pplInBounds = 0;
		for (const player of this.players) {
			if(player.y > this.map.bounds.top &&
				player.y < this.map.bounds.bottom &&
				player.x > this.map.bounds.left &&
				player.x < this.map.bounds.right) pplInBounds++;
		}
		if(pplInBounds < 2)
			return false;
		return !this.playerFinished;
	};
}