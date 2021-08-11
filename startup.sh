#!/bin/sh
# R-Pi run on start script:
# 
cd "$(dirname "$(find / -type d -name backend | head -1)")"
#cd 7
#
cd backend

# invert display
DISPLAY=:0.0 xrandr --output HDMI-1 --rotate inverted

#to invert touchscreen input
# cd /usr/share/X11/xorg.conf.d/
# open config file libinput or evdev possibly, 
# whatever file in this location which has below section
# find section "Identifier ... touchscreen catchall"
# for 180° inversion, add line in that section 
#Option "TransformationMatrix" "-1 0 1 0 -1 1 0 0 1"


# for 90° rotation,
#Option "TransformationMatrix" "0 -1 1 1 0 0 0 0 1"
#for 270° rotation,
#Option "TransformationMatrix" "0 1 0 -1 0 1 0 0 1"

#start chrome in kiosk mode and go to correct ip address:port
DISPLAY=:0.0 chromium-browser --kiosk --app=http://localhost:3001 &

npm start
