angular.module('app').factory('Socket', ['$rootScope', function ($rootScope) {
    var socket = io.connect();
    socket.on('connect', function () {
        console.log('Socket connected! ' + socket.id);
    });
    
    return {
        on: function (eventName, callback) {
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }

            socket.on(eventName, wrapper);

            return function () {
                return socket.removeListener(eventName, wrapper);
            };
        },

        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        },

        removeListener: function (eventName, callback) {
            socket.removeListener(eventName, callback);
        },

        removeAllListeners: function () {
            socket.removeAllListeners();
        }
    };
}]);