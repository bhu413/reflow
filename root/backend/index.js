// server/index.js

const express = require("express");
const app = express();
const server = require("http").createServer(app);
//make socketIO listen on same port as server
const io = require("socket.io")(server)
const PORT = process.env.PORT || 3001;

const gpio = require('onoff').Gpio;
const led = new gpio(18, 'out');

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/lightstatus", (req, res) => {

  if (led.readSync() === 0) {
    res.send(false);
  } else {
    res.send(true);
  }

  //res.json({ status: false });
});

app.get("/lighton", (req, res) => {
  led.writeSync(1);
  io.to("allClients").emit("lighton");
  console.log("light on");
  res.send('turning light on');
});

app.get("/lightoff", (req, res) => {
  led.writeSync(0);
  io.to("allClients").emit("lightoff");
  console.log("light off");
  res.send('turning light off');
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.join("allClients");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

});
