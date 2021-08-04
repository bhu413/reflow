#!/bin/sh
# R-Pi run on start script:
# 
sudo cd "$(dirname "$(find / -type d -name backend | head -1)")"

sudo cd backend

#start chrome in kiosk mode and go to correct ip address:port
sudo DISPLAY=:0.0 chromium-browser --kiosk --app=http://localhost:3001 &

sudo npm start
