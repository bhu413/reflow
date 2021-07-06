// server/index.js

const os = require('os');
const express = require("express");
const app = express();
const server = require("http").createServer(app);

//make socketIO listen on same port as server
const io = require("socket.io")(server);
//const io = require("./src/services/socketio")(socketio);

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


var tempSensor;
//initialize temperature devices
if (process.platform !== "linux") {
  tempSensor = require("./src/hardware/temp_sensor_sim");
} else {
  tempSensor = require("./src/hardware/temp_sensor");
}

var interval = setInterval(function() {
  io.emit("temperature_update", {temperature: tempSensor.getTemp()});
}, 1000);

const PORT = process.env.PORT || 3001;

require("./src/services/routes")(app, express);
require("./src/services/test-routes")(app);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));


process.on('exit', (code) => {
  clearInterval(interval);
})

console.log(os.networkInterfaces());