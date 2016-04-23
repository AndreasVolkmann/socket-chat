angular.module('app').controller('Main', ['Socket', '$scope', function (Socket, $scope) {
    var self = this;

    self.title = 'Socket Chat';
    self.messages = [];
    self.input = '';
    self.user = {
        name: ''
    };
    self.name = '';

    self.send = function (message) {
        if (message.length > 0) {
            //self.messages.push(message);
            append({
                text: message,
                author: 'Me'
            });
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
            append({
                text: message.message,
                date: date,
                author: message.author
            });
        });
    });

    Socket.on('auth', function (user) {
        console.log('Auth: ' + user);
        $scope.$apply(function () {
            self.user = user;
            append('Welcome ' + user.name + '!');
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
            append(user.name + ' joined the room');
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
            append(removed.name + ' left the room');
        });
    });

    Socket.on('history', function (history) {
        history.map((item) => {
            item.date = item.date.replace(/T/, ' ').replace(/\..+/, '');
        });
        $scope.$apply(function () {
            self.messages = history;
        });
    });


    function updateUser(user) {
        self.users.forEach(function (item) {
            if (item.id === user.id) {
                if (item.name !== user.name) {
                    if (user.id === self.user.id) {
                        append({
                            text: 'You changed your name to: ' + user.name,
                            author: ''
                        });
                    } else {
                        append({
                            text: item.name + ' changed his name to: ' + user.name,
                            author: ''
                        });
                    }
                    item.name = user.name;
                    item.date = user.date;
                }
            }
        });
    }

    function append(message) {
        var date = message.date || getDate(),
            text = message.text || message,
            author = message.author || '';

        var msg = {
            date: date,
            text: text,
            author: author
        };
        self.messages.push(msg);
    }

}]);

