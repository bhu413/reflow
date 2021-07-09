module.exports = function(socketio) {
    //list of things to export
    var module = {};
    var currentTemp = 0;
    
    module.getTemp = function() {
        return currentTemp;
    }
    
    function updateTemp() {
        currentTemp = Math.floor(Math.random() * 300) + 30;
        socketio.emit("temperature_update", {temperature: currentTemp});
    }

    const interval = setInterval(updateTemp, 1000);

    process.on('exit', (code) => {
        clearInterval(interval);
    });

    console.log("temp sensors initialized");

    return module;
}



