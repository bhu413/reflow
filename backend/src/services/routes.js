

module.exports = function (app, express, socketio) {
    //const bodyParser = require("body-parser");
    const { request } = require('express');
    const profile = require('../models/profile');
    var oven;
    if (process.platform !== "linux") {
        tempSensor = require('../hardware/temp_sensor_sim')(socketio);
        oven = require('../hardware/oven_sim')(socketio, tempSensor);
    } else {
        tempSensor = require('../hardware/temp_sensor')(socketio);
        oven = require('../hardware/oven')(socketio, tempSensor);
    }

    //Here we are configuring express to use body-parser as middle-ware.
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    //setting all of our endpoints

    // Have Node serve the files for our built React app
    console.log(__dirname);
    app.use("/", express.static("../frontend/build"));

    app.get("/test", (req, res) => {
        res.json({ message: "Hello from server!" });
    });

    app.get("/temperature", (req, res) => {
        res.json({temperature: tempSensor.getTemp()});
    });

    app.get("/status", (req, res) => {
        res.json({status: oven.getStatus()});
    });

    app.get("/current_profile", (req, res) => {
        res.json({current_profile: oven.getCurrentProfile()});
    });

    app.post("/reflow_profiles/load", (req, res) => {
        oven.loadProfile(req.body.profile_name);
        res.json({message: "loading profile"});
        profile.updateLastRun(req.body.profile_name);
    });

    app.get("/reflow_profiles/list", (req, res) => {
        res.json(profile.getProfileList());
    });

    //statically serve files from folder
    app.use('/reflow_profiles', express.static('reflow_profiles'));

    app.post("/reflow_profiles/save", (req, res) => {
        var validCode = profile.saveProfile(req.body);
        if (validCode == 0) {
            res.json({ message: "Saved successfully" });
        } else if (validCode == 1) {
            res.json({ message: "Error: bad data" });
        } else if (validCode == 2) {
            res.json({ message: "Error: bad file" });
        }
    });

    app.post("/run", (req, res) => {
        var profileName = req.body.profile_name;
        if (oven.getStatus() == "Running") {
            if (req.body.override) {
                oven.startProfile(profile.getProfile(profileName));
                
            } else {
                res.json({message: "already running"});
            }
        } else {
            oven.loadProfile(profileName);
            oven.startProfile();
        }
    });

    app.post("/stop", (req, res) => {
        var reason = request.body.reason;
        oven.stop();
    });
}
