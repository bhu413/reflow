module.exports = function(socketio, tempSensor) {
    
    const Controller = require('node-pid-controller');
    const profile = require('../models/profile');
    const hardwareSettings = require('../models/hardware_settings');
    const pidSettings = require('../models/pid_settings');
    const Gpio = require('onoff').Gpio;
    var relay;
    var fan;

    //list of things to export
    var module = {};
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

        //pid variables
        var proportional = pidSettings.getP();
        var integral = pidSettings.getI();
        var derivative = pidSettings.getD();
        var dt = pidSettings.getDeltaT();
        var lookAhead = pidSettings.getLookAhead();
        var onOffMode = pidSettings.getOnoff();

        //set gpio
        relay = new Gpio(hardwareSettings.getRelayPin(), 'out');
        fan = new Gpio(hardwareSettings.getFanPin(), 'out');

        //need to implement status update for preheat, cooling
        currentAction = "Running";
    
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
                    relay.writeSync(1);
                } else {
                    relay.writeSync(0);
                }
            } else {
                ctr.setTarget(temperatureTarget);
                var correction = ctr.update(temperatureSnapshot);
                console.log(correction);
                turnRelayOn(correction);
            }
            if (i > datapoints[datapoints.length - 1].x + 30) {
                module.stop();
            }
            tempHistory.push({x: i, y: temperatureSnapshot});
            percentDone = Math.floor((i / datapoints[datapoints.length - 1].x) * 100);
            if (percentDone > 100) {
                percentDone = 100;
            }
            i++;
        }, 1000);
        //io emit "user can open door"
        return 0;
    }
    
    
    module.stop = function() {
        clearInterval(interval);
        relay.writeSync(0);
        fanOff();
        currentAction = "Ready";
    }
    
    module.getStatus = function() {
        return {
            status: currentAction,
            temperature: tempSensor.getTemp(),
            current_profile: currentProfile,
            historic_temperature: tempHistory,
            percent: percentDone
        };
    }
    
    module.getCurrentProfile = function() {
        return currentProfile;
    }
    
    module.loadProfile = function (profileName) {
        module.stop();
        currentProfile = profile.getProfile(profileName);
        tempHistory = [];
        percentDone = 0;
    }

    module.savePIDSettings = function (settings) {
        
    }
    
    //if less than 20ms, then don't turn on at all
    function turnRelayOn(duration) {
        if (duration >= 980) {
            relay.writeSync(1);
        } else if (duration < 20) {
            relay.writeSync(0);
        } else {
            relay.writeSync(1);
            setTimeout(function () {
                relay.writeSync(0);
            }, duration);
        }
    }

    function fanOn() {
        fan.writeSync(1);
    }

    function fanOff() {
        fan.writeSync(0);
    }

    //load a profile when initalizing 
    module.loadProfile('');

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


