var controllers = angular.module('controllers', []);

/*-- Loading Controller: loads ALL expenses and categories on page load/reload --*/
controllers.controller('LoadCtrl', function ($scope, $rootScope, Categories, Expenses) {
	// Using $rootScope to have access to categories and expenses from anywhere in app.
	$rootScope.categories = new Object();
	$rootScope.expenses = new Object();

	// Categories is a service / factory that will provide all the categories from the server as an object.
	Categories.get(function (response) {
		for(arg in response) {
    		if(response.hasOwnProperty(arg) && response[arg].name !== undefined) {
				$rootScope.categories[arg] = { 
					'id' : arg, 
					'name' : response[arg].name, 
					'color' : response[arg].color,
					'total' : 0
				};
			}
		}

		console.log('Categories loaded.');
	});

	// Expenses is a service / factory that will provide all the expenses from the server as an object.
	Expenses.get(function (response) {
		for(arg in response) {
    		if(response.hasOwnProperty(arg) && response[arg].name !== undefined) {
				$rootScope.expenses[arg] = { 
					'id' : arg, 
					'name' : response[arg].name, 
					'sum' : response[arg].sum,
					'category' : response[arg].category_id
				};
			}
		}

		console.log('Expenses loaded.');
	});
});

/*-- Categories Controller: used on "/#/" page --*/
controllers.controller('CategoriesListCtrl', function ($scope, $rootScope, Categories) {
	$scope.total = 0;
	$scope.maxTotal = 0;

	// Compute the total value of every expense and the most expensive category
	$rootScope.$watchCollection('expenses', function() {
		for(key in $rootScope.categories) {
			$rootScope.categories[key].total = 0;
		}

		for(key in $rootScope.expenses) {
			var expense = $rootScope.expenses[key];
			var cat = $rootScope.categories[expense.category];
			cat.total += expense.sum;
		}

		var total = 0;
		var maxTotal = 0;
		for(key in $rootScope.categories) {
			var cat = $rootScope.categories[key];
			total += cat.total;
			if(cat.total > maxTotal)
				maxTotal = cat.total;
		}
		$scope.total = total;
		$scope.maxTotal = maxTotal;
	});
});

controllers.controller('NewCategoryModalCtrl', function ($scope, $rootScope, $modal) {
	// Opens a new modal for adding a new category
	$scope.newCategory = function() {
		var modalInstance = $modal.open({
			templateUrl: '/templates/add_category_modal.html',
			controller: 'NewCategoryModalInstanceCtrl',
			resolve: { },
			windowClass: 'add-modal'
		});

		// Executed at modal close: first function at ok, second at cancel
		modalInstance.result.then(function (category) {
			category.$save(function (value, headers) {
				console.log('Category \'' + category.name + '\' saved.');

				var cat = {
					'id' : $scope.categories.length,
					'name' : category.name,
					'color' : category.color,
					'total' : 0
				};
				$rootScope.categories[cat.id] = cat;
			}, function (response) {
				console.log('Category \'' + category.name + '\' could not be saved: response ' + response);
			});
		}, function () { });
	}
});

/* Category Modal Controller: handles the modal behaviour */
controllers.controller('NewCategoryModalInstanceCtrl', function ($scope, $modalInstance, Category) {
	$scope.cat = {};
	$scope.alerts = [];

	$scope.ok = function () {
		var validName = true;
        var nameReason = '';

		var name = $scope.cat.name;
		if(name === undefined || name.length === 0) {
            validName = false;
            nameReason = 'Category name cannot be empty.';
        }

        for(key in $rootScope.categories) {
        	var cat = $rootScope.categories[key];
            if (name === cat.name) {
                validName = false;
                nameReason = 'Category \'' + name + '\' already exists.'
            }
        }

		if(valid) {
			var category = new Category();
			category.name = name;
			category.color = '#' + Math.floor(Math.random() * 16777215).toString(16);

			$modalInstance.close(category);
		} else {
			if(!validName) $scope.alerts.push({ 'type' : 'danger', 'message' : nameReason});
		}
	};

	$scope.cancel = function () {
		$modalInstance.dismiss();
	};
});

/*-- Expenses Controller: used on "/#/category/id" pages --*/
controllers.controller('ExpensesListCtrl', function ($scope, $rootScope, $routeParams, Expenses) {
	$scope.categoryId = $routeParams.categoryId;

	// Compute the total value of every expense and the most expensive category
	$rootScope.$watchCollection('expenses', function() {
		for(key in $rootScope.categories) {
			$rootScope.categories[key].total = 0;
		}

		for(key in $rootScope.expenses) {
			var expense = $rootScope.expenses[key];
			var cat = $rootScope.categories[expense.category];
			cat.total += expense.sum;
		}
	});
});

controllers.controller('NewExpenseModalCtrl', function ($scope, $rootScope, $modal) {
	// Opens a new modal for adding a new expense in this / specific category
	$scope.newExpense = function () {
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

		// Executed at modal close: first function at ok, second at cancel
		modalInstance.result.then(function (expense) {
			expense.$save(function (value, headers) {
				console.log('Expense \'' + expense.name + '\' saved.');

				var exp = {
					'id' : $scope.expenses.length,
					'name' : expense.name,
					'sum' : expense.sum,
					'category' : expense.category_id
				};
				$rootScope.expenses[exp.id] = exp;
			}, function (response) {
				console.log('Expense \'' + expense.name + '\' could not be saved: httpResponse ' + response);
			});
		}, function () { });
	};
});

/* Expense Modal Controller: handles the modal behaviour */
controllers.controller('NewExpenseModalInstanceCtrl', function ($scope, $rootScope, $modalInstance, categoryId, Expense) {
	$scope.exp = {};
	$scope.exp.category = $rootScope.categories[categoryId];
	$scope.alerts = [];

	$scope.ok = function () {
		$scope.alerts = [];

		var validName = true;
		var nameReason = '';

		var validValue = true;
		var valueReason = '';

		var validCategory = true;
		var categoryReason = '';

		var name = $scope.exp.name;
		if(name === undefined || name.length === 0) {
			validName = false;
			nameReason = 'Expense name cannot be empty.';
		}

		var sum = $scope.exp.sum;
		if(sum === undefined || sum.length === 0) {
			validValue = false;
			valueReason = 'Expense value cannot be empty.';
		}

		var category = $scope.exp.category;
		if(category === undefined || category === null) {
			validCategory = false;
			categoryReason = 'Please select a category.';
		}

		if(validName && validValue && validCategory) {
			var expense = new Expense();
			expense.name = name;
			expense.sum = parseFloat(sum);
			expense.category_id = $scope.exp.category.id;

			$modalInstance.close(expense);
		} else {
			if(!validName) $scope.alerts.push({ 'type' : 'danger', 'message' : nameReason});
			if(!validValue) $scope.alerts.push({ 'type' : 'danger', 'message' : valueReason});
			if(!validCategory) $scope.alerts.push({ 'type' : 'danger', 'message' : categoryReason});
		}
	};

	$scope.cancel = function () {
		$modalInstance.dismiss();
	};
});
