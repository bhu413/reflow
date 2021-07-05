console.log("temp sensors initialized");

module.exports.getTemp = function() {
    return Math.floor(Math.random() * 300) + 30;
}