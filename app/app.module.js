// Define the `phonecatApp` module
var weddingPlanner = angular.module('weddingPlanner', ["ngRoute", "firebase"]);


// Navbar Controller
weddingPlanner.controller('MainNavCtrl', [ '$scope', '$location', function ( $scope, $location) {
    $scope.menuItems = [
        {
            name: 'Panel główny',
            url:  '/dashboard',
            title: 'Welcome to our Website'
        },
        {
            name: 'Zarządzaj listą gości',
            url:  '/manage-guests',
            title: 'Zarządzaj listą gości'
        },
        {
            name:   'Dodaj nowego gościa',
            url:    '/add-new-guest',
            title:  'Dodaj nowego gościa'
        },
        {
            name:   'Statystyki',
            url:    '/statistics',
            title:  'Zapoznaj się ze statystykami'
        },
        {
            name:  'Dokumentacja',
            url:   '/statistics',
            title: 'Dokumentacja aplikacji Wedding Planner'
        }
    ];

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    // Obsługa menu
    $scope.openMenu = function() {

        var anchorMenu = $('.nav__anchor--menu'),
            dataTitle  = anchorMenu.attr('data-title-open'),
            dataTitleClosed = anchorMenu.attr('data-title-closed');

        anchorMenu.toggleClass('is-active');
        $('.dropdown-menu--global').toggleClass('is-open').fadeToggle();

        if (anchorMenu.hasClass('is-active')) {
            anchorMenu.attr('title', dataTitleClosed);
            anchorMenu.find('span').text(dataTitleClosed);


        } else {
            anchorMenu.attr('title', dataTitle);
            anchorMenu.find('span').text(dataTitle);
        }

    }

    // Obsługa logout

    $scope.logoutMenu = function() {
        var logoutMenu = $(".nav__anchor--logout");

        logoutMenu.toggleClass('is-active');
        $('.dropdown-menu--logout').toggleClass('is-open').fadeToggle();
    }

    $scope.match = function() {
        location.reload();
    }

}]);



// Table sorting
weddingPlanner.controller('mainController', function($scope) {
  $scope.sortType     = 'firstName'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.searchPerson   = '';     // set the default search/filter term
});

weddingPlanner.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
   };
});


//============================================= FIREBASE ==============================================//

var config = {
    apiKey: "AIzaSyAJ8OiSlR_JD4cROJCGPV6ImPqTOYGlq9A",
    authDomain: "fir-m-wedding-planner.firebaseapp.com",
    databaseURL: "https://fir-m-wedding-planner.firebaseio.com",
    projectId: "fir-m-wedding-planner",
    storageBucket: "fir-m-wedding-planner.appspot.com",
    messagingSenderId: "968890916439"
};

firebase.initializeApp(config);

weddingPlanner.controller('SampleCtrl', function($scope, $firebaseObject) {
    var ref = firebase.database().ref();
    $scope.person = $firebaseObject(ref);
});

weddingPlanner.controller("SampleCtrl", ["$scope", "Auth",
  function($scope, Auth) {
    $scope.auth = Auth;
    // any time auth state changes, add the user data to scope
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });
  }
]);
