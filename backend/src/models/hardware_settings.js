const fs = require('fs');
const settingsDir = './oven_settings';

var currentSettings = JSON.parse(fs.readFileSync(settingsDir + '/hardware_settings.json'));

module.exports.saveSettings = function (settings) {
    if (settings.hasOwnProperty('relay_pin')) {
        currentSettings.relay_pin = parseInt(settings.relay_pin, 10);
    }
    if (settings.hasOwnProperty('fan_pin')) {
        currentSettings.fan_pin = parseInt(settings.fan_pin, 10);
    }
    if (settings.hasOwnProperty('cooling_fan_pin')) {
        currentSettings.cooling_fan_pin = parseInt(settings.cooling_fan_pin, 10);
    }
    if (settings.hasOwnProperty('fan_turnoff_temp')) {
        currentSettings.fan_turnoff_temp = parseInt(settings.fan_turnoff_temp, 10);
    }

    fs.writeFileSync(settingsDir + '/hardware_settings.json', JSON.stringify(currentSettings, null, 3));
}

module.exports.getAllSettings = function () {
    return currentSettings;
}

module.exports.getProperty = function (property) {
    if (currentSettings.hasOwnProperty(property)) {
        return currentSettings[property];
    } else {
        return null;
    }
}