/* angularjs 1.6.0 (latest now) routes not working
 * Błąd podczas migracji na wersję angulara 1.6.0
 * @TODO: być może da się to zaimplementować w lepszy sposób
 */
angular
    .module('weddingPlanner')
    .config(['$locationProvider', function($locationProvider) {
        $locationProvider.hashPrefix('');
    }]);

// Konfiguracja routingu dla aplikacji
angular
    .module('weddingPlanner')
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/dashboard.html',
                controller: 'AuthorizationCtrl',
                title: 'Panel Głowny | Wedding Planner',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/dashboard', {
                redirectTo: '/dashboard',
                templateUrl: 'templates/dashboard.html',
                controller: "AuthorizationCtrl",
                title: 'Panel Głowny | Wedding Planner',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/manage-guests', {
                templateUrl: 'templates/manage-guests.html',
                controller: "AuthorizationCtrl",
                title: 'Zarządzaj listą gości | Wedding Planner',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/add-new-guest', {
                templateUrl: 'templates/add-new-guest.html',
                controller: "AuthorizationCtrl",
                title: 'Dodaj nowego gościa | Wedding Planner',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/user-profile', {
                templateUrl: 'templates/user-profile.html',
                controller: "AuthorizationCtrl",
                title: 'Profil użytkownika | Wedding Planner',
                resolve: {
                    "currentAuth": ["Auth", function(Auth) {
                        return Auth.$requireSignIn();
                    }]
                }
            }).when('/edit-guest/:personID', {
                templateUrl: 'templates/edit-guest.html',
                controller: 'appEditGuest',
                title: 'Edycja gościa | Wedding Planner',
                resolve: {
                    "recordId": ['$route', function($route) {
                        return {
                            personID: function() {
                                /* @TODO Być może da się to zaimplementować
                                 * w bardziej wydajny sposób. Aktualnie wykorzystuje
                                 * obiekt $route, z którego pobieram wartość parametru
                                 * i przekazuje go do controllera appEditGuest
                                 */
                                return $route.current.params.personID;

                            }
                        }
                    }],
                    "currentAuth": ["Auth", function(Auth) {
                      return Auth.$requireSignIn();
                    }]
                }
            }).when('/wedding-notebook', {
                templateUrl: 'templates/wedding-notebook.html',
                controller: "AuthorizationCtrl",
                title: 'Notatnik weselne | Wedding Planner',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/statistics', {
                templateUrl: 'templates/statistics.html',
                controller: "AuthorizationCtrl",
                title: 'Statystyki | Wedding Planner',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/login', {
                templateUrl: 'templates/login.html',
                title: 'Logowanie | Wedding Planner',
            }).when('/documentation', {
                templateUrl: 'templates/documentation.html',
                controller: "AuthorizationCtrl",
                title: 'Dokumentacja | Wedding Planner',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).otherwise({
                redirectTo: '/404',
                templateUrl: 'templates/404.html',
                title: 'Strona nie została odnaleziona | Wedding Planner',
                controller: "AuthorizationCtrl",
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            });
});

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
    }]);

/* Kontroler autoryzacji */
angular
    .module('weddingPlanner')
    .controller("AuthorizationCtrl", ["currentAuth", function(currentAuth) {
        return currentAuth;
    }]);

angular
    .module('weddingPlanner')
    .factory("Auth", ["$firebaseAuth",
        function($firebaseAuth) {
            return $firebaseAuth();
        }
    ]);
