// ===================
// Set Up
// ===================

var os = require('os');
var http = require('http');
var express = require('express');
var app = express();
var port = 8888;

// ===================
// Configuration
// ===================

app.use(express.static(__dirname + '/public'));

// Create a Node.js based http server on port 8080
var server = http.createServer(app).listen(port, '0.0.0.0');

console.log('Server started!');

// Display server IP
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
	for (var k2 in interfaces[k]) {
		var address = interfaces[k][k2];
		if (address.family === 'IPv4' && !address.internal) {
			addresses.push(address.address + ":" + port);
		}
	}
}

console.log('The server address is ' + addresses);