angular
    .module('weddingPlanner')
    .run(["$rootScope", "$location", function($rootScope, $location) {
        $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
            if (error === "AUTH_REQUIRED") {
                $location.path("/login");
            }
        });
        $rootScope.$on("$routeChangeSuccess", (_, current) => {
            document.title = current.$$route.title;
        });
    }])
	.controller("AuthorizationCtrl", ["currentAuth", function(currentAuth) {
        return currentAuth;
    }])
	.factory("Auth", ["$firebaseAuth",
        function($firebaseAuth) {
            return $firebaseAuth();
        }
    ]);
