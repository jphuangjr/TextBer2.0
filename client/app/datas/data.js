var app = angular.module('textber.data', [])

app.config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


app.controller('dataController', function ($scope, $http) {
        // Your code here
        $scope.data = "test"
        $scope.login = function(){
            return $http({
                method: "GET",
                url: "/auth/uber"
            }).then(function(resp){
                $scope.data = resp.data
            })
        }

    });