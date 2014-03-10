var controllers = angular.module('controllers', []);

/*-- Loading Controller: loads ALL expenses and categories on page load/reload --*/
controllers.controller('LoadCtrl', function ($scope, $rootScope, Categories, Expenses) {
	// Using $rootScope to have access to categories and expenses from anywhere in app.
	$rootScope.categories = new Object();
	$rootScope.expenses = new Object();
	$rootScope.currentDate = '';
	$rootScope.colorScheme = ['#F4B300', '#78BA00', '#2673EC', '#AE113D', '#006AC1', '#FF981D', '#008287', '#199900', 
							'#AA40FF', '#00C13F', '#FF2E12', '#FF1D77', '#00A4A4', '#91D100', '#1FAEFF', '#FF76BC'];

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
					'category' : response[arg].category_id,
                    'date': response[arg].date
				};
			}
		}

		console.log('Expenses loaded.');
	});

	var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
	$rootScope.currentDate = months[new Date().getMonth()] + ' ' + new Date().getDate();
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

/* Category Modal Controller: handles the modal behaviour */
controllers.controller('NewCategoryModalInstanceCtrl', function ($scope, $rootScope, $modalInstance, Category) {
	$scope.cat = {};
	$scope.cat.color = $rootScope.colorScheme[0];
	$scope.alerts = [];

	$scope.ok = function () {
        $scope.alerts = [];
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

		if(validName) {
			var category = new Category();
			category.name = name;
			category.color = $scope.cat.color;

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

        if (parseFloat(sum) === NaN) {
            validValue = false;
            valueReason = "Expense must be a number.";
        }

        if (parseFloat(sum) < 0) {
            validValue = false;
            valueReason = "Expense cannot have negative value.";
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

/* Expense Modal Controller: handles the modal behaviour */
controllers.controller('NewTimeSpanModalInstanceCtrl', function ($scope, $rootScope, $modalInstance) {
	$scope.time = {};

	$scope.ok = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss();
	};
});

controllers.controller('NewModalCtrl', function ($scope, $rootScope, $modal) {
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
			var cat = {
				'name' : category.name,
				'color' : category.color,
				'total' : 0
			};

			category.$save(function () {
				cat.id = category.id;
				$rootScope.categories[cat.id] = cat;

				console.log('Category \'' + cat.name + '\' with id ' + cat.id + ' saved.');
			}, function (response) {
				console.log('Category \'' + cat.name + '\' could not be saved: response ' + response);
			});
		}, function () { });
	};

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
			var exp = {
				'name' : expense.name,
				'sum' : expense.sum,
				'category' : expense.category_id
			};

			expense.$save(function () {
				exp.id = expense.id;
				$rootScope.expenses[exp.id] = exp;

				console.log('Expense \'' + exp.name + '\' saved.');
			}, function (response) {
				console.log('Expense \'' + exp.name + '\' could not be saved: httpResponse ' + response);
			});
		}, function () { });
	};

	// Opens a new modal for selecting a timespan
	$scope.selectTimeSpan = function () {
		var modalInstance = $modal.open({
			templateUrl: '/templates/select_timespan_modal.html',
			controller: 'NewTimeSpanModalInstanceCtrl',
			resolve: { },
			windowClass: 'add-modal',

		});

		// Executed at modal close: first function at ok, second at cancel
		modalInstance.result.then(function () {
		}, function () { });
	};
});
