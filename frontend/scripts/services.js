var services = angular.module('services', ['ngResource']);

services.factory('Categories', function ($resource) {
    return $resource('http://192.168.0.102:5000/api/categories', {});
});

services.factory('Category', function ($resource) {
    return $resource('http://192.168.0.102:5000/api/category', {}, {});
});