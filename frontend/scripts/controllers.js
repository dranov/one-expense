var controllers = angular.module('controllers', []);

/* === Path controller on '/', loads all the categories from backend. === */
controllers.controller('catListController', function ($scope, Categories) {
	$scope.categories = [];

	Categories.get(function (response) {
		for(arg in response) {
    		if(response.hasOwnProperty(arg) && response[arg].name !== undefined) {
				$scope.categories.push({ 
					'index' : arg, 
					'name' : response[arg].name, 
					'color' : response[arg].color,
					'size' : Math.floor(Math.random() * 80) + 20
				});
			}
		}
	});
});

/* === Controller for 'new category' button. Shows an modal when clicked. === */
controllers.controller('catModalController', function ($scope, $modal) {
	$scope.open = function () {
		var modalInstance = $modal.open({
			templateUrl: '/templates/add_category_modal.html',
			controller: 'catModalInstanceController',
			resolve: { },
			windowClass: 'modal'
		});

		modalInstance.result.then(function (category) {
			category.$save(function (value, headers) {
				console.log('Category \'' + category.name + '\' saved.');

				$scope.categories.push({
					'index' : $scope.categories.length,
					'name' : category.name,
					'color' : category.color
				});
			}, function (response) {
				console.log('Category \'' + category.name + '\' could not be saved: httpResponse ' + response);
			});
		}, function () {
			//dismiss modal code (cancel)
		});
	};
});

controllers.controller('catModalInstanceController', function ($scope, $modalInstance, Category) {
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