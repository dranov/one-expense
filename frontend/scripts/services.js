var services = angular.module('services', []);

services.factory('catFactory', function ($http) {
	var factory = {};

	factory.getCategories = function() {
		var categories = [];

		$http.get('http://localhost:5000/api/categories')
            .success(function(data) {
            	for(prop in data) {
                    var cat = {
                        index : prop,
                        name : data[prop].name
                    };
            		categories.push(cat);
            	}
            }).error(function(data, status) {
                alert("Error: " + status);
            });

        return categories;
	};

    factory.addCategory = function(catName) {
        var category = new Object();
        category.name = catName;
        $http.post("http://localhost:5000/api/category", category, {headers : {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'}})
            .success(function(data) {
                alert("success");
            })
            .error(function(data, status) {
                alert("Error: " + status)
            });
    };

	return factory;
});