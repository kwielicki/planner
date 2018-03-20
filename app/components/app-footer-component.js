angular
    .module('weddingPlanner')
    .component('footerApp', {
        templateUrl: 'templates/components/component-footer.html',
        controller: function ( $scope, $rootScope ) {

            $rootScope.$watch('firebaseUserGlobal', function() {
                $scope.firebaseUserAuthenticated = $rootScope.firebaseUserGlobal;
            });

            $scope.date = new Date();

        }
    });
