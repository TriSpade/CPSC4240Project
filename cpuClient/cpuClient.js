
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://127.0.0.1');
var fs = require('fs');
var moment = require('moment');

var T = 5000;
var cpuMath = 0;
var time;
var cpuLoadString;

function cpuTimer(){
    var os = require("os"),
    cpus = os.cpus();
    hostname = os.hostname();

    for(var i = 0, len = cpus.length; i < len; i++) {
        console.log("CPU %s:", i);
        var cpu = cpus[i], total = 0;
        for(type in cpu.times){
            total += cpu.times[type];
        }
            for(type in cpu.times){
                cpuMath = Math.round((100 - (100 * cpu.times[type] / total))*100)/100;
                                    
                if(type == "idle"){
                    if(i == 0){
                        cpuLoadString = "\"" + "cpu" + i + "\"" + " : " + "\"" + cpuMath + "\""  + " , ";
                    }
                    else{
                        cpuLoadString = cpuLoadString + "\"" + "cpu" + i + "\"" + " : " + "\"" + cpuMath + "\"" + " , ";
                    }                       
                }                         
                console.log("\t", type, Math.round((100 * cpu.times[type] / total)*100)/100);
            }
    }
    var date = new Date().getTime();
    date = moment(date).format("DD-MM-YYYY HH:mm:ss");

    var out = "{" + "\"" + "hostname" + "\"" + " : " + "\"" + hostname + "\"" + " , " + cpuLoadString + "\"" + "time" + "\"" + " : " + "\"" + date + "\"" + "}"
    
    console.log(out);
    client.publish('groupproject', out);
}


time = setInterval(cpuTimer, T);