var mysql = require('mysql');
var mqtt = require('mqtt');

var con = mysql.createConnection({
	host: "10.0.2.15",
	user: "cpuproj",
	password: "cpupassword",
	database: "cpuproj"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});


con.query('SELECT * FROM temp',function(err,rows){
  if(err) throw err;

  //console.log('Data received from Db:\n');
  //console.log(rows);
//});


var previous_system_time = 0;
var previous_database_time = 0;

for (var i = 0; i < rows.length; i++)
{

   var db_timestamp = rows[i].timestamp;
   var db_temp = rows[i].temp;


   if(i==0)
   {
 
	 console.log(db_timestamp+" "+db_temp);  
	 previous_system_time =  new Date().getTime();
         previous_database_time = db_timestamp;

   }
   else
   {

	  
	   var current_system_time = new Date().getTime();

	   var system_time_difference = current_system_time - previous_system_time;
     
	   var database_time_difference = db_timestamp - previous_database_time

	   while(database_time_difference > system_time_difference)
           {


		current_system_time = new Date().getTime();

	   	system_time_difference = current_system_time - previous_system_time;

	   }

	 console.log(db_timestamp+" "+db_temp);  
	 previous_system_time = current_system_time 
         previous_database_time = db_timestamp; 


   }
   
}

});




con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});
