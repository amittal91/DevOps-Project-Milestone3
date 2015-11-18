var http = require('http'),
    httpProxy = require('http-proxy');

var fs = require("fs");
var input = fs.readFileSync('./proxy_servers.json');

var redis = require('redis')
var input1 = fs.readFileSync('./redis_server.json');

var redis_ip;
var redis_port;

var url;
var prod_url;
var canary_url;
var count = 0;

try {
    serverUrls = JSON.parse(input);
    prod_url = serverUrls.prod;
    canary_url = serverUrls.canary;
    url = prod_url
}
catch (err) {
    console.log('Error parsing proxy_servers.json');
    console.log(err);
}

try {
    redisServer = JSON.parse(input1);
    redis_ip = redisServer.redis_ip;
    redis_port = redisServer.redis_port;
}
catch (err) {
    console.log('Error parsing redis_server.json');
    console.log(err);
}

var client = redis.createClient(redis_port, redis_ip, {})

//http proxy implementation
var pserver = http.createServer(function(req, res) {
    client.lrange('alertValThreshold', 0, 0, function(err, value) {
        // console.log("Value from redis: " + value)
        
        count = count + 1;
        if (count%4 == 0) {
            console.log("Every Fourth request")
            url = canary_url
            if (value == "yes") {
                console.log("Alert Raised !")
                url = prod_url
            }        
            count = 0
        }
        else {
            url = prod_url
        }

        console.log("Delivering request to: ", url)
        var proxy = httpProxy.createProxyServer({target: url});
        proxy.web(req, res);
    });
        
});

pserver.listen(80, function() {
    console.log("proxy server listening on port 80")
});