#!/bin/env node
var fs = require("fs");
var request = require("request");
var util = require("util");
var Q = require("q");
var later = require("later");
var exec = require('promised-exec');

var readFile = Q.nfbind(fs.readFile);
var writeFile = Q.nfbind(fs.writeFile);

// Retrieve environment variables
var env = process.env;
var url = env.RANCHER_METADATA_HOST + "/" + env.RANCHER_VERSION + "/containers";

console.log("Gathering containers data from Rancher API: "+url);
var templateVhost = fs.readFileSync("nginx-default-vhost.conf");

var api = function(url) {
	console.log("get "+url);
	var opts = {
	  uri: url,
	  method: "GET"
	};
	return Q.nfcall(request, opts).spread(function(res,body) {
	  console.log("Got status response: " + res.statusCode);
	  console.log("Parsing results... ");
	  return JSON.parse(body);
	});
}

var main = function() {
api(url)
.then(function(containers) {
	var data = containers.data;
	var currentVhostFile = "";
	data.forEach(function(el,idx) {
		var env = el.environment;
		var containerName = el.name;
		var remoteAddress = el.data.fields.dockerHostIp;
		console.log("Container "+idx+" environment: "+JSON.stringify(env));
		if(env && env.VIRTUAL_HOST) {
			var virtualPort = env.VIRTUAL_PORT || 80;
			currentVhostFile += "upstream "+env.VIRTUAL_HOST+" {\n\tserver "+remoteAddress+":"+virtualPort+";\n}\n";
			console.log("Adding "+containerName+" ("+remoteAddress+") vhost to Nginx...");
		}
	});
	return currentVhostFile;
})
.then(function(upstream) {
	var currentVhostFile = upstream+"\n"+templateVhost;
	fs.writeFileSync("/etc/nginx/conf.d/default.conf", currentVhostFile);
//	process.exit(0);
})
.then(function() {
	return exec("nginx -s reload")
})
.catch(function(e) {
  console.log("Got error : " + util.inspect(e));
});
}

var cron = env.CRON || "every 30 sec"
var s = later.parse.text(cron);
later.setInterval(main, s);
