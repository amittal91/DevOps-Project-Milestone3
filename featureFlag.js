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
  res.send('Hello everyone! This is a basic demo of Feature Flag for Milestone 3');
});

app.get('/feature', function(req, res) {
	client.lpop('featureFlag', function(err, reply) {
		if ( reply == "true") {
			client.lpush('featureFlag', false)
			res.send("Feature for set/get disabled !")
		}
		else {
			client.lpush('featureFlag', true)
			res.send("Feature for set/get enabled !")
		}
	})
})

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
  
  client.del('featureFlag')
  client.lpush('featureFlag', true)

  // client.llen('featureFlag', function(err, res) {
  // 	console.log("Length: "+ res)
  // })

});