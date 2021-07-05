const fs = require('fs');
const profileDir = './reflow_profiles';
const MAX_PROFILES = 3;


//NEED TO IMPLEMENT
//0 == ok
//1 == something wrong with data
//2 == something wrong with file
function validate(profile) {
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

function deleteOldestProfile() {
    var fileList = getProfileList();
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


function getProfileList() {
    return fs.readdirSync(profileDir);
}
