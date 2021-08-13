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
    var buzzer;

    //keeping track of the intervals
    var pidInterval;
    var preheatInterval;
    var coolingInterval;

    //pid variables
    var proportional;
    var integral;
    var derivative;
    var useCoolingFan;
    var dt;
    var lookAhead;
    var preheat;
    var preheatPower;
    var alwaysHitPeak;

    //keep track of current x value
    var currentX = 0;

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
    var coolingNotified = false;

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
    var beepBuzzer;

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
            if (buzzer) {
                buzzer.writeSync(0);
            }

            //switch to new pins
            if (hardwareSettings.getProperty('relay_pin') !== 0) {
                relay = new Gpio(hardwareSettings.getProperty('relay_pin'), 'out');
            } else {
                relay = null;
            }
            
            if (hardwareSettings.getProperty('cooling_fan_pin') !== 0) {
                coolingFan = new Gpio(hardwareSettings.getProperty('cooling_fan_pin'), 'out');
            } else {
                coolingFan = null;
            }

            if (hardwareSettings.getProperty('fan_pin') !== 0) {
                fan = new Gpio(hardwareSettings.getProperty('fan_pin'), 'out');
            } else {
                fan = null;
            }
            
            if (hardwareSettings.getProperty('buzzer_pin') !== 0) {
                buzzer = new Gpio(hardwareSettings.getProperty('buzzer_pin'), 'out');
            } else {
                buzzer = null;
            }
            
        };

        relayOn = function (duration) {
            if (relay !== null) {
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
            }
        };

        relayOff = function () {
            if (relay !== null) {
                relayStatus = 0;
                clearTimeout(relayTimeout);
                relay.writeSync(0);
            }
        };

        coolingFanOn = function (duration) {
            if (coolingFan !== null) {
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
            }
        };

        coolingFanOff = function () {
            if (coolingFan !== null) {
                coolingFanStatus = 0;
                clearTimeout(coolingFanTimeout);
                coolingFan.writeSync(0);
            }
        };

        fanOn = function (duration) {
            if (fan !== null) {
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
            }
        };

        fanOff = function () {
            if (fan !== null) {
                fanStatus = 0;
                clearTimeout(fanTimeout);
                fan.writeSync(0);
            }
        };

        beepBuzzer = function (numTimes) {
            if (buzzer !== null) {
                var i = 0;
                var buzzerInterval = setInterval(function () {
                    if (i < numTimes) {
                        i++;
                        buzzer.writeSync(1);
                        setTimeout(function () {
                            buzzer.writeSync(0);
                        }, 500);
                    } else {
                        clearInterval(buzzerInterval);
                    }
                }, 700);
            }
        }

    } else {
        updateGpio = function () {
            //switch to new pins
            if (hardwareSettings.getProperty('relay_pin') !== 0) {
                relay = hardwareSettings.getProperty('relay_pin');
            } else {
                relay = null;
            }

            if (hardwareSettings.getProperty('cooling_fan_pin') !== 0) {
                coolingFan = hardwareSettings.getProperty('cooling_fan_pin');
            } else {
                coolingFan = null;
            }

            if (hardwareSettings.getProperty('fan_pin') !== 0) {
                fan = hardwareSettings.getProperty('fan_pin');
            } else {
                fan = null;
            }

            if (hardwareSettings.getProperty('buzzer_pin') !== 0) {
                buzzer = hardwareSettings.getProperty('buzzer_pin');
            } else {
                buzzer = null;
            }
        };

        relayOn = function (duration) {
            if (relay !== null) {
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
            }
        };

        relayOff = function () {
            if (relay !== null) {
                relayStatus = 0;
                clearTimeout(relayTimeout);
                console.log("relay off (gpio" + relay + ")");
            }
        };

        coolingFanOn = function (duration) {
            if (coolingFan !== null) {
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
            }
        };

        coolingFanOff = function () {
            if (coolingFan !== null) {
                coolingFanStatus = 0;
                clearTimeout(coolingFanTimeout);
                console.log("cooling fan off (gpio" + coolingFan + ")");
            }
        };

        fanOn = function (duration) {
            if (fan !== null) {
                if (duration) {
                    if (duration > 980) {
                        duration = 980
                    }
                    fanStatus = duration;
                    console.log("fan on (gpio" + fan + ")");
                    fanTimeout = setTimeout(function () {
                        fanStatus = 0;
                        console.log("fan off (gpio" + fan + ")");
                    }, duration);
                } else {
                    fanStatus = 1000;
                    console.log("fan on (gpio" + fan + ")");
                }
            }
        };

        fanOff = function () {
            if (fan !== null) {
                fanStatus = 0;
                clearTimeout(fanTimeout);
                console.log("fan off (gpio" + fan + ")");
            }
        };

        beepBuzzer = function (numTimes = 1) {
            if (buzzer !== null) {
                var i = 0;
                var buzzerInterval = setInterval(function () {
                    if (i < numTimes) {
                        i++;
                        console.log("buzzer on (gpio" + buzzer + ")");
                        setTimeout(function () {
                            console.log("buzzer off (gpio" + buzzer + ")");
                        }, 500);
                    } else {
                        clearInterval(buzzerInterval);
                    }
                }, 700);
            }
        }
    }

    //sends message via socketio
    function sendMessage(severity, message, channel = 'server_message') {
        socketio.emit(channel, { severity: severity, message: message });
    }

    //sends a message telling the home page to notify user to open door
    function notifyCooling() {
        sendMessage('info', 'Cooling notification', 'notify_cooling');
    }

    //updates the pid settings
    function updatePidSettings() {
        proportional = pidSettings.getProperty('p');
        integral = pidSettings.getProperty('i');
        derivative = pidSettings.getProperty('d');
        useCoolingFan = pidSettings.getProperty("use_cooling_fan");
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
            if (temperature >= getTemperatureAtPoint(currentX + lookAhead) - 2) {
                clearInterval(preheatInterval);
                followProfile();
            } else {
                relayOn(preheatPower * 100);
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

    function findFirstCoolingPoint() {
        var datapoints = currentProfile.datapoints;
        var i = datapoints.length - 1;
        var current = datapoints[i];
        var oneBefore = datapoints[i - 1];
        while (i > 0 && current.y < oneBefore.y) {
            current = oneBefore;
            i--;
            current = datapoints[i];
            oneBefore = datapoints[i - 1];
        }
        return current;
    }

    function followProfile() {
        currentAction = "Running";
        var peak = findPeak();
        //var lastPointIsCooling = isLastPointCooling();
        var firstCoolingPoint = findFirstCoolingPoint();
        var datapoints = currentProfile.datapoints;
        var offset = 0;
        var peakMode = false;

        pidInterval = setInterval(function () {
            var temperature = tempSensor.getTemp();

            if (temperature < 0) {
                module.stop(true);
                sendMessage('error', 'Profile stopped. Thermocouple disconnected.');
                return -1;
            }

            if (peakMode) {
                if (offset > 300) {
                    module.stop();
                    coolDown(false);
                    sendMessage('error', 'Could not reach peak after attempting for 5 minutes');
                    return -1;
                }
                ctr.setTarget(peak.y);
                offset++;
                if (temperature > peak.y - 2) {
                    peakMode = false;
                }
            } else {
                if (currentX + lookAhead === peak.x) {
                    currentAction = "Peak";
                    if (alwaysHitPeak) {
                        if (temperature < peak.y - 2) {
                            ctr.setTarget(peak.y);
                            peakMode = true;
                        }
                    } else {
                        ctr.setTarget(getTemperatureAtPoint(currentX + lookAhead - offset));
                    }
                } else {
                    ctr.setTarget(getTemperatureAtPoint(currentX + lookAhead - offset));
                }
            }

            var controlVariable = ctr.update(temperature);
            if (controlVariable > 0) {
                relayOn(controlVariable);
                coolingFanOff();
            } else if (controlVariable < 0 && useCoolingFan) {
                coolingFanOn(controlVariable * -1);
                relayOff();
            }

            if (currentX + lookAhead - offset >= firstCoolingPoint.x) {
                if (!coolingNotified) {
                    //var coolingSlope = (datapoints[datapoints.length - 1].y - datapoints[datapoints.length - 2].y) / (datapoints[datapoints.length - 1].x - datapoints[datapoints.length - 2].x)
                    sendMessage('info', 'Cooling started. Please open door now.');
                    notifyCooling();
                    beepBuzzer(4);
                    coolingNotified = true;
                    module.stop(true);
                }
            }
            if (currentX + lookAhead - offset === datapoints[datapoints.length - 1].x) {
                sendMessage('success', 'Profile completed. CAUTION: contents may be hot.');
                module.stop(true);
            }
            tempHistory.push({ x: currentX, y: temperature });
            percentDone = Math.min(Math.floor((currentX / datapoints[datapoints.length - 1].x) * 100), 100);
            currentX++;
        }, 1000);
    }

    function coolDown(shouldRecord = true) {
        var timeElapsed = 0;
        currentAction = "Cooling";
        clearInterval(preheatInterval);
        clearInterval(pidInterval);
        relayOff();

        var temperature = tempSensor.getTemp();
        if (temperature > hardwareSettings.getProperty('fan_turnoff_temp') || temperature < 0) {
            coolingFanOn();
            fanOn();
            coolingInterval = setInterval(function () {
                temperature = tempSensor.getTemp();
                if ((temperature <= hardwareSettings.getProperty('fan_turnoff_temp') && temperature >= 0) || timeElapsed > 1800) {
                    coolingFanOff();
                    fanOff();
                    currentAction = "Ready";
                    clearInterval(coolingInterval);
                    beepBuzzer();
                } else {
                    if (shouldRecord) {
                        percentDone = Math.min(Math.floor((currentX / datapoints[datapoints.length - 1].x) * 100), 100);
                        tempHistory.push({ x: currentX, y: temperature });
                        currentX++;
                    }
                    timeElapsed++;
                }
            }, 1000);
        } else {
            coolingFanOff();
            fanOff();
            currentAction = "Ready";
        }
    }

    module.startProfile = function () {
        updatePidSettings();
        module.stop();
        updateGpio();
        currentX = 0;
        tempHistory = [];
        coolingNotified = false;
        datapoints = currentProfile.datapoints;

        var temperature = tempSensor.getTemp();
        if (temperature < 0) {
            module.stop();
            coolDown(false);
            if (temperature == -1) {
                sendMessage('error', 'Unable to start. Thermocouple disconnected.');
            }
            return -1;
        }

        fanOn();

        //fast forward in profile to point with current temperature
        while (temperature > getTemperatureAtPoint(currentX + lookAhead)) {
            if (currentX < datapoints[datapoints.length - 1].x) {
                currentX++;
            } else {
                sendMessage('error', 'Current temperature is above all points');
                module.stop();
                coolDown(false);
                return -1;
            }
        }

        sendMessage('success', 'Starting ' + currentProfile.name);
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

    module.getHistoricTemperature = function () {
        return {
            historic_temperature: tempHistory
        };
    }

    module.getCurrentProfile = function () {
        return currentProfile;
    }

    module.loadProfile = function (profileName) {
        module.stop();
        coolDown(false);
        currentProfile = profile.getProfile(profileName);
        tempHistory = [];
        percentDone = 0;
        currentX = 0;
    }


    //initialize gpio
    updateGpio();

    //load a profile when initalizing 
    module.loadProfile('');


    //if anything goes wrong, stop everything in the oven
    process.on('uncaughtException', (error) => {
        console.log(error);
        module.stop();
    });

    process.on('exit', (code) => {
        module.stop();
    });

    console.log("oven initialized");

    return module;

}


