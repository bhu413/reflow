const spi = require('spi-device');

// An SPI message is an array of one or more read+write transfers
var message = [{
    //max6675 has 16 bits to be read so we make a buffer of 2 bytes (8 bits = 1 byte)
    receiveBuffer: Buffer.alloc(2),
    byteLength: 2,
    //max clock for max6675 = 4.3 MHz
    speedHz: 200000
}];


function readSpi(chipSelect) {
    const tempSensor = spi.open(0, chipSelect, err => {
    if (err) throw err;

        tempSensor.transfer(message, (err, message) => {
            if (err) throw err;

            //get decimal int by reading buffer
            var decimal = message[0].receiveBuffer.readInt16BE();

            //turn decimal to binary string
            var binaryString = decimal.toString(2);

            //check if third to last bit is 1
            if (binaryString.charAt(binaryString.length - 3) == '1') {
                console.log("thermocouple disconnected!!!");
                return NaN;
            } else {
                //get rid of last three bits
                binaryString = binaryString.substring(0, binaryString.length - 3);

                //convert back to decimal
                var tempReading = parseInt(binaryString, 2);
                return (tempReading * 0.25);
            }
        });
    });
}

module.exports.getTemp = function () {
    var celcius1 = readSpi(0);
    var celcius2 = readSpi(1);

    if (celcius1 == NaN && celcius2 == NaN) {
        return NaN;
    } else if (celcius1 == NaN) {
        return celcius2;
    } else if (celcius2 == NaN) {
        return celcius1;
    }

    return (celcius1 + celcius2) / 2;
}
