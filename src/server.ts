import * as WebSocket from 'ws';

const PREGAME_TIMER = 30*1000;
const MAX_GAME_TIMER = 30*60*1000;
const MAXPLAYERS = 20;

const wss = new WebSocket.Server({port: 8080});

const serverlist: Array<Server> = [];

wss.on('connection', function(this: any, ws) {

	console.log("Client Connected");
	
	let hasJoined = false;
	this.name = "Scott";
	
	for(const server of serverlist) {
		if(server.started) continue;
		server.join(ws);
		hasJoined = true;
		break;
	}
	if(!hasJoined) {
		serverlist.push(new Server());
		serverlist[serverlist.length-1].join(ws);
	}
	
});

class Server { 
	private players: Array<any> = [];
	public started = false;
	private name = Math.floor(100000*Math.random())
	private timed_out = false;
	private DC = false;
	private timeout: NodeJS.Timeout;

	constructor() {}

	join(ws: any) {
		this.players.push(ws);

		console.log("Number of servers: "+serverlist.length);

		ws.on('close', () => {
			console.log("Client Disconnected");
			if(!this.started) {
				const index = this.players.indexOf(ws);
				if(index != -1) this.players.splice(index, 1);
				else console.log("wat");
				if(this.players.length < 2) 
					clearInterval(interval);
				if(this.players.length === 0) this.stop("Pregame Timeout");
			}
			else {
				this.DC = true;
				for(const player of this.players) {
					if(!player.DC) return;
				}
				if(this.timed_out) {
					this.stop("Endgame");
				}
			}
		});
		
		let interval: NodeJS.Timeout;
		if(this.players.length == 2) {
			let time = PREGAME_TIMER+1000;
			interval = setInterval(() => {
				time -= 1000;
				if(time === 0) {
					if(this.players.length < 2) {
						clearInterval(interval);
						return;
					}
					const msg = JSON.stringify({"message":"", "type":"broadcast"});
					for(const player of this.players) {
						player.send(msg);
					}
					this.start();
					setTimeout(() => {
						const msg = JSON.stringify({"message":"", "type":"broadcast"});
						for(const player of this.players) {
							player.send(msg);
						}
					}, 1000);
					clearInterval(interval);
				}
				else {
					const msg2 = JSON.stringify({"message":time/1000, "type":"broadcast"});
					for(const player of this.players) {
						try {
							player.send(msg2);
						} catch(e) {}
					}
				}
			}, 1000);
		}
		
		else if(this.players.length == MAXPLAYERS) { //or 30 sec after first player join
			this.start();
		}
	};

	start() {
		if(this.started) return;

		const startingPlayers = this.players.length;
		//const currentPlayers = this.players.length;
		let stopMsgs = 0;
		let stopped = false;
		this.started = true;
		this.timeout = setTimeout(() => {this.stop("Timeout");}, 
					MAX_GAME_TIMER); //Auto stop in 30 minutes
		
		const inputs: Array<number> = [];
		
		for(let i=0; i<this.players.length; i++) {
			this.players[i].index = i;
			inputs.push(0);
			var self = this;
			this.players[i].on('message', function (msgStr: string) {
				const msg = JSON.parse(msgStr);
				if(msg.type == 'input') {
					let input = msg.input;
					input = Math.max(-1, input);
					input = Math.min(1, input);
					inputs[this.index] = input;
				}
				else if(msg.type == 'stop') {
					stopMsgs++;
					if(!stopped && stopMsgs/startingPlayers > 0.5) {
						stopped = true;
						setTimeout(() => {
							if(stopMsgs == startingPlayers) {
								self.stop();
							} else {
								console.log(stopMsgs+" out of "+startingPlayers+" reported a game stop.");
							}
						}, 5000);
					}
				}
			});
		}
		
		const interval = setInterval(() => {
			const msg = JSON.stringify({"inputs":inputs, "type":"tick"});
			for(const player of this.players) {
				try {
					player.send(msg);
				} catch(e) {}
			}
		}, 1000/60);
	};
	
	stop(debug: string = "") {
		console.log(this.name+" said "+debug);
		const index = serverlist.indexOf(this);
		//console.log("this.players.length:"+this.players.length);
		if(index != -1) {
			serverlist.splice(index, 1);
			this.timeout = null;
			//console.log("Server properly removed.");
		}
		else {
			console.log("Server to be removed not found, wat");
		}
		console.log("Server Stopped.");
		console.log("Number of servers: "+serverlist.length);
		if(debug == "Timeout") {
			//console.log("Timeout deletion.");
			this.timed_out = true;
			for(const i in this.players)
				this.players[i].close();
			this.timeout = null;
			//delete this;
			delete serverlist[serverlist.indexOf(this)]
		}
	};
}



