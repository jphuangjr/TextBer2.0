angular.module('textber', ["textber.data", 'ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/loggedIn', {
                templateUrl: 'app/datas/data.html',
                controller: 'dataController'
            })
            .when('/uberRide', {
                templateUrl: 'app/datas/data.html',
                controller: 'dataController'
            })

    })

