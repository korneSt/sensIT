'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/profile', {
        templateUrl: 'partials/profile',
        controller: IndexCtrl
      }).
      when('/addHub', {
        templateUrl: 'partials/addHub',
        controller: AddHubCtrl
      }).
      when('/readPost/:id', {
        templateUrl: 'partials/readHub',
        controller: ReadHubCtrl
      }).
      when('/editHub/:id', {
        templateUrl: 'partials/editHub',
        controller: EditHubCtrl
      }).
      when('/deletePost/:id', {
        templateUrl: 'partials/deletePost',
        controller: DeleteHubCtrl
      }).
      otherwise({
        redirectTo: '/profile'
      });
    $locationProvider.html5Mode(true);
  }]);