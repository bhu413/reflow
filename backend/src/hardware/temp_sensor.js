const isPi = require('detect-rpi');
const hardwareSettings = require("../models/hardware_settings");

var spi = null;
var readSpi;
var updateTemp;

var currentTemp = 0;
var sensor1temp = 0;
var sensor2temp = 0;
// An SPI message is an array of one or more read+write transfers
var message = [{
    //max6675 has 16 bits to be read so we make a buffer of 2 bytes (8 bits = 1 byte)
    receiveBuffer: Buffer.alloc(2),
    byteLength: 2,
    //max clock for max6675 = 4.3 MHz
    speedHz: 200000
}];
    
if (isPi()) {
    spi = require('spi-device');

    //define spi reading function
    readSpi = function (chipSelect) {
        const tempSensor = spi.openSync(0, chipSelect);
        tempSensor.transferSync(message);
        tempSensor.closeSync();

        //get decimal int by reading buffer
        var decimal = message[0].receiveBuffer.readInt16BE();

        if (decimal == 0) {
            return -1;
        }

        //turn decimal to binary string
        var binaryString = decimal.toString(2);

        //check if third to last bit is 1
        if (binaryString.charAt(binaryString.length - 3) == '1') {
            return -1;
        } else {
            //get rid of last three bits
            binaryString = binaryString.substring(0, binaryString.length - 3);

            //convert back to decimal
            var tempReading = parseInt(binaryString, 2);
            return (tempReading * 0.25);
        }
    };

    updateTemp = function () {
        sensor1temp = readSpi(0);
        sensor2temp = readSpi(1);

        if (sensor1temp == -1 && sensor2temp == -1) {
            currentTemp = -1;
        } else if (sensor1temp == -1) {
            currentTemp = sensor2temp;
        } else if (sensor2temp == -1) {
            currentTemp = sensor1temp;
        } else {
            if (Math.abs(sensor1temp - sensor2temp) >= 20) {
                currentTemp = -2;
            } else {
                currentTemp = (sensor1temp + sensor2temp) / 2;
            }
        }
    };

} else {
    updateTemp = function () {
        sensor1temp = Math.floor(Math.random() * (200 - 30) + 30);
        sensor2temp = sensor1temp;
        currentTemp = sensor1temp;
    }
}
    

module.exports.getTemp = function () {
    var offset = hardwareSettings.getProperty("thermocouple_offset");
    return currentTemp + offset;
}

module.exports.getAllTemps = function () {
    var allTemps = {};
    allTemps.sensor_1 = sensor1temp;
    allTemps.sensor_2 = sensor2temp;
    allTemps.current = module.exports.getTemp();
    return allTemps;
}

//update temp every 1 second
//this is so that if there are a lot of requests, it won't read spi once per request
//the temperature will instead be stored in a variable for anyone to grab
const interval = setInterval(updateTemp, 1000);

process.on('exit', (code) => {
    clearInterval(interval);
});

console.log("temp sensors initialized");



