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
                templateUrl: 'templates/views/dashboard.html',
                controller: 'AuthorizationCtrl',
                title: 'Panel Głowny | Wedding Planner',
                description: 'Administruj',
                breadcrumbsTitle: 'Panel Głowny',
                availableForCustomUserMenu: false,
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/dashboard', {
                redirectTo: '/dashboard',
                templateUrl: 'templates/views/dashboard.html',
                controller: "AuthorizationCtrl",
                title: 'Panel Głowny | Wedding Planner',
                description: 'Administruj',
                breadcrumbsTitle: 'Panel Głowny',
                availableForCustomUserMenu: true,
                quickLinksIcon: 'fas fa-home',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/manage-guests', {
                templateUrl: 'templates/views/manage-guests.html',
                controller: "AuthorizationCtrl",
                title: 'Twoja lista gości | Wedding Planner',
                description: 'Zarządzaj',
                breadcrumbsTitle: 'Twoja lista gości',
                availableForCustomUserMenu: true,
                quickLinksIcon: 'fas fa-tasks',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/add-new-guest', {
                templateUrl: 'templates/views/add-new-guest.html',
                controller: "AuthorizationCtrl",
                title: 'Dodawanie nowego gościa | Wedding Planner',
                description: 'Dodaj',
                breadcrumbsTitle: 'Dodawanie nowego gościa',
                availableForCustomUserMenu: true,
                quickLinksIcon: 'fas fa-address-card',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/user-profile', {
                templateUrl: 'templates/views/user-profile.html',
                controller: "AuthorizationCtrl",
                title: 'Profil użytkownika | Wedding Planner',
                description: 'Zarządzaj',
                breadcrumbsTitle: 'Profil użytkownika',
                availableForCustomUserMenu: true,
                quickLinksIcon: 'fas fa-user-alt',
                resolve: {
                    "currentAuth": ["Auth", function(Auth) {
                        return Auth.$requireSignIn();
                    }]
                }
            }).when('/edit-guest/:personID', {
                templateUrl: 'templates/views/edit-guest.html',
                title: 'Edycja gościa | Wedding Planner',
                controller: "AuthorizationCtrl",
                breadcrumbsTitle: 'Edycja gościa',
                availableForCustomUserMenu: false,
                quickLinksIcon: 'fas fa-book',
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
                templateUrl: 'templates/views/wedding-notebook.html',
                controller: "AuthorizationCtrl",
                title: 'Notatnik weselny | Wedding Planner',
                description: 'Notuj',
                breadcrumbsTitle: 'Notatnik weselny',
                availableForCustomUserMenu: true,
                quickLinksIcon: 'fas fa-book-open',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/statistics', {
                templateUrl: 'templates/views/statistics.html',
                controller: "AuthorizationCtrl",
                title: 'Statystyki | Wedding Planner',
                description: 'Analizuj',
                breadcrumbsTitle: 'Statystyki',
                availableForCustomUserMenu: true,
                quickLinksIcon: 'fas fa-signal',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/todo-list', {
                templateUrl: 'templates/views/todo-list.html',
                controller: "AuthorizationCtrl",
                title: 'Lista rzeczy do zrobienia | Wedding Planner',
                breadcrumbsTitle: 'Lista rzeczy do zrobienia',
                description: 'Notuj',
                availableForCustomUserMenu: true,
                quickLinksIcon: 'fas fa-list-ol',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/login', {
                templateUrl: 'templates/views/login.html',
                title: 'Logowanie | Wedding Planner',
                availableForCustomUserMenu: false
            }).when('/documentation', {
                templateUrl: 'templates/views/documentation.html',
                controller: "AuthorizationCtrl",
                title: 'Dokumentacja | Wedding Planner',
                description: 'Czytaj',
                breadcrumbsTitle: 'Dokumentacja',
                availableForCustomUserMenu: true,
                quickLinksIcon: 'fas fa-file-alt',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/news', {
                templateUrl: 'templates/views/news.html',
                controller: "AuthorizationCtrl",
                title: 'Nowinki ze świata | Wedding Planner',
                description: 'Sprawdź',
                breadcrumbsTitle: 'Aktualności',
                availableForCustomUserMenu: true,
                quickLinksIcon: 'fas fa-newspaper',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/wedding-organizer', {
                templateUrl: 'templates/views/planner.html',
                controller: "AuthorizationCtrl",
                title: 'Organizer weselny | Wedding Planner',
                description: 'Kategoryzuj',
                breadcrumbsTitle: 'Organizer weselny',
                availableForCustomUserMenu: true,
                quickLinksIcon: 'fas fa-pen-alt',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/user-profile/quick-links-management', {
                templateUrl: 'templates/views/quick-links-management.html',
                controller: "AuthorizationCtrl",
                title: 'Zarządzaj szybkimi linkami | Wedding Planner',
                description: 'Zarządzaj',
                breadcrumbsTitle: 'Szybkie linki',
                availableForCustomUserMenu: true,
                quickLinksIcon: 'fas fa-link',
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).when('/user-profile/wedding-planner-google-drive-integration', {
                templateUrl: 'templates/views/wedding-planner-google-drive-integration.html',
                controller: "AuthorizationCtrl",
                title: 'Konfiguruj dostęp do Google Drive | Wedding Planner',
                breadcrumbsTitle: 'Integracja z Google Drive',
                availableForCustomUserMenu: false,
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            }).otherwise({
                redirectTo: '/404',
                templateUrl: 'templates/views/404.html',
                title: 'Strona nie została odnaleziona | Wedding Planner',
                breadcrumbsTitle: '404',
                availableForCustomUserMenu: false,
                controller: "AuthorizationCtrl",
                resolve: {
                  "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                  }]
                }
            });
});
