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

//IoT Imports
var mysql = require("mysql");
   
//SQL DB connection stuff
var sqlcon = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",//sim_app
	password: "password",
	database: "cpuproj"
});

app.get('/process_start', function (req, res) {
   // respond that server has started
   response = "server started, See console log for more details";
   res.send(response);
	
	//connect to db
	sqlcon.connect(function(err){
		if(err){
			console.log('Error connecting to Db');
			return;
		}
		console.log('Connection established');
	});
	
	
});


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
