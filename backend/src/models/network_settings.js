const fs = require('fs');
const settingsDir = './oven_settings';

var currentSettings = JSON.parse(fs.readFileSync(settingsDir + '/network_settings.json'));

module.exports.saveNetworkSettings = function (settings) {
    if (settings.hasOwnProperty('port')) {
        currentSettings.port = parseInt(settings.port, 10);
    }
    if (settings.hasOwnProperty('remote_connections')) {
        currentSettings.remote_connections = settings.remote_connections;
    }
    fs.writeFileSync(settingsDir + '/network_settings.json', JSON.stringify(currentSettings, null, 3));
}

module.exports.getNetworkSettings = function () {
    return currentSettings;
}

module.exports.getPort = function () {
    return currentSettings.port;
}

module.exports.getRemoteConnection = function () {
    return currentSettings.remote_connections;
}


