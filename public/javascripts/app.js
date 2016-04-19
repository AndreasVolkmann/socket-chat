angular.module('app', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/Main.html',
            controller: 'Main as ctrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

