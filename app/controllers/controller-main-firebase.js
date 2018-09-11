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

        }
    ]);
