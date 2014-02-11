var controllers = angular.module('controllers', []);

controllers.controller('LoadCtrl', function ($scope, Categories, Expenses) {
	if(sessionStorage['categories'] === null || sessionStorage['categories'] === undefined) {
		this.cats = [];
		var that = this;

		Categories.get(function (response) {
			for(arg in response) {
	    		if(response.hasOwnProperty(arg) && response[arg].name !== undefined) {
					that.cats.push({ 
						'id' : arg, 
						'name' : response[arg].name, 
						'color' : response[arg].color,
						'size' : Math.floor(Math.random() * 81) + 20
					});
				}
			}

			sessionStorage['categories'] = JSON.stringify(that.cats);
		});

		console.log('Categories loaded.');
	}

	if(sessionStorage['expenses'] === null || sessionStorage['expenses'] === undefined) {
		this.exps = [];
		var that = this;

		Expenses.get(function (response) {
			for(arg in response) {
	    		if(response.hasOwnProperty(arg) && response[arg].name !== undefined) {
					that.exps.push({ 
						'id' : arg, 
						'name' : response[arg].name, 
						'sum' : response[arg].sum,
						'category' : response[arg].category_id
					});
				}
			}

			sessionStorage['expenses'] = JSON.stringify(that.exps);
		});

		console.log('Expenses loaded.');
	}
});

/* === Path controller on '/', loads all the categories from backend. === */
controllers.controller('CategoriesListCtrl', function ($scope, Categories) {
	if(sessionStorage['categories'] !== null && sessionStorage['categories'] !== undefined) {
		$scope.categories = JSON.parse(sessionStorage['categories']);
	}
});

/* === Controller for 'new category' button. Shows an modal when clicked. === */
controllers.controller('NewCategoryModalCtrl', function ($scope, $modal) {
	$scope.open = function () {
		var modalInstance = $modal.open({
			templateUrl: '/templates/add_category_modal.html',
			controller: 'NewCategoryModalInstanceCtrl',
			resolve: { },
			windowClass: 'modal'
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

				var cats = JSON.parse(sessionStorage['categories']);
				cats.push(cat);
				sessionStorage['categories'] = JSON.stringify(cats);

				$scope.categories = cats;
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

controllers.controller('ExpensesListCtrl', function ($scope, $routeParams, Expenses) {
	$scope.categoryId = $routeParams.categoryId;
	$scope.expenses = JSON.parse(sessionStorage['expenses']);
});