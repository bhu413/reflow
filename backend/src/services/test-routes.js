module.exports = function (app) {
    app.get("/lightstatus", (req, res) => {

        if (led.readSync() === 0) {
          res.json({lightison: false});
        } else {
          res.json({lightison: true});
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
}