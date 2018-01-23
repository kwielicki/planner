/* Aktualna data renderująca się w komponencie footer */

weddingPlanner.controller('ctrlFooter', [ '$scope',  function ( $scope ) {
    $scope.data = new Date();
}]);
