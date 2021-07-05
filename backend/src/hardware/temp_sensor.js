const spi = require('spi-device');

// An SPI message is an array of one or more read+write transfers
var message = [{
//max6675 has 16 bits to be read so we make a buffer of 2 bytes (8 bits = 1 byte)
receiveBuffer: Buffer.alloc(2),
byteLength: 2,
//max clock for max6675 = 4.3 MHz
speedHz: 200000 // Use a low bus speed to get a good reading from the TMP36
}];


//open first temp sensor chip select 0
const tempSensor1 = spi.open(0, 0, err => {
    if (err) throw err; 
});

//open first temp sensor chip select 1
const tempSensor2 = spi.open(0, 1, err => {
    if (err) throw err; 
});



module.exports.getTemp = function() {
    var celcius1;
    var celcius2;
    tempSensor1.transfer(message, (err, message) => {
        if (err) throw err;
    
        // Convert raw value from sensor to celcius and log to console
        celcius1 = (message[0].receiveBuffer[1]);
    
        console.log(celcius1);
    });

    tempSensor2.transfer(message, (err, message) => {
        if (err) throw err;
    
        // Convert raw value from sensor to celcius and log to console
        celcius2 = (message[0].receiveBuffer[1]);
    
        console.log(celcius2);
    });

    return (celcius1 + celcius2) / 2;
}