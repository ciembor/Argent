var WebSocketServer = require('websocket').server;
var http = require('http');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var clients = [];

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});
server.listen(1988, function() { });

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;
    console.log('Client connected.');

    connection.on('close', function(connection) {
        clients.splice(index, 1);
        console.log("Client disconnected.");
    });
});

function refresh() {
    for (var i=0; i < clients.length; i++) {
        clients[i].send(JSON.stringify({refresh: true}));
    }
}

rl.on('line', function (cmd) {
    if ('refresh' === cmd) {
        console.log('Fire!');
        refresh();
    } else {
        console.log('Command not found.');
    }
});