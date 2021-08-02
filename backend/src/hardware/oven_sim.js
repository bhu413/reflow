module.exports = function(socketio, tempSensor) {
    
    const Controller = require('node-pid-controller');
    const profile = require('../models/profile');
    const pidSettings = require('../models/pid_settings');
    const hardwareSettings = require('../models/hardware_settings');

    //set gpio
    var relay = hardwareSettings.getProperty('relay_pin');
    var fan = hardwareSettings.getProperty('fan_pin');

    //list of things to export
    var module = {};

    //current status
    var currentAction = "Ready";
    var pidInterval;
    var fanInterval;
    var currentProfile;
    var tempHistory = [];
    var percentDone = 0;

    //sends message via socketio
    function sendMessage(severity, message, channel = 'server_message') {
        socketio.emit(channel, { severity: severity, message: message });
    }

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
        if (currentProfile == null || currentAction !== "Ready") {
            return -1;
        }
        var datapoints = currentProfile.datapoints;
        tempHistory = [];

        //pid variables
        var proportional = pidSettings.getProperty('p');
        var integral = pidSettings.getProperty('i');
        var derivative = pidSettings.getProperty('d');
        var dt = pidSettings.getProperty('delta_t');
        var lookAhead = pidSettings.getProperty('look_ahead');
        var onOffMode = pidSettings.getProperty('onoff_mode');
        var preheat = pidSettings.getProperty('preheat');
        var preheatPower = pidSettings.getProperty('preheat_power');
        var fanOffTemp = hardwareSettings.getProperty('fan_turnoff_temp');

        //reset gpio in case of settings change
        relay = hardwareSettings.getProperty('relay_pin');
        fan = hardwareSettings.getProperty('fan_pin');


        if (preheat) {
            currentAction = "Preheat";
        } else {
            currentAction = "Running";
        }
    
        fanOn();

        let ctr = new Controller(proportional, integral, derivative, dt); // k_p, k_i, k_d, dt
        var temperatureSnapshot = tempSensor.getTemp();
        var i = datapoints[0].x;
        while (temperatureSnapshot > getTemperatureAtPoint(i)) {
            if (i < datapoints[datapoints.length - 1].x) {
                i++;
            } else {
                sendMessage('error', 'Current temperature is above all points');
                module.stop(true);
                return -1;
            }
        }
        
        pidInterval = setInterval(() => {
            temperatureSnapshot = tempSensor.getTemp();
            if (temperatureSnapshot < 0) {
                module.stop(true);
                if (temperatureSnapshot == -1) {
                    sendMessage('error', 'Profile stopped. Thermocouple disconnected.');
                } else if (temperatureSnapshot == -2) {
                    sendMessage('error', 'Profile stopped. Thermocouples differ by more than 10 degrees.');
                }
                return -1;
            }

            if (preheat) {
                currentAction = "Preheat";
                if (temperatureSnapshot >= getTemperatureAtPoint(i + lookAhead)) {
                    preheat = false;
                    currentAction = "Running";
                } else {
                    turnRelayOn(preheatPower * 1000);
                    tempHistory = [];
                    tempHistory.push({ x: i, y: temperatureSnapshot });
                }
            } else {
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
                    //console.log(correction);
                    turnRelayOn(correction);
                }
                if (i > datapoints[datapoints.length - 1].x) {
                    currentAction = "Cooling";
                    sendMessage('success', 'Profile completed. Door can be opened to provide faster cooling if needed.');
                    if (temperatureSnapshot <= fanOffTemp) {
                        module.stop();
                    }
                }
                tempHistory.push({ x: i, y: tempSensor.getTemp() });
                percentDone = Math.floor((i / datapoints[datapoints.length - 1].x) * 100);
                if (percentDone > 100) {
                    percentDone = 100;
                }
                i++;
            }         
        }, 1000);

        //io emit "user can open door"
        return 0;
    }
    
    
    module.stop = function (shouldWaitForFan = false) {
        clearInterval(pidInterval);
        console.log("relay off (gpio" + relay + ")");
        fanOff(shouldWaitForFan);
    }
    
    module.getStatus = function () {
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
        currentProfile = profile.getProfile(profileName);
        tempHistory = [];
        percentDone = 0;
    }
    
    //if less than 20ms, then don't turn on at all
    function turnRelayOn(duration) {
        if (duration >= 980) {
            console.log("relay on (gpio" + relay + ")");
        } else if (duration < 20) {
            console.log("relay off (gpio" + relay + ")");
        } else {
            console.log("relay on (gpio" + relay + ")");
            setTimeout(function () {
                console.log("relay off (gpio" + relay + ")");
            }, duration);
        }
    }

    function fanOn() {
        clearInterval(fanInterval);
        console.log("fan on (gpio" + fan + ")");
    }

    function fanOff(shouldWaitForFan) {
        if (shouldWaitForFan) {
            currentAction = "Cooling";
            fanInterval = setInterval(() => {
                temp = tempSensor.getTemp();
                if (temp <= hardwareSettings.getProperty('fan_turnoff_temp') && temp >= 0) {
                    console.log("fan off (gpio" + fan + ")");
                    currentAction = "Ready";
                    clearInterval(fanInterval);
                }
            }, 1000);
        } else {
            console.log("fan off (gpio" + fan + ")");
            currentAction = "Ready";
        }
    }
    
    //load a profile when initalizing 
    module.loadProfile('');

    //if anything goes wrong, stop everything in the oven
    process.on('uncaughtException', (error) => {
        console.log(error);
        module.stop();
        process.exit(1);
    });

    console.log("oven initialized");

    return module;

}


