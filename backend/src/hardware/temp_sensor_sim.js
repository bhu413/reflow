
var currentTemp = 0;

module.exports.getTemp = function () {
    return currentTemp;
}

function updateTemp() {
    currentTemp = Math.floor(Math.random() * (200 - 30) + 30);
}

const interval = setInterval(updateTemp, 1000);

process.on('exit', (code) => {
    clearInterval(interval);
});

console.log("temp sensors initialized");