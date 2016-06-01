angular.module('app', [
    'ngRoute',
    'luegg.directives',
    'ngStorage'
]).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/:room', {
            templateUrl: 'views/Chat.html',
            controller : 'Chat as ctrl'
        })
        .otherwise({
            redirectTo: '/Main'
        });
}]);


function go(destination, argument) {
    var path = '#/' + destination;
    if (argument) path += '/' + argument;
    console.log('Go to: ' + path);
    window.location.href = path;
}

function getDate() {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

function formatDate(date) {
    return date.replace(/T/, ' ').replace(/\..+/, '');
}

function makeMessage(message) {
    var date = message.date || getDate(),
        text = message.text || message,
        author = message.author || '';

    return {
        date  : date,
        text  : text,
        author: author
    };
}