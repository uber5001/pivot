/*
 * Andrew Koroluk
 * Scott Little
 */

var PREGAME_TIMER = 5000;
var MAX_GAME_TIMER = 300000;

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});
  
var serverlist = [];
  
wss.on('connection', function(ws) {

    console.log("Incoming Connection");
    
    var hasJoined = false;
    this.name = "Scott";
    
    for(var i=0; i<serverlist.length; i++) {
        if(serverlist[i].started) continue;
        serverlist[i].join(ws);
        hasJoined = true;
        break;
    }
    if(!hasJoined) {
        serverlist.push(new Server());
        serverlist[serverlist.length-1].join(ws);
    }
    
    
    ws.on('message', function(message) {
        //interpret message
        
        
        console.log('received: %s', message);
    });
    
});

function Server() {
    var self = this;
    this.players = [];
    this.started = false;
    
    this.join = function(ws) {
        this.players.push(ws);
        
        if(this.players.length == 2) {
            /*setTimeout(function() {
                self.start();
            }
            , PREGAME_TIMER);*/
            var time = PREGAME_TIMER+1000;
            var interval = setInterval(function() {
                time -= 1000;
                if(time == 0) {
                    var msg = JSON.stringify({"message":"BEGIN!", "type":"broadcast"});
                    for(var i=0; i<self.players.length; i++) {
                        self.players[i].send(msg);
                    }
                    self.start();
                    setTimeout(function() {
                        var msg = JSON.stringify({"message":"", "type":"broadcast"});
                        for(var i=0; i<self.players.length; i++) {
                            self.players[i].send(msg);
                        }
                    }
                    , 1000)
                    clearInterval(interval);
                }
                else {
                    var msg = JSON.stringify({"message":time/1000, "type":"broadcast"});
                    for(var i=0; i<self.players.length; i++) {
                        self.players[i].send(msg);
                    }
                }
            }
            , 1000);
        }
        
        else if(this.players.length == 10) { //or 30 sec after first player join
            this.start();
        }
    }
    
    this.start = function() {
        if(this.started) return;

        var startingPlayers = this.players.length;
        var stopMsgs = 0;
        var stopped = false;
        this.started = true;
        setTimeout(function() {
                self.stop();
            }
        , MAX_GAME_TIMER); //Auto stop in 5 minutes
        
        var inputs = [];
        
        for(var i=0; i<this.players.length; i++) {
            this.players[i].index = i;
            inputs.push(0);
            this.players[i].on('message', function(msg) {
                msg = JSON.parse(msg);
                if(msg.type == 'input') {
                    var input = msg.input;
                    input = Math.max(-1, input);
                    input = Math.min(1, input);
                    inputs[this.index] = input;
                }
                else if(msg.type == 'stop') {
                    stopMsgs++;
                    if(!stopped && stopMsgs/startingPlayers > .5) {
                        stopped = true;
                        setTimeout(function() {
                            if(stopMsgs == startingPlayers)
                                self.stop();
                            else {
                                console.log(stopMsgs+" out of "+startingPlayers+" reported a game stop.");
                            }
                        }
                        , 5000);
                    }
                }
            });
        }
        
        var interval = setInterval(function() {
            var msg = JSON.stringify({"inputs":inputs, "type":"tick"});
            for(var i=0; i<self.players.length; i++) {
                self.players[i].send(msg);
            }
        }
        , 1000/60);
    }
    
    this.stop = function() {
        var index = serverlist.indexOf(this);
        if(index != -1) serverlist.splice(index, 1);
        else console.log("Server to be removed not found, wat");
    }
}





