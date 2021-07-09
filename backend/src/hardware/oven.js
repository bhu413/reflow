const { socket } = require('../../../frontend/src/helpers/socket');

module.exports = function(socketio) {
    const Gpio = require('pigpio').Gpio;
    const Controller = require('node-pid-controller');
    const TempSensor = require("./temp_sensor");
    const profile = require('../models/profile');

    const relay = new Gpio(27, {mode: Gpio.OUTPUT});
    const fan = new Gpio(22, {mode: Gpio.OUTPUT});

    //list of things to export
    var module = {};
    var status = "Ready";
    var interval;
    var currentProfile;

    module.startProfile = function() {
        var tempHistory = [];
        var percentage = 0;
        
        if (currentProfile == null) {
            return -1;
        }
        var datapoints;
        updateStatus("Running");
        //status update for heating, reflow, cooling
        datapoints = currentProfile.datapoints;
        var i = 0;
        let ctr = new Controller(0.25, 0.01, 0.00, 1); // k_p, k_i, k_d, dt

        ctr.setTarget(datapoints[i]); // 120km/h
        let correction = ctr.update(TempSensor.getTemp()); // 110km/h is the current speed

        //add percentage for progress bar
        socketio.emit("historic_temperature_update", {historic_temperature: tempHistory, percentDone: percentage});
        console.log(correction);
        correction *= 100;
        if (correction > 1000) {
            correction = 1000;
        }
        turnRelayOn(correction);


        //io emit "user can open door"
        return 0;
    }


    module.stop = function() {
        clearInterval(interval);
        relay.pwmWrite(0)
        fan.digitalWrite(0);
        updateStatus("Ready");
    }

    module.getStatus = function() {
        return status;
    }

    module.getCurrentProfile = function() {
        return currentProfile;
    }

    module.loadProfile = function(profileName) {
        console.log("loading profile");
        currentProfile = profile.getProfile(profileName);
        socketio.emit("new_profile", {current_profile: currentProfile});
    }

    function turnRelayOn(duration) {
        if (duration > 1000) {
            duration = 1000;
        }
        relay.digitalWrite(1);
        setTimeout(function() {
            relay.digitalWrite(0);
        }, duration );
    }

    function fanOn() {
        fan.digitalWrite(1);
    }

    function fanOff() {
        fan.digitalWrite(0);
    }

    function updateStatus(newStatus) {
        status = newStatus;
        socketio.emit("status_update", {new_status: status})
    }

    //load a profile when initalizing 
    module.loadProfile('smd291ax');

    //if anything goes wrong, stop everything in the oven
    process.on('uncaughtException', (error) => {
        module.stop();
        process.exit(1);
    });

    console.log("oven initialized");

    return module;
}




