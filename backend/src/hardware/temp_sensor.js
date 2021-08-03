module.exports = function (socketio) {
    const spi = require('spi-device');

    //list of things to export
    var module = {};
    var currentTemp = 0;
    // An SPI message is an array of one or more read+write transfers
    var message = [{
        //max6675 has 16 bits to be read so we make a buffer of 2 bytes (8 bits = 1 byte)
        receiveBuffer: Buffer.alloc(2),
        byteLength: 2,
        //max clock for max6675 = 4.3 MHz
        speedHz: 200000
    }];

    function readSpi(chipSelect) {
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
    }

    function updateTemp() {
        var celcius1 = readSpi(0);
        var celcius2 = readSpi(1);

        if (celcius1 == -1 && celcius2 == -1) {
            currentTemp = -1;
        } else if (celcius1 == -1) {
            currentTemp = celcius2;
        } else if (celcius2 == -1) {
            currentTemp = celcius1;
        } else {
            if (Math.abs(celcius1 - celcius2) >= 10) {
                currentTemp = -2;
            } else {
                currentTemp = (celcius1 + celcius2) / 2;
            }
        }
    }

    module.getTemp = function () {
        return currentTemp;
    }

    //update temp every 1 second
    const interval = setInterval(updateTemp, 1000);

    process.on('exit', (code) => {
        clearInterval(interval);
    });

    console.log("temp sensors initialized");

    return module;
}



