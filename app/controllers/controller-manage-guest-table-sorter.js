angular
    .module('weddingPlanner')
    .controller('manageGuestTableSorting', [ '$scope', function ( $scope ) {
		$scope.sortingTableManagement = function (sortName, sortOrder, sortLabel) {
	      $scope.sortType = sortName;
	    };
    }]);
