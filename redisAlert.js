var fs = require('fs')
var redis = require('redis')
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

var alertVal = process.argv[2]
// console.log("Alert val: " + alertVal)

client.lpop('alertValThreshold', function(err, rep) {
	client.lpush('alertValThreshold', alertVal, function (err1, rep1) {
		process.exit();
	});
});
