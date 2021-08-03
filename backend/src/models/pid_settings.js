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
    if (settings.hasOwnProperty('look_ahead')) {
        currentSettings.look_ahead = parseInt(settings.look_ahead, 10);
    }
    if (settings.hasOwnProperty('preheat')) {
        currentSettings.preheat = settings.preheat;
    }
    if (settings.hasOwnProperty('preheat_power')) {
        currentSettings.preheat_power = parseFloat(settings.preheat_power);
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

