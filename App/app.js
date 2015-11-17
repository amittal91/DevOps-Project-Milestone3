var express = require('express');
var app = express();
var redis = require('redis')
var fs = require("fs");
var input = fs.readFileSync('./redis_server.json');

var redis_ip;
var redis_port;


try {
    redisServer = JSON.parse(input);
    redis_ip = redisServer.redis_ip;
    redis_port = redisServer.redis_port;
}
catch (err) {
    console.log('Error parsing redis_server.json');
    console.log(err);
}

var client = redis.createClient(redis_port, redis_ip, {})

app.get('/', function (req, res) {
  res.send('Hello everyone! This is a very basic app for Milestone 3');
});

app.get('/get', function(req, res) {
	client.get('newkey', function(err,value) { 
		res.send(value)
	});
})

app.get('/set', function(req, res) {
	client.lrange('featureFlag', 0, 0, function(err, reply) {
		if (reply == "true") {
			client.set('newkey', 'this message will self-destruct in 10 seconds');
			client.expire('newkey', 10);
			res.send('set key with message successfully, key will expire in 10 seconds!')
		}
		else {
			res.send('Sorry, you cannot set a key !')
		}
	})
	
})



// var x=0;
// if (x==0)
//     x=x+1

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});