/*
 * Głowny kontroler aplikacji
 */
angular
    .module('weddingPlanner')
    .controller("ctrlAppMainFirebase", ["$scope", "Auth", '$rootScope', '$localStorage',
        function($scope, Auth, $rootScope, $localStorage) {


            // Planner states obiekt
            $rootScope.plannerGlobal = {};
            $rootScope.plannerGlobal = {
                'manageGuestCurrentSortingValue': null,
                'manageGuestCurrentSortingOrder': null
            };

            $scope.auth = Auth;
            // any time auth state changes, add the user data to scope
            $scope.auth.$onAuthStateChanged(function(firebaseUser) {
                $scope.firebaseUser = firebaseUser;
                /* Firebase standardowo zwraca null'a we właściwości firebaseUserDisplayName
                 * jednakże, można zrobić update. Jeśli taka operacja zostanie wykonana,
                *  w menusie pokazuję ten element
                */
                if ( firebaseUser !== null ) {
                    if ( firebaseUser.displayName !== null ) {
                        $scope.firebaseUserDisplayName = true;
                        // $scope.$apply();
                    }
                }

                // Do użytku globalnego
                $rootScope.firebaseUserGlobal = firebaseUser;

                // Informacja dotycząca przekazania do widoku odpowiedniej daty
                $scope.user = {
                    lastSuccessedLoginData: $localStorage.lastSuccessedLoginData
                };

            });

            // Ustawienie
            $scope.propertiesMenuCloses = "Otwórz menu";


        }
    ]);
