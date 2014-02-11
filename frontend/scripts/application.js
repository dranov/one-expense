var application = angular.module('application', ['ngRoute', 'ngResource', 'ui.bootstrap', 'controllers', 'services', 'directives', 'filters']);


application.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'CategoriesListCtrl',
			templateUrl: 'views/categories.html'
		})
		.when('/category/:categoryId', {
			controller: 'ExpensesListCtrl',
			templateUrl: 'views/expenses.html'
		})
		.otherwise({ redirectTo: '/' });
});