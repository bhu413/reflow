const fs = require('fs');
const settingsDir = './oven_settings';

var currentSettings = JSON.parse(fs.readFileSync(settingsDir + '/pid_settings.json'));

module.exports.savePidSettings = function (settings) {
    if (settings.hasOwnProperty('p')) {
        currentSettings.p = parseInt(settings.p, 10);
    }
    if (settings.hasOwnProperty('i')) {
        currentSettings.i = parseInt(settings.i, 10);
    }
    if (settings.hasOwnProperty('d')) {
        currentSettings.d = parseInt(settings.d, 10);
    }
    if (settings.hasOwnProperty('look_ahead')) {
        currentSettings.look_ahead = parseInt(settings.look_ahead, 10);
    }
    if (settings.hasOwnProperty('preheat')) {
        currentSettings.preheat = settings.preheat;
    }

    fs.writeFileSync(settingsDir + '/pid_settings.json', JSON.stringify(currentSettings, null, 3));
}

module.exports.getPidSettings = function () {
    return currentSettings;
}

module.exports.getP = function () {
    return currentSettings.p;
}

module.exports.getI = function () {
    return currentSettings.i;
}

module.exports.getD = function () {
    return currentSettings.d;
}

module.exports.getDeltaT = function () {
    return currentSettings.delta_t;
}

module.exports.getLookAhead = function () {
    return currentSettings.look_ahead;
}

module.exports.getPreheat = function () {
    return currentSettings.preheat;
}

module.exports.getOnoff = function () {
    return currentSettings.onoff_mode;
}

