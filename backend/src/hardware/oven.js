module.exports = function (socketio, tempSensor) {

    const isPi = require('detect-rpi');
    const Controller = require('node-pid-controller');
    const profile = require('../models/profile');
    const pidSettings = require('../models/pid_settings');
    const hardwareSettings = require('../models/hardware_settings');

    //list of things to export
    var module = {};

    //hardware
    var relay;
    var coolingFan;
    var fan;

    //keeping track of the intervals
    var pidInterval;
    var preheatInterval;
    var coolingInterval;

    //pid variables
    var proportional;
    var integral;
    var derivative;
    var dt;
    var lookAhead;
    var onOffMode;
    var preheat;
    var preheatPower;
    var fanOffTemp;
    var alwaysHitPeak;

    //keep track of current x value
    var currentX = 0;

    //keep track of when we are trying to reach peak
    var peakMode = false;

    //controller variable to be assigned when we start a profile
    var ctr;

    //keeping track of timeouts
    var relayTimeout;
    var coolingFanTimeout;
    var fanTimeout;

    //current status
    var currentAction = "Ready";
    var currentProfile;
    var tempHistory = [];
    var percentDone = 0;
    var coolingMessageSent = false;

    //stores on duration (0 - 1000 ms) for ui to display
    var fanStatus = 0;
    var relayStatus = 0;
    var coolingFanStatus = 0;

    //declare functions based on host
    //if rpi, load real gpio. Otherwise load simulator
    var updateGpio;
    var relayOn;
    var relayOff;
    var coolingFanOn;
    var coolingFanOff;
    var fanOn;
    var fanOff;

    if (isPi()) {

        const Gpio = require('onoff').Gpio;

        updateGpio = function () {
            //turn off old pins if they are defined
            if (relay) {
                relay.writeSync(0);
            }
            if (coolingFan) {
                coolingFan.writeSync(0);
            }
            if (fan) {
                fan.writeSync(0);
            }

            //switch to new pins
            relay = new Gpio(hardwareSettings.getProperty('relay_pin'), 'out');
            coolingFan = new Gpio(hardwareSettings.getProperty('cooling_fan_pin'), 'out');
            fan = new Gpio(hardwareSettings.getProperty('fan_pin'), 'out');
        };

        relayOn = function (duration) {
            if (duration) {
                if (duration >= 980) {
                    relayStatus = 1000;
                    relay.writeSync(1); 
                } else if (duration < 20) {
                    relayOff();
                } else {
                    relayStatus = duration;
                    relay.writeSync(1);
                    relayTimeout = setTimeout(function () {
                        relayStatus = 0;
                        relay.writeSync(0);
                    }, duration);
                }
            } else {
                relayStatus = 1000;
                relay.writeSync(1);
            }
        };

        relayOff = function () {
            relayStatus = 0;
            clearTimeout(relayTimeout);
            relay.writeSync(0);
        };

        coolingFanOn = function (duration) {
            if (duration) {
                if (duration >= 950) {
                    coolingFanStatus = 1000;
                    coolingFan.writeSync(1);
                } else if (duration < 50) {
                    coolingFanOff();
                } else {
                    coolingFanStatus = duration;
                    coolingFan.writeSync(1);
                    coolingFanTimeout = setTimeout(function () {
                        coolingFanStatus = 0;
                        coolingFan.writeSync(0);
                    }, duration);
                }
            } else {
                coolingFanStatus = 1000;
                coolingFan.writeSync(1);
            }

        };

        coolingFanOff = function () {
            coolingFanStatus = 0;
            clearTimeout(coolingFanTimeout);
            coolingFan.writeSync(0);
        };

        fanOn = function (duration) {
            if (duration) {
                if (duration >= 980) {
                    fanStatus = 1000;
                    fan.writeSync(1);
                } else if (duration < 20) {
                    fanOff();
                } else {
                    fanStatus = duration;
                    fan.writeSync(1);
                    fanTimeout = setTimeout(function () {
                        fanStatus = 0;
                        fan.writeSync(0);
                    }, duration);
                }
            } else {
                fanStatus = 1000;
                fan.writeSync(1);
            }
        };

        fanOff = function () {
            fanStatus = 0;
            clearTimeout(fanTimeout);
            fan.writeSync(0);
        };

    } else {
        updateGpio = function () {
            //switch to new pins
            relay = hardwareSettings.getProperty('relay_pin');
            coolingFan = hardwareSettings.getProperty('cooling_fan_pin');
            fan = hardwareSettings.getProperty('fan_pin');
        };

        relayOn = function (duration) {
            if (duration) {
                if (duration > 980) {
                    duration = 980;
                }
                relayStatus = duration;
                console.log("relay on (gpio" + relay + ")");
                relayTimeout = setTimeout(function () {
                    relayStatus = 0;
                    console.log("relay off (gpio" + relay + ")");
                }, duration);
            } else {
                relayStatus = 1000;
                console.log("relay on (gpio" + relay + ")");
            }
        };

        relayOff = function () {
            relayStatus = 0;
            clearTimeout(relayTimeout);
            console.log("relay off (gpio" + relay + ")");
        };

        coolingFanOn = function (duration) {
            if (duration) {
                if (duration > 980) {
                    duration = 980;
                }
                coolingFanStatus = duration;
                console.log("cooling fan on (gpio" + coolingFan + ")");
                coolingFanTimeout = setTimeout(function () {
                    coolingFanStatus = 0;
                    console.log("cooling fan off (gpio" + coolingFan + ")");
                }, duration);
            } else {
                coolingFanStatus = 1000;
                console.log("cooling fan on (gpio" + coolingFan + ")");
            }

        };

        coolingFanOff = function () {
            coolingFanStatus = 0;
            clearTimeout(coolingFanTimeout);
            console.log("cooling fan off (gpio" + coolingFan + ")");
        };

        fanOn = function (duration) {
            if (duration) {
                if (duration > 980) {
                    duration = 980
                }
                fanStatus = duration;
                console.log("fan on (gpio" + coolingFan + ")");
                fanTimeout = setTimeout(function () {
                    fanStatus = 0;
                    console.log("fan off (gpio" + coolingFan + ")");
                }, duration);
            } else {
                fanStatus = 1000;
                console.log("fan on (gpio" + coolingFan + ")");
            }
        };

        fanOff = function () {
            fanStatus = 0;
            clearTimeout(fanTimeout);
            console.log("fan off (gpio" + coolingFan + ")");
        };

    }

    //sends message via socketio
    function sendMessage(severity, message, channel = 'server_message') {
        socketio.emit(channel, { severity: severity, message: message });
    }

    //updates the pid settings
    function updatePidSettings() {
        proportional = pidSettings.getProperty('p');
        integral = pidSettings.getProperty('i');
        derivative = pidSettings.getProperty('d');
        dt = pidSettings.getProperty('delta_t');
        lookAhead = pidSettings.getProperty('look_ahead');
        onOffMode = pidSettings.getProperty('onoff_mode');
        preheat = pidSettings.getProperty('preheat');
        preheatPower = pidSettings.getProperty('preheat_power');
        alwaysHitPeak = pidSettings.getProperty('always_hit_peak');
        fanOffTemp = hardwareSettings.getProperty('fan_turnoff_temp');
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

    function runPreheat() {
        currentAction = "Preheat";
        preheatInterval = setInterval(function () {
            var temperature = tempSensor.getTemp();
            if (temperature >= getTemperatureAtPoint(currentX + lookAhead)) {
                clearInterval(preheatInterval);
                followProfile();
            } else {
                relayOn(preheatPower * 1000);
                tempHistory = [];
                tempHistory.push({ x: currentX, y: temperature });
            }
        }, 1000);
    }

    function findPeak() {
        var datapoints = currentProfile.datapoints;
        var max = 0;
        for (let i = 0; i < datapoints.length; i++) {
            if (datapoints[i].y > datapoints[max].y) {
                max = i;
            }
        }
        return datapoints[max];
    }

    function isLastPointCooling() {
        var datapoints = currentProfile.datapoints;
        if (datapoints[datapoints.length - 2].y > datapoints[datapoints.length - 1].y) {
            return true;
        } else {
            return false;
        }
    }

    function getToPeak() {
        var peak = findPeak();
        var temperature = tempSensor.getTemp();
        if (temperature < peak.y - 2) {
            ctr.setTarget(peak.y);
            var controlVariable = ctr.update(temperature);
            relayOn(controlVariable);
        } else {
            peakMode = false;
            relayOff();
        }
    }

    function followProfile() {
        currentAction = "Running";
        var peak = findPeak();
        var lastPointIsCooling = isLastPointCooling();
        var datapoints = currentProfile.datapoints;
        var temperature = tempSensor.getTemp();

        //fast forward in profile to point with current temperature
        while (temperature > getTemperatureAtPoint(currentX)) {
            if (currentX < datapoints[datapoints.length - 1].x) {
                currentX++;
            } else {
                sendMessage('error', 'Current temperature is above all points');
                module.stop(true);
                return -1;
            }
        }

        pidInterval = setInterval(function () {
            temperature = tempSensor.getTemp();
            var offset = 0;

            if (peakMode) {
                if (offset > 180) {
                    module.stop(true);
                    sendMessage('error', 'Could not reach peak after trying for 3 minutes');
                    return -1;
                }
                getToPeak();
                offset++;
            } else {
                if (currentX + lookAhead === peak.x) {
                    if (temperature < peak.y - 2 && alwaysHitPeak) {
                        peakMode = true;
                    }

                } else {
                    ctr.setTarget(getTemperatureAtPoint(currentX + lookAhead - offset));
                    var controlVariable = ctr.update(temperature);
                    if (controlVariable > 0) {
                        relayOn(controlVariable);
                        coolingFanOff();
                    } else if (controlVariable < 0) {
                        coolingFanOn(controlVariable * -1);
                        relayOff();
                    }
                }


                if (currentX === datapoints[datapoints.length - 2].x - lookAhead + offset) {
                    if (lastPointIsCooling && coolingMessageSent == false) {
                        currentAction = "Cooling";
                        sendMessage('info', 'Cooling started. Door can be opened to for faster cooling if needed.');
                        coolingMessageSent = true;
                    }
                } else if (currentX === datapoints[datapoints.length - 1].x - lookAhead + offset) {
                    currentAction = "Cooling";
                    if (!coolingMessageSent) {
                        sendMessage('success', 'Profile completed. Door can be opened for faster cooling if needed.');
                        coolingMessageSent = true;
                    } else {
                        sendMessage('success', 'Profile completed.');
                    }
                    module.stop(true);
                    clearInterval(pidInterval);
                }
            }
            tempHistory.push({ x: currentX, y: temperature });
            percentDone = Math.min(Math.floor((currentX / datapoints[datapoints.length - 1].x) * 100), 100);
            currentX++;
        }, 1000);
    }

    function coolDown() {
        var timeElapsed = 0;
        currentAction = "Cooling";
        clearInterval(preheatInterval);
        clearInterval(pidInterval);
        relayOff();
        coolingFanOn();
        fanOn();
        coolingInterval = setInterval(function () {
            var temperature = tempSensor.getTemp();
            if ((temperature <= hardwareSettings.getProperty('fan_turnoff_temp') && temperature >= 0) || timeElapsed > 1800) {
                coolingFanOff();
                fanOff();
                currentAction = "Ready";
                clearInterval(coolingInterval);
            } else {
                tempHistory.push({ x: currentX, y: temperature });
                currentX++;
                timeElapsed++;
            }
        }, 1000);
        
    }

    module.startProfile = function () {
        updatePidSettings();
        module.stop();
        fanOn();
        currentX = 0;
        tempHistory = [];
        ctr = new Controller(proportional, integral, derivative, dt); // k_p, k_i, k_d, dt
        if (preheat) {
            runPreheat();
        } else {
            followProfile();
        }
    }


    module.stop = function (shouldCoolDown = false) {
        clearInterval(preheatInterval);
        clearInterval(pidInterval);
        clearInterval(coolingInterval);

        relayOff();
        
        if (shouldCoolDown) {
            coolDown();
        } else {
            fanOff();
            coolingFanOff();
            currentAction = "Ready";
        }
    }

    module.getStatus = function () {
        return {
            status: currentAction,
            temperature: tempSensor.getTemp(),
            current_profile: currentProfile,
            historic_temperature: tempHistory,
            percent: percentDone,
            relay: relayStatus,
            cooling_fan: coolingFanStatus,
            fan: fanStatus
        };
    }

    module.getCurrentProfile = function () {
        return currentProfile;
    }

    module.loadProfile = function (profileName) {
        module.stop(true);
        currentProfile = profile.getProfile(profileName);
        tempHistory = [];
        percentDone = 0;
    }


    //initialize gpio
    updateGpio();

    //load a profile when initalizing 
    module.loadProfile('');

    module.stop();



    //if anything goes wrong, stop everything in the oven
    process.on('uncaughtException', (error) => {
        console.log(error);
        module.stop();
        process.exit(1);
    });

    console.log("oven initialized");

    return module;

}


