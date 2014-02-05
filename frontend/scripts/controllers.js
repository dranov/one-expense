var controllers = angular.module('controllers', []);

/* === Path controller on '/', loads all the categories from backend. === */
controllers.controller('catController', function ($scope, catFactory) {
    $scope.categories = catFactory.getCategories();
});

/* === Controller for 'new category' button. Shows an modal when clicked. === */
controllers.controller('catModalController', function ($scope, $modal) {
	$scope.open = function () {
		var modalInstance = $modal.open({
			templateUrl: '/templates/add_category_modal.html',
			controller: 'catModalInstanceController',
			resolve: { }
		});

		modalInstance.result.then(function (something) {
			//close modal code
		}, function () {
			//dismiss modal code (cancel)
		});
	};
});

controllers.controller('catModalInstanceController', function ($scope, $modalInstance, catFactory) {
	$scope.ok = function () {
		catFactory.addCategory($scope.catName);
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss();
	};
});