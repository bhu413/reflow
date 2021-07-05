module.exports = function (io) { 
    
}

module.exports.sendAll = function(message) {
    io.emit(message);
}

