var _socketIo = require('socket.io'),
    _gulp = require('gulp'),
    _path = require('path');

module.exports = function (_server) {
    var _io = _socketIo(_server);
    
    _io.on('connection', function (_socket) {
       
    });
    
    
    _gulp.watch([
        "css/**/*.css",
        "**/*.ftl"
    ], function (_event) {
        console.log(_event.path)
        _io.emit('reload');
    })
};