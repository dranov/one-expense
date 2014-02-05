var mainApp = angular.module('application', ['ngRoute']);

mainApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'categoriesController',
			templateUrl: 'views/categories.html'
		})
		.otherwise({ redirectTo: '/' });
});

mainApp.factory('categoriesFactory', function () {
	var factory = {};

	factory.getCategories = function($http) {
		var categories = [];

		$http({method : 'GET', url : 'http://localhost:5000/api/categories'})
        .success(function(data, status) {
        	for(prop in data) {
        		categories.push(data[prop]);
        	}
        })
        .error(function(data, status) {
            alert("Error: " + status);
        });

        return categories;
	};

	return factory;
});

mainApp.controller('categoriesController', function($scope, $http, categoriesFactory) {
    $scope.categories = categoriesFactory.getCategories($http);
});