var services = angular.module('services', ['ngResource']);

var url = '192.168.0.102';
services.factory('Categories', function ($resource) {
    return $resource('http://' + url + ':5000/api/categories', {});
});

services.factory('Category', function ($resource) {
    return $resource('http://' + url + ':5000/api/category', {}, {});
});

services.factory('Expenses', function ($resource) {
    return $resource('http://' + url + ':5000/api/expenses', {}, {});
});

services.factory('Expense', function ($resource) {
    return $resource('http://' + url + ':5000/api/expense', {}, {});
});
