const fs = require('fs');
const profileDir = './reflow_profiles';
const MAX_PROFILES = 20;


var profilesList = [];


//NEED TO IMPLEMENT
//0 == ok
//1 == something wrong with data
//2 == something wrong with file
function validate(profile) {
    //check for invalid file characters
    //must have at least 2 data points
    //datapoints must be in order
    return { status: 200, message: 'profile is valid' };
    return { status: 406, message: 'profie not valid because...' };
}

module.exports.saveProfile = function(profile) {
    var validCode = validate(profile);
    if (validCode.status != 200) {
        return validCode;
    }
    
    if (getNumProfiles() >= MAX_PROFILES) {
        deleteOldestProfile();
    }
    
    fs.writeFileSync(profileDir + '/' + profile.name + '.json', JSON.stringify(profile, null, 3));
    //add to all profiles list
    updateProfileList();
    return validCode;
}

module.exports.getProfileList = function() {
    return fs.readdirSync(profileDir);
}

module.exports.getAllProfiles = function () {
    return profilesList;
}

module.exports.getProfile = function (profileName) {
    if (profileName == '') {
        return JSON.parse(fs.readFileSync('./default_reflow_profiles/flat.json'));
    }
    return JSON.parse(fs.readFileSync(profileDir + '/' + profileName + '.json'));
}

module.exports.updateLastRun = function(profileName) {
    var profile = module.exports.getProfile(profileName);
    profile.last_run = Date.now();
    profile = JSON.stringify(profile, null, 3);
    fs.writeFileSync(profileDir + '/' + profileName + '.json', profile);
    updateProfileList();
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

function updateProfileList() {
    profilesList = [];
    var profileNames = module.exports.getProfileList();
    for (const name of profileNames) {
        profilesList.push(module.exports.getProfile(name.substring(0, name.length - 5)));
    }
}

updateProfileList();

