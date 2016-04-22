angular.module('app').controller('Main', ['Socket', '$scope', function (Socket, $scope) {
    var self = this;

    self.title = 'Socket Chat';
    self.messages = [];
    self.input = '';
    self.log = '';
    self.user = {
        name: ''
    };

    self.send = function (message) {
        if (message.length == 0) {
            console.log('Message does not qualify: ' + message + '.');
        } else {
            self.messages.push(message);
            self.log += '\n' + 'Me: ' + message;
            console.log('Sent message: ' + message);
            Socket.emit('post message', message);
            self.input = '';
        }
    };

    // Socket //
    Socket.on('message', function (message) {
        console.log('Got message: ' + message.message);
        $scope.$apply(function () {
            //message.ct = message.ct.toISOString().replace(/T/, ' ').replace(/\..+/, '');
            self.log += '\n' + message.date + ' ' + message.author + ': ' + message.message;
            self.messages.push(message);
        });
    });

    Socket.on('auth', function (user) {
        console.log('Auth: ' + user);
        $scope.$apply(function () {
            self.user = user;
        });
    });

    Socket.on('users', function (users) {
        console.log('Got users! ' + users.length);
        $scope.$apply(function () {
            self.users = users;
        });
    });

    Socket.on('user', function (user) {
        console.log(user);
        $scope.$apply(function () {
            self.users.push(user);
            self.log += '\n' + user.name + ' joined the room';
        });
    });

    Socket.on('user disconnect', function (removed) {
        $scope.$apply(function () {
            self.users.forEach(function (user) {
                if (user.id === removed.id) {
                    var index = self.users.indexOf(user);
                    self.users.splice(index, 1);
                }
            });
            self.log += '\n' + removed.name + ' left the room';
        });
    });

}]);