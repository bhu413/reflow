//const bodyParser = require("body-parser");
const { request } = require('express');
const profile = require('../models/profile');
var oven;
if (process.platform !== "linux") {
    oven = require('../hardware/oven_sim');
  } else {
    oven = require('../hardware/oven');
  }

module.exports = function (app, express) {
    //Here we are configuring express to use body-parser as middle-ware.
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.get("/api", (req, res) => {
        res.json({ message: "Hello from server!" });
    });

    app.get("/reflow_profiles/list", (req, res) => {
        res.json(profile.getProfileList());
    });

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
                profile.updateLastRun(profileName);
            } else {
                res.json({message: "already running"});
            }
        } else {
            oven.startProfile(profile.getProfile(profileName));
            profile.updateLastRun(profileName);
        }
    });

    app.post("/stop", (req, res) => {
        var reason = request.body.reason;
        oven.stop();
    });
}
