#!/bin/sh
# R-Pi run on start script:
# 
cd "$(dirname "$(find / -type d -name backend | head -1)")"
cd backend
npm start


#start chrome in kiosk mode and go to correct ip address:port
chromium-browser --kiosk --app=http://localhost:3001
