module.exports = function (app, express, socketio) {

    const ip = require("ip");
    const securitySettings = require("../../oven_settings/security.json");
    const crypto = require("crypto");
    const networkSettings = require("../models/network_settings");
    const pidSettings = require("../models/pid_settings");
    const hardwareSettings = require("../models/hardware_settings");
    const appearanceSettings = require("../models/appearance_settings");

    const profile = require('../models/profile');
    const tempSensor = require('../hardware/temp_sensor');
    const oven = require('../hardware/oven')(socketio, tempSensor);

    //Here we are configuring express to use body-parser as middle-ware.
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    const hashedPassword = crypto.createHash('sha256').update(Buffer.from(securitySettings.screen_password)).digest('hex');

    if (!networkSettings.getProperty('remote_connections')) {
        // Custom Middleware
        app.use((req, res, next) => {
            let validIps = ['::1', '127.0.0.1', 'localhost']; // Put your IP whitelist in this array

            if (validIps.includes(req.connection.remoteAddress)) {
                next();
            }
            else {
                // Invalid ip
                res.status(403).send("403 forbidden: Remote connections disabled");
            }
        });
    }

    //setting all of our endpoints

    // Have Node serve the files for our built React app
    
    
    app.use("/", express.static("../frontend/build"));

    app.use("/settings", express.static("../frontend/build"));

    app.use("/profileList", express.static("../frontend/build"));

    app.use("/editProfile", express.static("../frontend/build"));

    app.get("/api/test", (req, res) => {
        res.json({ message: "Hello from server!" });
    });

    app.get("/api/temperature", (req, res) => {
        res.json({temperature: tempSensor.getTemp()});
    });

    app.get("/api/all_temperatures", (req, res) => {
        res.json(tempSensor.getAllTemps());
    });

    app.get("/api/status", (req, res) => {
        res.json({ status: oven.getStatus(), address: ip.address() + ":" + networkSettings.getProperty('port')});
    });

    app.get("/api/current_profile", (req, res) => {
        res.json({current_profile: oven.getCurrentProfile()});
    });

    app.post("/api/send_message", (req, res) => {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        socketio.emit("server_message", { message: "[" + ip + "] " + req.body.message, severity: 'info'});
        res.json({ status: 200, message: "message sent" });
    });


    app.post("/api/reflow_profiles/load", (req, res) => {
        if (oven.getStatus().status !== "Ready" && oven.getStatus().status !=="Cooling") {
            if (req.body.force_load) {
                oven.loadProfile(req.body.profile_name);
                profile.updateLastRun(req.body.profile_name);
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
        res.json(ip.address() + ":" + networkSettings.getProperty('port'));
    });

    //NEED TO IMPLEMENT
    app.get("/api/settings/network", (req, res) => {
        res.json(networkSettings.getAllSettings());
    });

    app.post("/api/settings/network", (req, res) => {
        networkSettings.saveSettings(req.body);
        res.json({ status: 200, message: "Saved successfully" });
    });

    app.get("/api/settings/pid", (req, res) => {
        res.json(pidSettings.getAllSettings());
    });

    app.post("/api/settings/pid", (req, res) => {
        pidSettings.saveSettings(req.body);
        res.json({ status: 200, message: "Saved successfully" });
    });

    app.get("/api/settings/hardware", (req, res) => {
        res.json(hardwareSettings.getAllSettings());
    });

    app.post("/api/settings/hardware", (req, res) => {
        hardwareSettings.saveSettings(req.body);
        res.json({ status: 200, message: "Saved successfully" });
    });

    app.get("/api/settings/appearance", (req, res) => {
        res.json(appearanceSettings.getAllSettings());
    });

    app.post("/api/settings/appearance", (req, res) => {
        appearanceSettings.saveSettings(req.body);
        socketio.emit('appearance_update', appearanceSettings.getAllSettings());
        res.json({ status: 200, message: "Saved successfully" });
    });


    app.post("/api/check_password", (req, res) => {
        if (hashedPassword === req.body.hashed) {
            res.json({ status: 200, message: "valid password" });
        } else {
            res.json({ status: 403, message: "invalid password" });
        }
        
    });
    //statically serve files from folder
    app.use('/api/reflow_profiles', express.static('reflow_profiles'));

    app.post("/api/reflow_profiles/save", (req, res) => {
        var validCode = profile.saveProfile(req.body);
        res.json({ status: validCode.status, message: validCode.message });
    });

    app.post("/api/reflow_profiles/delete", (req, res) => {
        var validCode = profile.deleteProfile(req.body.profile_name);
        res.json({ status: validCode.status, message: validCode.message });
    });

    app.post("/api/run", (req, res) => {
        if (oven.getStatus().status !== "Ready") {
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
        socketio.emit("server_message", {severity: 'warning', message: 'Proflie stopped by user'});
        oven.stop(true);
        res.json({ status: 200, message: "stopped" });
    });

    var interval = setInterval(() => {
        socketio.emit("status_update", oven.getStatus());
    }, 1000);

    process.on('exit', (code) => {
        clearInterval(interval);
    });
}
