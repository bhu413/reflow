

module.exports = function (app, express, socketio) {

    const os = require("os");
    //https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
    const nets = os.networkInterfaces();
    const addressResults = Object.create({}); // Or just '{}', an empty object

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!addressResults[name]) {
                    addressResults[name] = [];
                }
                addressResults[name].push(net.address);
            }
        }
    }


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
    app.use("/", express.static("../frontend/build"));

    app.get("/api/test", (req, res) => {
        res.json({ message: "Hello from server!" });
    });

    app.get("/api/temperature", (req, res) => {
        res.json({temperature: tempSensor.getTemp()});
    });

    app.get("/api/status", (req, res) => {
        res.json({status: oven.getStatus()});
    });

    app.get("/api/current_profile", (req, res) => {
        res.json({current_profile: oven.getCurrentProfile()});
    });

    app.post("/api/reflow_profiles/load", (req, res) => {
        if (oven.getStatus().status !== "Ready") {
            if (req.body.force_load) {
                oven.loadProfile(req.body.profile_name);
                res.json({ status: 200, message: "loading profile" });
            } else {
                res.json({ status: 409, message: "oven currently running" });
            }
        } else {
            oven.loadProfile(req.body.profile_name);
            profile.updateLastRun(req.body.profile_name);
            res.json({ status: 200, message: "loading profile" });
        }
    });

    app.get("/api/reflow_profiles/list", (req, res) => {
        res.json(profile.getProfileList());
    });

    app.get("/api/reflow_profiles/all", (req, res) => {
        res.json(profile.getAllProfiles());
    });

    app.get("/api/server_address", (req, res) => {
        res.json(addressResults);
    });

    //statically serve files from folder
    app.use('/api/reflow_profiles', express.static('reflow_profiles'));

    app.post("/api/reflow_profiles/save", (req, res) => {
        var validCode = profile.saveProfile(req.body);
        if (validCode == 0) {
            res.json({ status: 200, message: "Saved successfully" });
        } else if (validCode == 1) {
            res.json({ status: 409, message: "Error: bad data" });
        } else if (validCode == 2) {
            res.json({ status: 409, message: "Error: bad file" });
        }
    });

    app.post("/api/settings/pid", (req, res) => {
        var validCode = oven.savePIDSettings(req.body);
        if (validCode == 0) {
            res.json({ status: 200, message: "Saved successfully" });
        } else if (validCode == 1) {
            res.json({ status: 409, message: "Error: bad data" });
        } else if (validCode == 2) {
            res.json({ status: 409, message: "Error: bad file" });
        }
    });

    app.post("/api/run", (req, res) => {
        var profileName = req.body.profile_name;
        if (oven.getStatus() == "Running") {
            if (req.body.override) {
                oven.startProfile(profile.getProfile(profileName));
                res.json({ message: "running profile" });
            } else {
                res.status(409).json({message: "already running"});
            }
        } else {
            oven.loadProfile(profileName);
            oven.startProfile();
            res.json({ message: "running profile" });
        }
    });

    app.post("/api/stop", (req, res) => {
        var reason = req.body.reason;
        oven.stop();
        res.json({ message: "stopped" });
    });

    app.use("*", express.static("../frontend/build"));

    var interval = setInterval(() => {
        socketio.emit("status_update", oven.getStatus());
    }, 1000);

    process.on('exit', (code) => {
        clearInterval(interval);
    });
}
