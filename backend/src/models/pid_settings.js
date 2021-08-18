const fs = require('fs');
const settingsDir = './oven_settings';

var currentSettings = JSON.parse(fs.readFileSync(settingsDir + '/pid_settings.json'));

module.exports.saveSettings = function (settings) {
    if (settings.hasOwnProperty('p')) {
        currentSettings.p = parseFloat(settings.p);
    }
    if (settings.hasOwnProperty('i')) {
        currentSettings.i = parseFloat(settings.i);
    }
    if (settings.hasOwnProperty('d')) {
        currentSettings.d = parseFloat(settings.d);
    }
    if (settings.hasOwnProperty('use_cooling_fan')) {
        currentSettings.use_cooling_fan = settings.use_cooling_fan;
    }
    if (settings.hasOwnProperty('look_ahead')) {
        currentSettings.look_ahead = parseInt(settings.look_ahead, 10);
    }
    if (settings.hasOwnProperty('preheat')) {
        currentSettings.preheat = settings.preheat;
    }
    if (settings.hasOwnProperty('preheat_power')) {
        currentSettings.preheat_power = parseInt(settings.preheat_power, 10);
        if (currentSettings.preheat_power < 0) {
            currentSettings.preheat_power = 0;
        } else if (currentSettings.preheat_power > 100) {
            currentSettings.preheat_power = 100;
        }
    }
    if (settings.hasOwnProperty('always_hit_peak')) {
        currentSettings.always_hit_peak = settings.always_hit_peak;
    }

    fs.writeFileSync(settingsDir + '/pid_settings.json', JSON.stringify(currentSettings, null, 3));
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

