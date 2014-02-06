var controllers = angular.module('controllers', []);

/* === Path controller on '/', loads all the categories from backend. === */
controllers.controller('catController', function ($scope, Categories) {
	$scope.categories = [];

	Categories.get(function (response) {
		for(arg in response) {
    		if(response.hasOwnProperty(arg) && response[arg].name !== undefined) {
				$scope.categories.push({ 
					'index' : arg, 
					'name' : response[arg].name, 
					'color' : response[arg].color 
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
			resolve: { }
		});

		modalInstance.result.then(function (category) {
			category.$save();
		}, function () {
			//dismiss modal code (cancel)
		});
	};
});

controllers.controller('catModalInstanceController', function ($scope, $modalInstance, Category) {
	$scope.cat = {};

	$scope.ok = function () {
		var category = new Category();
		category.name = $scope.cat.name;
		category.color = '#' + Math.floor(Math.random() * 16777215).toString(16);

		$modalInstance.close(category);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss();
	};
});