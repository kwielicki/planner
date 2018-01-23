/* angularjs 1.6.0 (latest now) routes not working
 * Błąd podczas migracji na wersję angulara 1.6.0
 * TODO: być może da się to
 */
weddingPlanner.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

// Konfiguracja routingu dla aplikacji
weddingPlanner.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/dashboard.html'
        }).when('/dashboard', {
            redirectTo: '/dashboard',
            templateUrl: 'templates/dashboard.html'
        }).when('/manage-guests', {
            templateUrl: 'templates/manage-guests.html'
        }).when('/add-new-guest', {
            templateUrl: 'templates/add-new-guest.html'
        }).when('/edit-guest/:personID', {
            templateUrl: 'templates/edit-guest.html',
            controller: 'appEditGuest',
            resolve: {
                "recordId": ['$route', function($route) {
                    return {
                        personID: function() {
                            /* @TODO Być może da się to zaimplementować
                             * w bardziej wydajny sposób. Aktualnie wykorzystuje
                             * obiekt $route, z którego pobieram wartość parametru
                             * i przekazuje go do controllera appEditGuest
                             */
                            const paramsValue = $route.current.params.personID;
                            return paramsValue;
                        }
                    }
                }]
            }
        }).when('/statistics', {
            templateUrl: 'templates/statistics.html'
        }).when('/login', {
            templateUrl: 'templates/login.html'
        }).when('/documentation', {
            templateUrl: 'templates/documentation.html'
        }).otherwise({
            redirectTo: '/404',
            templateUrl: 'templates/404.html'
        })
});

weddingPlanner.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/login");
    }
  });
}]);

weddingPlanner.config(["$routeProvider", function($routeProvider) {
  $routeProvider.when("/dashboard", {
    // the rest is the same for ui-router and ngRoute...
    controller: "AccountCtrl",
    templateUrl: "templates/dashboard.html",
    resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $routeChangeError (see above)
        return Auth.$requireSignIn();
      }]
    }
  }).when("/manage-guests", {
    // the rest is the same for ui-router and ngRoute...
    controller: "AccountCtrl",
    templateUrl: "templates/manage-guests.html",
    resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $routeChangeError (see above)
        return Auth.$requireSignIn();
      }]
    }
  }).when("/add-new-guest", {
    // the rest is the same for ui-router and ngRoute...
    controller: "AccountCtrl",
    templateUrl: "templates/add-new-guest.html",
    resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $routeChangeError (see above)
        return Auth.$requireSignIn();
      }]
    }
}).when('/edit-guest', {
    // the rest is the same for ui-router and ngRoute...
    controller: "AccountCtrl",
    templateUrl: "templates/edit-guest.html",
    resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $routeChangeError (see above)
        return Auth.$requireSignIn();
      }]
    }
}).when("/404", {
    // the rest is the same for ui-router and ngRoute...
    controller: "AccountCtrl",
    templateUrl: "templates/404.html",
    resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $routeChangeError (see above)
        return Auth.$requireSignIn();
      }]
    }
  }).when("/documentation", {
    // the rest is the same for ui-router and ngRoute...
    controller: "AccountCtrl",
    templateUrl: "templates/documentation.html",
    resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $routeChangeError (see above)
        return Auth.$requireSignIn();
      }]
    }
  }).when("/statistics", {
    // the rest is the same for ui-router and ngRoute...
    controller: "AccountCtrl",
    templateUrl: "templates/statistics.html",
    resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $routeChangeError (see above)
        return Auth.$requireSignIn();
      }]
    }
  }).when("/", {
    // the rest is the same for ui-router and ngRoute...
    controller: "AccountCtrl",
    templateUrl: "templates/dashboard.html",
    resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $routeChangeError (see above)
        return Auth.$requireSignIn();
      }]
    }
  });
}]);

weddingPlanner.controller("HomeCtrl", ["currentAuth", function(currentAuth) {
  // currentAuth (provided by resolve) will contain the
  // authenticated user or null if not signed in
}]);

weddingPlanner.controller("AccountCtrl", ["currentAuth", function(currentAuth) {
  // currentAuth (provided by resolve) will contain the
  // authenticated user or throw a $routeChangeError (see above) if not signed in
}]);

weddingPlanner.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);
