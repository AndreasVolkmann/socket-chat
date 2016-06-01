angular.module('app').controller('Chat', ['Socket', '$rootScope', '$scope', '$localStorage', '$routeParams', function
    (Socket, $root, $scope, $localStorage, $routeParams) {

    var self = this;

    $root.room = $routeParams.room;
    console.log($routeParams);


    self.input = '';


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
                MSG = {
                    text: text,
                    to  : self.to.id
                };
                Socket.emit('message:private', MSG);
            } else {
                var MSG = {
                    text: message,
                    room: $root.room
                };
                Socket.emit('message:public', MSG);
            }
            self.input = '';
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


    Socket.on('history', function (history) {
        history.map((item) => {
            item.date = item.date.replace(/T/, ' ').replace(/\..+/, '');
        });

        $root.message = history;
        //append('Welcome to ' + self.title + '!');
    });


    function append(message) {
        var msg = makeMessage(message);
        $root.messages.push(msg);
    }

    $scope.$on('$destroy', function () {
        Socket.removeListener()
    });

}]);

