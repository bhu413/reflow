const fs = require('fs');
const settingsDir = './oven_settings';

var currentSettings = JSON.parse(fs.readFileSync(settingsDir + '/appearance_settings.json'));

module.exports.saveSettings = function (settings) {
    if (settings.hasOwnProperty('dark_mode')) {
        currentSettings.dark_mode = settings.dark_mode;
    }
    if (settings.hasOwnProperty('primary_color')) {
        currentSettings.primary_color = settings.primary_color;
    }
    if (settings.hasOwnProperty('secondary_color')) {
        currentSettings.secondary_color = settings.secondary_color;
    }
    fs.writeFileSync(settingsDir + '/appearance_settings.json', JSON.stringify(currentSettings, null, 3));
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
