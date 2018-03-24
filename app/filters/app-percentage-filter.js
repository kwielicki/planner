// This filter makes the assumption that the input will be in decimal form (i.e. 17% is 0.17).
angular
	.module('weddingPlanner')
	.filter('percentage', ['$filter', function ($filter) {
		return function (input, decimals) {
			return $filter('number')(input * 100, decimals) + '%';
		};
	}]);