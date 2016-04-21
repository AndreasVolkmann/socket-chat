angular.module('app').factory('Socket', function () {
    var socket = io.connect();
    socket.on('connect', function () {
        console.log('Socket connected! ' + socket.id);
    });
    
    return socket;
});