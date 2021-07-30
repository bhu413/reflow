

module.exports = function (app, express, socketio) {

    const os = require("os");
    //https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
    const nets = os.networkInterfaces();
    const networkSettings = require("../models/network_settings");
    const pidSettings = require("../models/pid_settings");
    const hardwareSettings = require("../models/hardware_settings");
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

    //NEED TO IMPLEMENT
    app.get("/api/settings/network", (req, res) => {
        res.json(networkSettings.getNetworkSettings());
    });

    app.post("/api/settings/network", (req, res) => {
        networkSettings.saveNetworkSettings(req.body);
        res.json({ status: 200, message: "Saved successfully" });
    });

    app.get("/api/settings/pid", (req, res) => {
        res.json(pidSettings.getPidSettings());
    });

    app.post("/api/settings/pid", (req, res) => {
        pidSettings.savePidSettings(req.body);
        res.json({ status: 200, message: "Saved successfully" });
    });

    app.get("/api/settings/hardware", (req, res) => {
        res.json(hardwareSettings.getHardwareSettings());
    });

    app.post("/api/settings/hardware", (req, res) => {
        hardwareSettings.saveHardwareSettings(req.body);
        res.json({ status: 200, message: "Saved successfully" });
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
        if (oven.getStatus() == "Running") {
            if (req.body.override) {
                oven.startProfile();
                res.json({ status: 200, message: "running profile" });
            } else {
                res.json({status: 409, message: "already running"});
            }
        } else {
            oven.startProfile();
            res.json({ status: 200, message: "running profile" });
        }
    });

    app.post("/api/stop", (req, res) => {
        var reason = req.body.reason;
        oven.stop();
        res.json({ status: 200, message: "stopped" });
    });

    app.use("*", express.static("../frontend/build"));

    var interval = setInterval(() => {
        socketio.emit("status_update", oven.getStatus());
    }, 1000);

    process.on('exit', (code) => {
        clearInterval(interval);
    });
}
