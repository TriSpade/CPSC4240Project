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

//helmet is a set of security features for express server
var helmet = require('helmet');

// create a new express server
var app = express();
app.use(helmet());

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

//mysql import
var mysql = require("mysql");


var jsonexport = require("jsonexport");
var fs = require("fs");

var cryptojs = require('crypto-js');
   
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
		var input = message.toString();

		var bytes = cryptojs.AES.decrypt(input, 'vThwa79qRsXpyoDrf94jsef9ntoA+0FdfHIhSW34tPU=');
		var plaintext = bytes.toString(cryptojs.enc.Utf8);

		var toJSON = JSON.parse(plaintext);
		
		//console.log(toJSON);

		var post = new Object();
		post.hostname = toJSON.hostname;
		post.cpu0 = toJSON.cpu0;
		post.cpu1 = toJSON.cpu1;
		post.cpu2 = toJSON.cpu2;
		post.cpu3 = toJSON.cpu3;
		post.cpu4 = toJSON.cpu4;
		post.cpu5 = toJSON.cpu5;
		post.cpu6 = toJSON.cpu6;
		post.cpu7 = toJSON.cpu7;
		post.time = toJSON.time;

		console.log(post);
		
		sqlcon.query('INSERT INTO observations SET ?', post, function(err,result){
			if(err) throw err;
			console.log(result);
		})

		sqlcon.query('SELECT * FROM `observations`', function(err,result){
			if(err) throw err;
			exportData(result);
			console.log("data exported");
		})
	})

function exportData(result){
	jsonexport(result,function(err,csv){
		if(err) return console.log(err);
		fs.writeFile("../public/data/log.csv", csv, function(err){
			if(err){
				return console.log(err);
			}
			return console.log("csv file made");
		})
	});
}	

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
