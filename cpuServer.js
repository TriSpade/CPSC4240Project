/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------
// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
  request = require('request'),

_ = require('lodash');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

//mysql import
var mysql = require("mysql");

//get d3
var d3 = require("d3");
var jsonexport = require("jsonexport");
var fs = require("fs");
   
//SQL DB connection stuff
var sqlcon = mysql.createPool({
	connectionLimit : 10,
	host: "127.0.0.1",
	user: "cpuproj",//sim_app
	password: "cpupassword",
	database: "cpuproj"
});

sqlcon.getConnection(function(err){
	if(err){
		console.log('Error connecting to Db');
		return;
	}
	console.log('Connection established');
});

//setup mqtt and connect to topic
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://127.0.0.1');

client.on('connect', function(){
	client.subscribe('groupproject');
	client.publish('gropproject/connect', 'true');
})


	client.on('message', function(topic, message) {
		console.log(message.toString());

		var host = "test";
		var location = "test";
		var time = 1;
		var loadavg = 1;
		var temperature = 1; 

		var post = new Object();
		post.host = host;
		post.location = location;
		post.time = time;
		post.loadavg = loadavg;
		post.temperature = temperature;

		sqlcon.query('INSERT INTO observations SET ?', post, function(err,result){
			if(err) throw err;
			console.log(result);
		})
	})

function exportData(result){
	jsonexport(result,function(err,csv){
		if(err) return console.log(err);
		fs.writeFile("data/log.csv", csv, function(err){
			if(err){
				return console.log(err);
			}
			return console.log("csv file made");
		})
	});
}	




app.get('/process_get', function (req, res) {
   // Prepare output in JSON format
   response = {
      host:req.query.host
     };
               
    sqlcon.query('SELECT * FROM `observations` WHERE `host` = \''+response.host+'\'', function(err,result){
			if(err) throw err;
			//console.log(result);
			exportData(result);
			res.location("localhost:6001/graph.html");
	})
})



// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
