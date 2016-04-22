angular.module('app').controller('Main', ['Socket', '$scope', '$timeout', function (Socket, $scope, $timeout) {
    var self = this;

    self.title = 'Socket Chat';
    self.messages = [];
    self.input = '';
    self.log = {
        log: '',
        append: function (message) {
            var date;
            var text;
            if (message.date) {
                date = message.date;
                text = message.text;
            } else {
                date = getDate();
                text = message;
            }
            this.log += '\n' + date + ' | ' + text;
        }
    };
    self.user = {
        name: ''
    };
    self.name = '';

    self.send = function (message) {
        if (message.length > 0) {
            //self.messages.push(message);
            self.log.append('Me: ' + message);
            console.log('Sent message: ' + message);
            Socket.emit('post message', message);
            self.input = '';
        }
    };

    self.changeName = function () {
        if (self.name.length > 0) {
            Socket.emit('username', self.name);
            self.user.name = self.name;
            self.name = '';
            updateUser(self.user);
        }
    };

    // Socket //
    Socket.on('message', function (message) {
        console.log(message);
        $scope.$apply(function () {
            var date = message.ct.replace(/T/, ' ').replace(/\..+/, '');

            self.log.append({
                text: message.author + ': ' + message.message,
                date: date
            });
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
            self.log.append(user.name + ' joined the room');
        });
    });

    Socket.on('user update', function (user) {
        $scope.$apply(function () {
            updateUser(user);
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
            self.log.append(removed.name + ' left the room');
        });
    });


    function updateUser(user) {
        self.users.forEach(function (item) {
            if (item.id === user.id) {
                if (item.name !== user.name) {
                    self.log.append(item.name + ' changed his name to ' + user.name);
                    item.name = user.name;
                    item.ct = user.ct;
                }
            }
        });
    }

}]);

