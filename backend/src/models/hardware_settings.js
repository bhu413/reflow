const fs = require('fs');
const settingsDir = './oven_settings';

var currentSettings = JSON.parse(fs.readFileSync(settingsDir + '/hardware_settings.json'));

module.exports.saveHardwareSettings = function (settings) {
    if (settings.hasOwnProperty('relay_pin')) {
        currentSettings.relay_pin = parseInt(settings.relay_pin, 10);
    }
    if (settings.hasOwnProperty('fan_pin')) {
        currentSettings.fan_pin = parseInt(settings.fan_pin, 10);
    }

    fs.writeFileSync(settingsDir + '/hardware_settings.json', JSON.stringify(currentSettings, null, 3));
}

module.exports.getHardwareSettings = function () {
    return currentSettings;
}

module.exports.getRelayPin = function () {
    return currentSettings.relay_pin;
}

module.exports.getFanPin = function () {
    return currentSettings.fan_pin;
}
