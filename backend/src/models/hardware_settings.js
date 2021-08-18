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
    if (settings.hasOwnProperty('buzzer_pin')) {
        currentSettings.buzzer_pin = parseInt(settings.buzzer_pin, 10);
    }
    if (settings.hasOwnProperty('fan_turnoff_temp')) {
        currentSettings.fan_turnoff_temp = parseInt(settings.fan_turnoff_temp, 10);
        if (currentSettings.fan_turnoff_temp < 0) {
            currentSettings.fan_turnoff_temp = 0;
        }
    }
    if (settings.hasOwnProperty('thermocouple_offset')) {
        currentSettings.thermocouple_offset = parseFloat(settings.thermocouple_offset);
    }
    if (settings.hasOwnProperty('percent_offset')) {
        currentSettings.percent_offset = parseFloat(settings.percent_offset);
    }
    if (settings.hasOwnProperty('thermocouple_average_mode')) {
        currentSettings.thermocouple_average_mode = settings.thermocouple_average_mode;
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