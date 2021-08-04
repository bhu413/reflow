#!/bin/sh
# R-Pi run on start script:
# 
#cd "$(dirname "$(find / -type d -name backend | head -1)")"
cd 7

cd backend

#start chrome in kiosk mode and go to correct ip address:port
DISPLAY=:0.0 chromium-browser --kiosk --app=http://localhost:3001 &

npm start
