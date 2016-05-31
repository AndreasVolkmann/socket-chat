angular.module('app').controller('Main', ['Socket', '$scope', '$localStorage', function (Socket, $scope, $localStorage) {
    $scope.$storage = $localStorage;
    var self = this;

    self.title = 'Socket Chat';
    self.messages = [];
    self.input = '';
    self.user = {
        name: ''
    };
    self.users = [];
    self.username = '';
    self.room = '';
    self.rooms = ['Main'];

    Socket.emit('auth', $scope.$storage.username);

    self.send = function (message) {
        if (message.length > 0) {
            console.log('Private: ' + self.private);
            append({
                text  : message,
                author: 'Me'
            });
            console.log('Sent message: ' + message);
            if (self.private) {
                var text = message.slice(self.to.name.length + 1);
                console.log(text);
                msg = {
                    text: text,
                    to  : self.to.id
                };
                Socket.emit('private message', msg);
            } else {
                Socket.emit('post message', message);
            }
            self.input = '';
        }
    };

    self.changeName = function () {
        if (self.username.length > 0) {
            Socket.emit('username', self.username);
            $scope.$storage.username = self.username;
            self.user.username = self.username;
            self.username = '';
            updateUser(self.user);
        }
    };

    self.checkInput = function () {
        if (self.input.startsWith('@')) { // check for username
            var space = self.input.indexOf(' ', 1);
            var end = self.input.length;
            if (space > 0) end = space;
            var name = self.input.substring(1, end);

            self.users.some(function (user) {
                if (user.name === name) {
                    self.to = user;
                    self.private = true;
                    console.log(self.private + ' found user: ' + name);
                    return true;
                } else {
                    console.log('TEST');
                    self.private = false;
                }
            });
        }
    };

    // Socket //
    Socket.on('message', function (message) {
        console.log(message);
        var date = message.date.replace(/T/, ' ').replace(/\..+/, '');
        append({
            text  : message.text,
            date  : date,
            author: message.author
        });
    });

    Socket.on('private message', function (message) {
        var date = formatDate(message.date);
        append({
            text  : message.text,
            date  : date,
            author: message.author
        });
    });

    Socket.on('auth', function (user) {
        console.log('Auth: ' + user);
        self.user = user;
        //$scope.$storage.username = user.name;
        append('Welcome ' + user.username + '!');
    });

    Socket.on('users', function (users) {
        console.log('Got users! ' + users.length);
        self.users = users;
    });

    Socket.on('user', function (user) {
        console.log(user);
        self.users.push(user);
        append(user.username + ' joined the room');
    });

    Socket.on('user update', function (user) {
        updateUser(user);
    });

    Socket.on('user disconnect', function (removed) {
        self.users.forEach(function (user) {
            if (user.username === removed.username) {
                var index = self.users.indexOf(user);
                self.users.splice(index, 1);
            }
        });
        append(removed.name + ' left the room');
    });

    Socket.on('history', function (history) {
        history.map((item) => {
            item.date = item.date.replace(/T/, ' ').replace(/\..+/, '');
        });

        self.messages = history;
        append('Welcome to ' + self.title + '!');
    });

    Socket.on('rooms', function (rooms) {
        console.log(rooms);
        self.rooms = rooms;
    });


    function updateUser(user) {
        self.users.forEach(function (item) {
            if (item.id === user.id) {
                if (item.username !== user.username) {
                    if (user.id === self.user.id) {
                        append({
                            text: 'You changed your name to: ' + user.username
                        });
                    } else {
                        append({
                            text: item.username + ' changed his name to: ' + user.username
                        });
                    }
                    item.username = user.username;
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
            date  : date,
            text  : text,
            author: author
        };
        self.messages.push(msg);
    }

}]);

