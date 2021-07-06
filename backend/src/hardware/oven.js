const Gpio = require('pigpio').Gpio;
const Controller = require('node-pid-controller');
const TempSensor = require("./src/hardware/temp_sensor");

const relay = new Gpio(27, {mode: Gpio.OUTPUT});
const fan = new Gpio(22, {mode: Gpio.OUTPUT});

var status = "Ready";
var interval;

module.exports.startProfile = function(profile) {
    status = "Running";
    //status update for heating, reflow, cooling
    fan.digitalWrite(1);
    datapoints = profile.datapoints;
    var i = 0;
    let ctr = new Controller(0.25, 0.01, 0.00, 1); // k_p, k_i, k_d, dt

    ctr.setTarget(datapoints[i]); // 120km/h
    let correction = ctr.update(TempSensor.getTemp()); // 110km/h is the current speed
    console.log(correction);
    correction *= 100;
    if (correction > 1000) {
        correction = 1000;
    }
    turnRelayOn(correction);

    //io emit "user can open door"
}


module.exports.stop = function() {
    clearInterval(interval);
    relay.pwmWrite(0)
    fan.digitalWrite(0);
    status = "Ready";
}

module.exports.getStatus = function() {
    return status;
}

function turnRelayOn(duration) {
    relay.digitalWrite(1);
    setTimeout(function() {
        relay.digitalWrite(0);
    }, duration );
}


//if anything goes wrong, stop everything in the oven
process.on('uncaughtException', (error) => {
  this.stop();
  process.exit(1);
});

