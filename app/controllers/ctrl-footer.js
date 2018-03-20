/* Aktualna data renderująca się w komponencie footer */

angular
    .module('weddingPlanner')
    .controller('ctrlFooter', [ '$scope',  function ( $scope ) {
        $scope.data = new Date();
    }]);
