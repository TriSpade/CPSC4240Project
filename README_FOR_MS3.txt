I appoligize for this being turned in late and I thank you for allowing me to still turn it in. This is a list of things completed/incompleted up to MS3.

Client: Fully developed using MQTT to transfer data to server.

Server: Fully developed however it did not query the mysql db to make the csv. However it did fully insert data into the database.

Mysql: fully developed and setup however cannot get it to connect outside of network.

ExpressJS Web Server: Light weight webserver given permission to use instead of Apache. Fully Developed and can connect to index.html hosted through it on network and remotely, uses port 6001.

MQTT/Mosquito Broker: Fully developed used for communication between the client and server.

*The only thing that was missing was the graph output. Some small other changes like security features have been added and the server has been modified to make a csv file in the public directory to allow for the index.html to generate a graph but the graph is still a work in progress. 

if you want to run the code you will need npm and nodejs both can be gotten with and apt-get after you have installed them do a npm install in the cpuClient and cpsc4240Project directories. You will also need to setup mysql. Both will run without Mysql but the server will fail since it makes queries to the Database.