module.exports = function(socketio, tempSensor) {
    
    const Controller = require('node-pid-controller');
    const profile = require('../models/profile');
    const Gpio = require('onoff').Gpio;
    const relay = new Gpio(27, 'out');
    const fan = new Gpio(22, 'out');

    //bypasses controller, just does on or off based on temp
    var onOffMode = true;

    //pid variables
    var proportional = 0.25;
    var integral = 0.00;
    var derivative = 0.00;
    var dt = 1;

    //list of things to export
    var module = {};
    var status = "Ready";
    var interval;
    var currentProfile;

    //just a linear interpolation function
    function getTemperatureAtPoint(x) {
        var datapoints = currentProfile.datapoints;
        var arrayLength = datapoints.length;

        //finding closest value greater than x
        var i = 0;
        if (datapoints[i].x == x) {
            return datapoints[i].y;  
        }
        while (datapoints[i].x < x) {
            if (i == arrayLength - 1) {
                return 0;
            }
            i++;
        }

        var x1, x2, y1, y2;
        if (i == 0) {
            x1 = 0;
            y1 = 0;
        } else {
            x1 = datapoints[i - 1].x;
            y1 = datapoints[i - 1].y;
        }
        x2 = datapoints[i].x;
        y2 = datapoints[i].y;

        return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
    }

    module.startProfile = function() {
        if (currentProfile == null) {
            return -1;
        }
        var tempHistory = [];
        var datapoints = currentProfile.datapoints;
        
        //need to implement status update for heating, reflow, cooling
        updateStatus("Running");
    
        fanOn();

        let ctr = new Controller(proportional, integral, derivative, dt); // k_p, k_i, k_d, dt
        var i = 0;
        interval = setInterval(() => {
            temperatureSnapshot = tempSensor.getTemp();
            temperatureTarget = getTemperatureAtPoint(i);
            if (onOffMode) {
                if (temperatureTarget < temperatureSnapshot) {
                    relay.writeSync(1);
                } else {
                    relay.writeSync(0);
                }
            } else {
                ctr.setTarget(temperatureTarget);
                var correction = ctr.update(temperatureSnapshot);
                console.log(correction);
                turnRelayOn(correction * 100);
            }
            if (i > datapoints[datapoints.length - 1].x + 30) {
                module.stop();
            }
            tempHistory.push({x: i, y: temperatureSnapshot});
            socketio.emit("historic_temperature_update", {historic_temperature: tempHistory, percent: 0});
            i++;
        }, 1000);
        //io emit "user can open door"
        return 0;
    }
    
    
    module.stop = function() {
        clearInterval(interval);
        relay.writeSync(0);
        fanOff();
        updateStatus("Ready");
    }
    
    module.getStatus = function() {
        return status;
    }
    
    module.getCurrentProfile = function() {
        return currentProfile;
    }
    
    module.loadProfile = function(profileName) {
        currentProfile = profile.getProfile(profileName);
        socketio.emit("new_profile", {current_profile: currentProfile});
    }
    
    //if less than 50ms, then don't turn on at all
    function turnRelayOn(duration) {
        if (duration >= 1000) {
            relay.writeSync(1);
        } else if (duration > 50) {
            relay.writeSync(1);
            setTimeout(function() {
                relay.writeSync(0);
            }, duration );
        }
    }

    function fanOn() {
        fan.writeSync(1);
    }

    function fanOff() {
        fan.writeSync(0);
    }
    
    function updateStatus(newStatus) {
        status = newStatus;
        socketio.emit("status_update", {new_status: status})
    }

    //load a profile when initalizing 
    module.loadProfile('smd291ax');

    //if anything goes wrong, stop everything in the oven
    process.on('uncaughtException', (error) => {
        console.log(error);
        process.exit(1);
    });

    process.on('exit', (code) => {
        module.stop();
    });

    process.on('SIGINT', () => {
        process.exit(1);
    });

    console.log("oven initialized");

    return module;

}


