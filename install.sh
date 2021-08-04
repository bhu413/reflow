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
# change
npm install

#copy startup script to constant location
cd ..
chmod +x startup.sh

#find out and store where I am installed
path=$(pwd)

#find out abd store who I am
userMe=$(whoami)


cp startup.sh /home/startup.sh
#rm startup.sh

cp startup.service /etc/systemd/system/startup.service
#rm startup.service



chmod 644 /etc/systemd/system/startup.service
sudo systemctl enable /etc/systemd/system/startup.service
