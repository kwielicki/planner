// This filter makes the assumption that the input will be in decimal form (i.e. 17% is 0.17).
angular
	.module('weddingPlanner')
	.filter('objLength', ['$filter', function ($filter) {
		return function (objectName) {
			var count = 0;
			for(var prop in objectName) {
				count++;
			}
			return count;
		};
	}]);
