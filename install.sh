#!/bin/sh
# R-Pi for Reflow Oven Installation script



# Do these first steps on your own:
# execute the following commands
# git clone https://github.com/bhu413/reflow
# chmod +x install.sh
# sudo ./install.sh

#install npm
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
#install npmn and node.js 14.x
sudo apt-get install -y nodejs

#change directory to backend
cd backend
#totally different from install npm <3
npm install

#copy startup script to constant location
chmod +x backend/startup.sh
cp backend/startup.sh /home/startup.sh
#rm backend/startup.sh

cd startup.service /etc/systemd/system/startup.service
#rm startup.service

chmod 644 /etc/systemd/system/startup.service
systemctl enable /etc/systemd/system/startup.service
