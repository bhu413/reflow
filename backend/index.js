// server/index.js

const os = require('os');
const express = require("express");
const app = express();
const server = require("http").createServer(app);

//make socketIO listen on same port as server
const io = require("socket.io")(server);

var socketio;

io.on("connection", (socket) => {
  console.log("New client connected");
  socketio = socket;
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


const PORT = process.env.PORT || 3001;

require("./src/services/routes")(app, express, io);
//require("./src/services/test-routes")(app);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));




//console.log(os.networkInterfaces());