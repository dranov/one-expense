var filters = angular.module('filters', []);

filters.filter('orderObjectBy', function () {
	return function (input, attribute, reverse) {
		if(!angular.isObject(input)) return input;

		var array = [];
		for(var objectKey in input) {
			array.push(input[objectKey]);
		}

		array.sort(function (a, b) {
			a = parseFloat(a[attribute]);
			b = parseFloat(b[attribute]);

			if(reverse) return b - a;
			return a - b;
		});
		return array;
	}
});

filters.filter('filterObject', function () {
	return function (input, query) {
		if(!angular.isObject(input) || !angular.isObject(query)) return input;
		var result = [];

		angular.forEach(input, function (object) {
			var ok = true;
			for(attr in query) {
    			if(!query.hasOwnProperty(attr) || !(object.hasOwnProperty(attr) && parseFloat(object[attr]) === parseFloat(query[attr])))
					ok = false;
			}
			if(ok) result.push(object);
		});
		return result;
	};
});
