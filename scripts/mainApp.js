var mainApp = angular.module('mainApp', ['ngRoute']);

mainApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'MainController',
			templateUrl: 'views/root.html'
		})
		.otherwise({ redirectTo: '/' });
});

mainApp.factory('mainFactory', function () {
	var factory = {};
	return factory;
});

mainApp.controller('MainController', function($scope, mainFactory) {
});