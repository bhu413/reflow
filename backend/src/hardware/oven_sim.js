module.exports = function(socketio, tempSensor) {
    
    const Controller = require('node-pid-controller');
    const profile = require('../models/profile');

    //list of things to export
    var module = {};
    var status = "Ready";
    var interval;
    var currentProfile;

    function calculate(controller, datapoints, seconds) {
    }

    module.startProfile = function() {
        var tempHistory = [];
        if (currentProfile == null) {
            return -1;
        }
        var datapoints;
        status = "Running";
        //status update for heating, reflow, cooling
        console.log("fan on");
        datapoints = currentProfile.datapoints;
        var i = 0;
        let ctr = new Controller(0.25, 0.01, 0.00, 1); // k_p, k_i, k_d, dt
    
        ctr.setTarget(datapoints[i]); // 120km/h
        let correction = ctr.update(tempSensor.getTemp()); // 110km/h is the current speed
        console.log(correction);
        correction *= 100;
        if (correction > 1000) {
            correction = 1000;
        }
        turnRelayOn(correction);
        var i = 0;
        interval = setInterval(() => {
            
            tempHistory.push({x: i, y: tempSensor.getTemp()});
            socketio.emit("historic_temperature_update", {historic_temperature: tempHistory, percent: 0});
            i += 5;
        }, 1000);
    
        setTimeout(module.stop, 50000);
        //io emit "user can open door"
        return 0;
    }
    
    
    module.stop = function() {
        clearInterval(interval);
        //relay.pwmWrite(0)
        console.log("fan off");
        status = "Ready";
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
        } else if (duration < 50) {
            duration = 0;
        }
        console.log("relay on");
        setTimeout(function() {
            console.log("relay off");
        }, duration );
    }
    
    //load a profile when initalizing 
    module.loadProfile('smd291ax');

    //if anything goes wrong, stop everything in the oven
    process.on('uncaughtException', (error) => {
        console.log(error);
        module.stop();
        process.exit(1);
    });

    console.log("oven initialized");

    return module;

}


