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


app.get('/process_get', function (req, res) {
   // Prepare output in JSON format
   response = {
      latitude:req.query.latitude,
      longitude:req.query.longitude,
	  startDate:req.query.startDate,
	  endDate:req.query.endDate
     };
                     
      var callURL = "https://d8d775bd-d009-4709-b9f5-e0da76a5ebc6:ukxwFlxUKf@twcservice.mybluemix.net/api/weather/v1/geocode/"+response.latitude+"/"+response.longitude+"/almanac/daily.json?units=e&start="+response.startDate+"&end="+response.endDate

      request.get(callURL, {
        json: true
      },
      function (error, response, body) {
		if(error){
			console.log(error);
		} else {
			//var meta = body["metadata"];
			//var id = meta["transaction_id"];
			res.send(body);
		}

      });
})

//IoT Imports
var mysql = require("mysql");
var Client = require('ibmiotf');

//IoT Script Vars
var i=0;
var previous_system_time = 0;
var previous_database_time = 0;
var rows =[];
   
//SQL DB connection stuff
var sqlcon = mysql.createConnection({
	host: "webofagents.cs.clemson.edu",
	user: "sim_app",//sim_app
	password: "irviewer",
	database: "intelligentriver"
});

//IoT Config stuff
var config = {
    "org" : "vh3t8t",
    "id" : "8649865433",
    "domain": "internetofthings.ibmcloud.com",
    "type" : "InteliRiver",
    "auth-method" : "token",
    "auth-token" : "8649865433"
};

var deviceClient = new Client.IotfDevice(config);

//IoT Functions
function publish(rows)
{
	var timestamp = rows[i].timestamp;
	var motestack = rows[i].motestack;   
	var temperature = rows[i].temperature;
	var spcond = rows[i].spcond;
	var ph = rows[i].ph;   
	var depth = rows[i].depth;
	var power = rows[i].power;   
	var turbidity = rows[i].turbidity;
	var piezoresistance = rows[i].piezoresistance
	var mgl_odo_sat = rows[i].mgl_odo_sat
		
		
	deviceClient.publish("status","json",'{"d" : { "time" : \"'+timestamp+'\" , "mote" : \"'+motestack+'\" , "temp" : \"'+temperature+'\" , "spcond" : \"'+spcond+'\" , "ph" : \"'+ph+'\" , "depth" : \"'+depth+'\" , "turbidity" : \"'+turbidity+'\", "power" : \"'+power+'\" , "piezoresistance" : \"'+piezoresistance+'\" , "mgl_odo_sat" : \"'+mgl_odo_sat+'\" }}', 1);
	
	console.log("status","json",'{"d" : { "time" : \"'+timestamp+'\" , "mote" : \"'+motestack+'\" , "temp" : \"'+temperature+'\" , "spcond" : \"'+spcond+'\" , "ph" : \"'+ph+'\" , "depth" : \"'+depth+'\" , "turbidity" : \"'+turbidity+'\", "power" : \"'+power+'\" , "piezoresistance" : \"'+piezoresistance+'\" , "mgl_odo_sat" : \"'+mgl_odo_sat+'\" }}', 1);
	i=i+1;
}

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
	
	//connect to IoT
	
	deviceClient.on('connect', function () {
		console.log("Device Connected")
		sqlcon.query('SELECT * FROM `observations` Order by `timestamp` LIMIT 20000  ',function(err,sqlrows){
			if(err) throw err;
			rows = sqlrows;
			console.log('Data received from Db:\n');
			setInterval(publish,1000,rows)
		});
		sqlcon.end(function(err) {
			// The connection is terminated gracefully
			// Ensures all previously enqueued queries are still
			// before sending a COM_QUIT packet to the MySQL server.
		});

	//});
	});

	deviceClient.on("error", function (err) {
		console.log("Error : **************************************************************************************************************************************************"+err);
		//res.send("Error : **************************************************************************************************************************************************"+err);
	});
	
});


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
