var filters = angular.module('filters', []);

filters.filter('orderObjectByTotal', function () {
	return function (input, reverse) {
		if(!angular.isObject(input)) return input;

		var array = [];
		for(var objectKey in input) {
			array.push(input[objectKey]);
		}

		array.sort(function (a, b) {
			a = parseFloat(a['total']);
			b = parseFloat(b['total']);

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


filters.filter('filterObjectByDate', function() {
	return function (input, start, end) {
		if(!angular.isObject(input) || !angular.isObject(start) || !angular.isObject(end)) return input;
		var result = [];

		angular.forEach(input, function (object) {
			var ok = true;
			var endd = new Date(end).setDate(end.getDate() + 1);
			if(!object.hasOwnProperty('date') || new Date(object['date']) < start || new Date(object['date']) > endd) {
				ok = false;
			}
			if(ok) result.push(object);
		});
		return result;
	};
});