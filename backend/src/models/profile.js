const fs = require('fs');
const sanitize = require("sanitize-filename");
const profileDir = './reflow_profiles';
const MAX_PROFILES = 50;


var profilesList = [];


//NEED TO IMPLEMENT
//0 == ok
//1 == something wrong with data
//2 == something wrong with file
function validate(profileIn) {
    //check for invalid file characters
    //must have at least 2 data points
    //datapoints must be in order
    var profileToSave = {};
    if (profileIn.hasOwnProperty('name')) {
        if (profileIn.name.length < 1) {
            return { status: 406, message: 'Profile name cannot be blank' };
        } else {
            profileToSave.name = sanitize(profileIn.name);
            if (profileToSave.name.length === 0) {
                return { status: 406, message: 'Profile name contains all illegal characters' };
            }
        }
    } else {
        return { status: 406, message: 'Profile name is required' };
    }

    profileToSave.date_created = Date.now();
    profileToSave.last_run = 0;

    if (!profileIn.hasOwnProperty('datapoints')) {
        return { status: 406, message: 'Datapoints are required' };
    }

    if (!Array.isArray(profileIn.datapoints)) {
        return { status: 406, message: 'Datapoints must be in array form [{"x": 0, "y": 0}, {"x": 1, "y": 1}]' };
    }

    if (profileIn.datapoints.length < 2 || profileIn.datapoints.length > 20) {
        return { status: 406, message: 'Profile must have between 2 and 20 datapoints' };
    }

    profileToSave.datapoints = [];
    try {
        for (var i = 0; i < profileIn.datapoints.length; i++) {
            var point = {};

            if (!profileIn.datapoints[i].hasOwnProperty('x')) {
                return { status: 406, message: 'Points must be in format {"x": 0, "y": 0}' };
            }

            if (!profileIn.datapoints[i].hasOwnProperty('y')) {
                return { status: 406, message: 'Points must be in format {"x": 0, "y": 0}' };
            }
            var currentX = profileIn.datapoints[i].x;
            var currentY = profileIn.datapoints[i].y;
            if (currentX < 0 || currentX > 20000) {
                return { status: 406, message: 'x values must be between 0 and 20000 seconds' };
            }
            if (currentY < 0 || currentY > 300) {
                return { status: 406, message: 'y values must be between 0 and 300 degrees celcius' };
            }
            point.x = currentX;
            point.y = currentY;
            profileToSave.datapoints.push(point);
        }

        //sort datapoints so that lines don't overlap
        for (let i = 0; i < profileToSave.datapoints.length; i++) {
            for (let j = i; j < profileToSave.datapoints.length; j++) {
                if (profileToSave.datapoints[j].x < profileToSave.datapoints[i].x) {
                    var tempPoint = profileToSave.datapoints[i];
                    profileToSave.datapoints[i] = profileToSave.datapoints[j];
                    profileToSave.datapoints[j] = tempPoint;
                }
            }
        }

    } catch (error) {
        return { status: 406, message: 'Error parsing array. Please ensure data is in this format: [{"x": 0, "y": 0}, {"x": 1, "y": 1}]' };
    }
    
    return { status: 200, message: 'Profile saved', new_profile: profileToSave };
    
}

module.exports.saveProfile = function(profile) {
    var validProfile = validate(profile);
    if (validProfile.status != 200) {
        return validProfile;
    }

    if (getNumProfiles() >= MAX_PROFILES) {
        deleteOldestProfile();
    }

    var profileList = module.exports.getProfileList();
    var tempName = validProfile.new_profile.name;
    var i = 1;
    while (profileList.includes(tempName + '.json')) {
        if (tempName.includes('(' + i + ')')) {
            if (tempName.substring(tempName.length - 3, tempName.length) === '(' + i + ')') {
                tempName = tempName.substring(0, tempName.length - 3) + '(' + ++i + ')';
            }
        } else {
            tempName = validProfile.new_profile.name + '(' + i + ')';
        }
    }

    validProfile.new_profile.name = tempName;

    fs.writeFileSync(profileDir + '/' + validProfile.new_profile.name + '.json', JSON.stringify(validProfile.new_profile, null, 3));
    
    //add to all profiles list
    updateProfileList();
    return validProfile;
}

module.exports.deleteProfile = function (profileName) {
    try {
        fs.rmSync(profileDir + '/' + profileName + '.json');
        updateProfileList();
    } catch (error) {
        return { status: 500, message: 'Could not delete profile' };
    }
    return { status: 200, message: 'Profile deleted' };
}

module.exports.getProfileList = function() {
    return fs.readdirSync(profileDir);
}

module.exports.getAllProfiles = function () {
    return profilesList;
}

module.exports.getProfile = function (profileName) {
    if (profileName === '') {
        return {
            name: "Sn42Bi57Ag1",
            date_created: Date.now(),
            last_run: 0,
            datapoints: [
                {
                    x: 0,
                    y: 20
                },
                {
                    x: 80,
                    y: 85
                },
                {
                    x: 121,
                    y: 110
                },
                {
                    x: 150,
                    y: 145
                },
                {
                    x: 195,
                    y: 185
                },
                {
                    x: 235,
                    y: 140
                },
                {
                    x: 298,
                    y: 41
                }
            ]
        };
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
        if (profileObj.last_run < oldestProfileTime && !profileObj.hasOwnProperty('is_default')) {
            oldestProfileTime = profileObj.last_run;
            oldestProfile = file;
        }
    }

    if (oldestProfile != null) {
        fs.rmSync(profileDir + '/' + oldestProfile);
    }
    updateProfileList();
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

