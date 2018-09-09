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
