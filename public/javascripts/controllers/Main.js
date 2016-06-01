angular.module('app').controller('Main', ['Socket', '$rootScope', '$scope', '$localStorage', '$routeParams', function
    (Socket, $root, $scope, $localStorage, $routeParams) {


    $scope.$storage = $localStorage;
    $root.messages = [];
    //$root.room = $routeParams.room;

    var self = this;

    self.title = 'Socket Chat';

    $root.user = {name: ''};
    self.users = [];
    self.username = '';

    // ROOM
    self.rooms = [];
    self.roomText = '';


    Socket.emit('auth', {
        username: $scope.$storage.username
    });


    Socket.on('auth', function (user) {
        console.log('Auth: ' + user);
        $root.user = user;
    });

    Socket.on('users', function (users) {
        console.log('Got users! ' + users.length);
        self.users = users;
    });

    Socket.on('user disconnect', function (removed) {
        console.log(removed);
        self.users.forEach(function (user) {
            if (user.username === removed.username) {
                var index = self.users.indexOf(user);
                self.users.splice(index, 1);
            }
        });
        append(removed.username + ' left the room');
    });

    Socket.on('user', function (user) {
        console.log(user);
        self.users.push(user);
        append(user.username + ' joined the room');
    });

    Socket.on('user update', function (user) {
        updateUser(user);
    });

    Socket.on('auth', function (user) {
        append('Welcome ' + user.username + '!');
    });

    self.changeName = function () {
        if (self.username.length > 0) {
            Socket.emit('username', self.username);
            $scope.$storage.username = self.username;
            $root.user.username = self.username;
            self.username = '';
            updateUser($root.user);
        }
    };

    Socket.on('rooms', function (rooms) {
        console.log(rooms);
        self.rooms = rooms;
    });


    // Join ctrl.room
    self.joinRoom = function () {
        var room = self.roomText;
        console.log('Joining room ' + room);
        Socket.emit('room:join', room);
        go(room);
        self.roomText = '';
    };

    function updateUser(user) {
        self.users.forEach(function (item) {
            if (item.id === user.id) {
                if (item.username !== user.username) {
                    if (user.id === $root.user.id) {
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
        var msg = makeMessage(message);
        $root.messages.push(msg);
    }

}]);

