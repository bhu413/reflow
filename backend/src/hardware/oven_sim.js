module.exports = function(socketio, tempSensor) {
    
    const Controller = require('node-pid-controller');
    const profile = require('../models/profile');

    //bypasses controller, just does on or off based on temp
    var onOffMode = true;

    //how many seconds to look ahead when figuring out target temp
    var lookAhead = 0;

    //pid variables
    var proportional = 0.25;
    var integral = 0.00;
    var derivative = 0.00;
    var dt = 1;

    //list of things to export
    var module = {};

    //current status
    var currentAction = "Ready";
    var interval;
    var currentProfile;
    var tempHistory = [];
    var percentDone = 0;

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
        if (currentProfile == null || currentAction != "Ready") {
            return -1;
        }
        
        var datapoints = currentProfile.datapoints;
        tempHistory = [];
        
        //need to implement status update for heating, reflow, cooling
        currentAction = "Running";;
    
        fanOn();

        let ctr = new Controller(proportional, integral, derivative, dt); // k_p, k_i, k_d, dt
        var i = 0;
        interval = setInterval(() => {
            temperatureSnapshot = tempSensor.getTemp();
            if (temperatureSnapshot < 0) {
                module.stop();
                return -1;
            }
            temperatureTarget = getTemperatureAtPoint(i + lookAhead);
            if (onOffMode) {
                if (temperatureTarget > temperatureSnapshot) {
                    console.log("relay on");
                } else {
                    console.log("relay off");
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
            tempHistory.push({ x: i, y: tempSensor.getTemp() });
            percentDone = Math.floor((i / datapoints[datapoints.length - 1].x) * 100);
            i++;
        }, 1000);

        //io emit "user can open door"
        return 0;
    }
    
    
    module.stop = function () {
        clearInterval(interval);
        //relay.pwmWrite(0)
        fanOff();
        currentAction = "Ready";;
    }
    
    module.getStatus = function () {
        return {
            status: currentAction,
            temperature: tempSensor.getTemp(),
            current_profile: currentProfile,
            historic_temperature: tempHistory,
            percentage: percentDone
        };
    }
    
    module.getCurrentProfile = function() {
        return currentProfile;
    }
    
    module.loadProfile = function (profileName, force) {
        if (currentAction == "Running") {
            if (force) {
                module.stop();
                currentProfile = profile.getProfile(profileName);
            } else {
                return -1;
            }
        } else {
            currentProfile = profile.getProfile(profileName);
        }
    }
    
    //if less than 50ms, then don't turn on at all
    function turnRelayOn(duration) {
        if (duration >= 900) {
            console.log("relay on");
        } else if (duration > 50) {
            console.log("relay on");
            setTimeout(function() {
                console.log("relay off");
            }, duration );
        }
    }

    function fanOn() {
        console.log("fan on");
    }

    function fanOff() {
        console.log("fan off");
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


