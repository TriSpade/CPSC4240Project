var os = require("os"),
    cpus = os.cpus();

var fs = require('fs');

var T = 2000;
var time = setInterval(cpuTimer, T);

function cpuTimer() {
    for(var i = 0, len = cpus.length; i < len; i++) {
            console.log("CPU %s:", i);
                var cpu = cpus[i], total = 0;
                    for(type in cpu.times)
                                total += cpu.times[type];

                                    for(type in cpu.times)
                                                console.log("\t", type, Math.round(100 * cpu.times[type] / total));
    }

    var sys = require('util')
    var exec = require('child_process').exec;
    var child;


    child = exec("cat /sys/class/thermal/thermal_zone0/temp", function (error, stdout, stderr) {
            if (error !== null) {
                      console.log('exec error: ' + error);
                          } else {
                                    // You must send time (X axis) and a temperature value (Y axis) 
                                         var date = new Date().getTime();
                                         var temp = parseFloat(stdout)/1000;

                                        console.log("time:%s, CPU temperature: %s", date, temp);
                                        var row = date + "\t" + temp + "\n";
													 fs.appendFile('db.txt', row, encoding='utf8', function(err){													 
													 if(err) throw err;													 
													 });
                                 }
    });
}