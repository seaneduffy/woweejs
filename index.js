'use strict';

let fs = require('fs'),
	express = require('express'),
	app = express(),
	http = require('http').Server(app);
	
app.use(express.static(__dirname + '/woweejs/dist'));
app.use(express.static(__dirname + '/static'));

fs.readFile('woweejs-dev.html', 'utf8', function(err, data){
	app.get('/', function(req, res) {
		res.send(data);
	});
});
	
http.listen(3000, function(){
	console.log('listening on *:3000');
});