// Initialize express and html callers
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Serve HTML
app.get('/', function(req, res){
	//res.send('<h1>Hello World!</h1>');
	res.sendFile(__dirname + '/page.html')
});

// Socket work
io.on('connection', function(socket){
	// Active on any user connection
	var i = 0;
	while(SOCKET_LIST[i]){
	  i++;
	}
	SOCKET_LIST[i] = socket;
	console.log('Socket #' + i + ' connected');

	// ANY CLIENT COMMUNICATION GOES HERE

	// On 'Play' button press (put into game)
	socket.on('PlayNow',function(data){
	    if(data.username != ''){
	      Player.onConnect(socket, data.username);
	    }
	    else{
	      Player.onConnect(socket, 'Unknown');
	    }
	    socket.emit('PlayResponse', {success: true});
  	});

	// On client disconnect
	socket.on('disconnect', function(){
		Player.onDisconnect(socket)
	    id = idFind(socket);
		delete SOCKET_LIST[id];
		console.log('Socket #' + i + ' disconnected');
	});
});

// Start server
http.listen(2000, function(){
	console.log('Server started! Listening on *:2000');
});

// OBJECTS

// Entity (Base object class)
var Entity = function(){
    var self = {
        x:250,
        y:250,
        xv:0,
        yv:0,
    }
    self.update = function(){
        self.updatePosition();
    }
    self.updatePosition = function(){
        self.x += self.xv;
        self.y += self.yv;
    }
    self.getDistance = function(pt){
      return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2));
    }
    return self;
}

// Player (controlled object)
var Player = function(id, user){
	var self = Entity();
	self.id = id
	self.user = user
    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.pressingAttack = false;
}

Player.list = {};

Player.onConnect = function(socket, username){
    i = idFind(socket);
    var player = Player(i, username);
    socket.on('keyPress',function(data){
        if(data.inputId === 'left')
            player.pressingLeft = data.state;
        else if(data.inputId === 'right')
            player.pressingRight = data.state;
        else if(data.inputId === 'up')
            player.pressingUp = data.state;
        else if(data.inputId === 'down')
            player.pressingDown = data.state;
        else if(data.inputId == 'attack')
            player.pressingAttack = data.state;
        else if(data.inputId == 'mouseAngle')
            player.mouse = data.state
    });
}

Player.onDisconnect = function(socket){
  i = idFind(socket)
  delete Player.list[i];
}

// FUNCTIONS

// List of connected sockets
var SOCKET_LIST = {};

// Find a socket based on ID
function idFind(socket){
  for(var i in SOCKET_LIST){
    if(socket.id == SOCKET_LIST[i].id){
      return i;
    }
  }
}