'use strict';

/* Controllers */

function IndexCtrl($scope, $http) {
    $http.get('/api/hubs').
        success(function (data, status, headers, config) {
            $scope.hubs = data.data;
            console.log(data.data);
            console.log($scope.value);
        });
}

function AddHubCtrl($scope, $http, $location) {
    $scope.form = {};
    
    $scope.submitHub = function () {
        $http.post('/api/hub', $scope.form).
            success(function (data) {
                $location.path('/profile');
            });
    };
}

function ReadHubCtrl($scope, $http, $routeParams) {
    $http.get('/api/hub/' + $routeParams.id).
        success(function (data) {
            $scope.hub = data.data;
        });
}

function EditHubCtrl($scope, $http, $location, $routeParams) {
    $scope.form = {};
    $http.get('/api/post/' + $routeParams.id).
        success(function (data) {
            $scope.form = data.post;
        });

    $scope.editHub = function () {
        $http.put('/api/post/' + $routeParams.id, $scope.form).
            success(function (data) {
                $location.url('/' + $routeParams.id);
            });
    };
}

function DeleteHubCtrl($scope, $http, $location, $routeParams) {
    $http.get('/api/post/' + $routeParams.id).
        success(function (data) {
            $scope.post = data.post;
        });

    $scope.deleteHub = function () {
        $http.delete('/api/post/' + $routeParams.id).
            success(function (data) {
                $location.url('/');
            });
    };

    $scope.home = function () {
        $location.url('/profile');
    };
}
