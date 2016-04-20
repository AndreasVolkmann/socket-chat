angular.module('app').controller('Main', ['Socket', '$scope', function (Socket, $scope) {
    var self = this;

    self.title = 'Socket Chat';
    self.messages = [];
    self.input = '';
    self.log = '';
    self.username = '';

    self.send = function (message) {
        if (message.length == 0) {
            console.log('Message does not qualify: ' + message + '.');
        } else {
            self.messages.push(message);
            self.log += '\n' + message;
            console.log('Sent message: ' + message);
            Socket.emit('post message', message);
            self.input = '';
        }
    };

    // Socket //
    Socket.on('message', function (message) {
        console.log('Got message: ' + message);
        $scope.$apply(function () {
            self.log += '\n' + message;
            self.messages.push(message);
        });
    });
    
    Socket.on('username', function (username) {
        $scope.$apply(function () {
            self.username = username;
        });
    });

}]);