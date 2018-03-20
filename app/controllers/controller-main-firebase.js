/*
 * Głowny kontroler aplikacji
 */
angular
    .module('weddingPlanner')
    .controller("ctrlAppMainFirebase", ["$scope", "Auth", '$rootScope',
        function($scope, Auth, $rootScope) {
            $scope.auth = Auth;
            // any time auth state changes, add the user data to scope
            $scope.auth.$onAuthStateChanged(function(firebaseUser) {
              $scope.firebaseUser = firebaseUser;

              // Do użytku globalnego
              $rootScope.firebaseUserGlobal = firebaseUser;

            });
            document.getElementById('last-success-login').innerHTML = localStorage.getItem('lastsucceslogin');
        }
    ]);
