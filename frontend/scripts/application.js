var application = angular.module('application', ['ngRoute', 'ui.bootstrap', 'controllers', 'services', 'directives', 'filters']);

application.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'catController',
			templateUrl: 'views/categories.html'
		})
		.otherwise({ redirectTo: '/' });
});