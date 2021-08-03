// server/index.js

const ip = require('ip');

const networkSettings = require('./src/models/network_settings');
const PORT = networkSettings.getProperty('port');

const express = require("express");
const app = express();
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


//make socketIO listen on same port as server
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

require("./src/services/routes")(app, express, io);



