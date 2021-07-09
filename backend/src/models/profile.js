const fs = require('fs');
const profileDir = './reflow_profiles';
const MAX_PROFILES = 20;


//NEED TO IMPLEMENT
//0 == ok
//1 == something wrong with data
//2 == something wrong with file
function validate(profile) {
    //check for invalid file characters
    return 0;
}


module.exports.saveProfile = function(profile) {
    var validCode = validate(profile);
    if (validCode != 0) {
        return validCode;
    }
    var filename = profile.name;
    profile = JSON.stringify(profile, null, 3);
    if (getNumProfiles() >= MAX_PROFILES) {
        deleteOldestProfile();
    }
    fs.writeFileSync(profileDir + '/' + filename + '.json', profile);
    return validCode;
}

module.exports.getProfileList = function() {
    return fs.readdirSync(profileDir);
}

module.exports.getProfile = function(profileName) {
    return JSON.parse(fs.readFileSync(profileDir + '/' + profileName + '.json'));
}

module.exports.updateLastRun = function(profileName) {
    var profile = module.exports.getProfile(profileName);
    profile.last_run = Date.now();
    profile = JSON.stringify(profile);
    fs.writeFileSync(profileDir + '/' + profileName + '.json', profile);
}


function deleteOldestProfile() {
    var fileList = module.exports.getProfileList();
    var oldestProfileTime = Date.now();
    var oldestProfile = null;
    for (const file of fileList) {
        let profileObj = JSON.parse(fs.readFileSync(profileDir + '/' + file));
        if (profileObj.last_run < oldestProfileTime) {
            oldestProfileTime = profileObj.last_run;
            oldestProfile = file;
        }
    }

    if (oldestProfile != null) {
        fs.rmSync(profileDir + '/' + oldestProfile);
    }
}

function getNumProfiles() {
    return fs.readdirSync(profileDir).length;
}


