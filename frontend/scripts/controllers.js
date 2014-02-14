var controllers = angular.module('controllers', []);

controllers.controller('LoadCtrl', function ($scope, $rootScope, Categories, Expenses) {
	$rootScope.categories = [];
	$rootScope.expenses = [];

	Categories.get(function (response) {
		for(arg in response) {
    		if(response.hasOwnProperty(arg) && response[arg].name !== undefined) {
				$rootScope.categories.push({ 
					'id' : arg, 
					'name' : response[arg].name, 
					'color' : response[arg].color,
					'total' : 0
				});
			}
		}

		console.log('Categories loaded.');
	});

	Expenses.get(function (response) {
		for(arg in response) {
    		if(response.hasOwnProperty(arg) && response[arg].name !== undefined) {
				$rootScope.expenses.push({ 
					'id' : arg, 
					'name' : response[arg].name, 
					'sum' : response[arg].sum,
					'category' : response[arg].category_id
				});
			}
		}

		console.log('Expenses loaded.');

		$scope.total = 0;
		$scope.maxTotal = 0;
		for(var i = 0; i < $rootScope.expenses.length; i++) {
			var expense = $rootScope.expenses[i];
			$scope.total += expense.sum;

			var cat = $rootScope.categories[expense.category - 1];
			cat.total += expense.sum;
			if(cat.total > $scope.maxTotal) {
				$scope.maxTotal = cat.total;
			}
		}
	});
});

/* === Path controller on '/', loads all the categories from backend. === */
controllers.controller('CategoriesListCtrl', function ($scope, $rootScope, Categories) {
	$scope.categories = $rootScope.categories;
});

/* === Controller for 'new category' button. Shows an modal when clicked. === */
controllers.controller('NewCategoryModalCtrl', function ($scope, $modal) {
	$scope.open = function () {
		var modalInstance = $modal.open({
			templateUrl: '/templates/add_category_modal.html',
			controller: 'NewCategoryModalInstanceCtrl',
			resolve: { },
			windowClass: 'add-modal'
		});

		modalInstance.result.then(function (category) {
			category.$save(function (value, headers) {
				console.log('Category \'' + category.name + '\' saved.');

				var cat = {
					'id' : $scope.categories.length,
					'name' : category.name,
					'color' : category.color,
					'size' : Math.floor(Math.random() * 81) + 20
				};
				$scope.categories.push(cat);
			}, function (response) {
				console.log('Category \'' + category.name + '\' could not be saved: httpResponse ' + response);
			});
		}, function () {
			//dismiss modal code (cancel)
		});
	};
});

controllers.controller('NewCategoryModalInstanceCtrl', function ($scope, $modalInstance, Category) {
	$scope.cat = {};

	$scope.ok = function () {
		var valid = true;

		var name = $scope.cat.name;
		if(name === undefined) valid = false;
		else if(name.length == 0) valid = false;

		if(valid) {
			var category = new Category();
			category.name = name;
			category.color = '#' + Math.floor(Math.random() * 16777215).toString(16);

			$modalInstance.close(category);
		} else {

		}
	};

	$scope.cancel = function () {
		$modalInstance.dismiss();
	};
});

controllers.controller('ExpensesListCtrl', function ($scope, $rootScope, $routeParams, Expenses) {
	$scope.categoryId = $routeParams.categoryId;
	$scope.expenses = $rootScope.expenses;
});

/* === Controller for 'new category' button. Shows an modal when clicked. === */
controllers.controller('NewExpenseModalCtrl', function ($scope, $modal) {
	$scope.open = function () {
		var modalInstance = $modal.open({
			templateUrl: '/templates/add_expense_modal.html',
			controller: 'NewExpenseModalInstanceCtrl',
			resolve: { 
				categoryId : function () {
					return $scope.categoryId;
				} 
			},
			windowClass: 'add-modal'
		});

		modalInstance.result.then(function (expense) {
			expense.$save(function (value, headers) {
				console.log('Expense \'' + expense.name + '\' saved.');

				var exp = {
					'id' : $scope.expenses.length,
					'name' : expense.name,
					'sum' : expense.sum,
					'category' : expense.category_id
				};
				$scope.expenses.push(exp);
			}, function (response) {
				console.log('Expense \'' + expense.name + '\' could not be saved: httpResponse ' + response);
			});
		}, function () {
			//dismiss modal code (cancel)
		});
	};
});

controllers.controller('NewExpenseModalInstanceCtrl', function ($scope, $modalInstance, categoryId, Expense) {
	$scope.exp = {};

	$scope.ok = function () {
		var valid = true;

		var name = $scope.exp.name;
		if(name === undefined) valid = false;
		else if(name.length == 0) valid = false;

		var sum = $scope.exp.sum;
		if(sum === undefined) valid = false;
		else if(sum.length == 0) valid = false;

		if(valid) {
			var expense = new Expense();
			expense.name = name;
			expense.sum = sum;
			expense.category_id = categoryId;

			$modalInstance.close(expense);
		} else {

		}
	};

	$scope.cancel = function () {
		$modalInstance.dismiss();
	};
});