// This filter makes the assumption that the input will be in decimal form (i.e. 17% is 0.17).
angular
	.module('weddingPlanner')
	.filter('charactersInCircle', ['$filter', function ($filter) {
		return function (wordValue) {
			const wordSplit = wordValue.split(" ");
			let wordFirstLetters = [];
			wordSplit.filter(function(singleWord) {
				wordFirstLetters.push(singleWord.charAt(0).toLowerCase());
			});
			return wordFirstLetters.join('');
		};
	}]);
