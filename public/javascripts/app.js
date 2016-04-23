angular.module('app', [
    'ngRoute',
    'luegg.directives',
    'ngStorage'
]).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/Main.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);


function go(destination, argument) {
    var path = '#/' + destination + '/' + argument;
    console.log('Go to: ' + path);
    window.location.href = path;
}


function getDate() {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

function formatDate(date) {
    return date.replace(/T/, ' ').replace(/\..+/, '');
}