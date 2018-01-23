// Define the `weddingPlanner` main module
var weddingPlanner = angular.module('weddingPlanner',
  [
    "ngRoute",
    "firebase",
    "cgNotify",
    "vAccordion",
    "ngAnimate",
    "ui.bootstrap"
  ]);

// Navbar Controller
weddingPlanner.controller('MainNavCtrl', [ '$scope', '$location', function ( $scope, $location) {

    /* Występuje tutaj podział elementów w menu nawigacyjnym
     * 1 - globalNavigation {Panel głowny}
     * 2 - manage {Zarządzaj listą gości, Dodaj nowego gościa}
     * 3 - dataAnalyst {Statystyki}
     * 4 - documentation {dokumentacja}
     ***
     * Każda zmiana wiąże się z przebudową poniższego obiektu
     */
    $scope.menuItems = [
        {
            globalNavigation: {
                name: 'Panel główny',
                url: '/dashboard',
                title: 'Przejdź do panelu głównego'
            }
        },
        {
            manage: [
                {
                    name: 'Zarządzaj listą gości',
                    url:  '/manage-guests',
                    title: 'Zarządzaj listą gości'
                }, {
                    name:   'Dodaj nowego gościa',
                    url:    '/add-new-guest',
                    title:  'Dodaj nowego gościa'
                }
            ]
        },
        {
            dataAnalyst: {
                name:   'Statystyki',
                url:    '/statistics',
                title:  'Zapoznaj się ze statystykami'
            }
        },
        {
            documentation: {
                name:  'Dokumentacja',
                url:   '/documentation',
                title: 'Dokumentacja aplikacji Wedding Planner'
            }
        }
    ];

    /* Funkcja odpowiedzialna za dodanie klasy 'active' do anchora
     * w zależności od aktualnego routa
     */
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

        $(window).click(function() {
            if (anchorMenu.hasClass('is-active')) {
                anchorMenu.removeClass('is-active');
                $('.dropdown-menu--global').removeClass('is-open').fadeOut();
                anchorMenu.attr('title', dataTitle);
                anchorMenu.find('span').text(dataTitle)
            }
        });

        $('.nav__element').click(function(event){
            event.stopPropagation();
        });

    }

    // Obsługa logout

    $scope.logoutMenu = function() {
        var logoutMenu = $(".nav__anchor--logout");

        logoutMenu.toggleClass('is-active');
        $('.dropdown-menu--logout').toggleClass('is-open').fadeToggle();

        $(window).click(function() {
            if (logoutMenu.hasClass('is-active')) {
                logoutMenu.removeClass('is-active');
                $('.dropdown-menu--logout').removeClass('is-open').fadeOut();
            }
        });

        $('.nav__element, .dropdown-menu__element').click(function(event){
            event.stopPropagation();
        });


    }

    $scope.match = function() {
        location.reload();
        localStorage.removeItem("lastsucceslogin");
    }

}]);



// Table sorting
weddingPlanner.controller('mainController', function($scope) {
  $scope.sortType     = 'firstName'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.searchPerson   = '';     // set the default search/filter term
  $scope.printTable = function($scope) {
      var myTableArray = [];
      $('.table-management__body').find('.table-management__row').each(function() {
          var arrayOfThisRow = [];
          var tableData = $(this).find('div:eq(0), div:eq(1), div:eq(2), div:eq(3), div:eq(4), div:eq(5), div:eq(6), .pdf-maker--phone-number');
          if (tableData.length > 0) {
              tableData.each(function() { arrayOfThisRow.push($(this).text()); });
              myTableArray.push(arrayOfThisRow);
          }
      });
      var arrayJoin = myTableArray.join();
      var lp = [],
          firstName = [],
          surName = [],
          numberGust = [],
          children = [],
          membership = [],
          status = [],
          phoneNumber= [];
      for (var p in myTableArray) {
          lp.push(myTableArray[p][0]);
          firstName.push(myTableArray[p][1]);
          surName.push(myTableArray[p][2]);
          numberGust.push(myTableArray[p][3]);
          children.push(myTableArray[p][4]);
          membership.push(myTableArray[p][5]);
          status.push(myTableArray[p][6]);
          phoneNumber.push(myTableArray[p][7]);
      }

      var docDefinition = {
        pageOrientation: 'landscape',
        pageSize: 'A4',
        info: {
            title: "Wedding Planner - lista gości",
            author: "Administrator"
        },
        footer: function(currentPage, pageCount) {
            return {
                text: "Strona " + currentPage.toString() + ' z ' + pageCount,
                alignment: "center"
            }
        },
        content: [
            {
                stack: [
                    {text: "Tabela generyczna - Twoja lista gości", style: "tableHeader"},
                    {text: "- przedstawione wyniki uzależnione są od aktualnego ustawienia filtrowania", style: "tableSubheader"}
                ]
            },
            {
                table: {
                    widths: ["auto","auto","auto","auto","auto","auto", "auto", "auto"],
              body: [
                [
                  [{text: "L.P", style: "tHead"}, lp],
                  [{text: "Imię", style: "tHead"}, firstName],
                  [{text: "Nazwisko", style: "tHead"}, surName],
                  [{text: "Liczba gości", style: "tHead"}, numberGust],
                  [{text: "Dzieci", style: "tHead"}, children],
                  [{text: "Przynależność", style: "tHead"}, membership],
                  [{text: "Status", style: "tHead"}, status],
                  [{text: "Nr. telefonu", style: "tHead"}, phoneNumber]
                ]
              ]
            }
          }
      ],
      styles: {
          tableHeader: {
              bold: true,
              fontSize: 18,
              lineHeight: 1,
              margin: [0,0,0,5]
          },
          tableSubheader: {
              margin: [0,0,0,50],
              lineHeight: 1
          },
          tHead: {
              bold: true
          }
      },
      defaultStyle: {
          lineHeight: 2
      }
      };

        pdfMake.createPdf(docDefinition).print();

  }


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

weddingPlanner.controller('SampleCtrl', function($scope, $firebaseObject) {
    var ref = firebase.database().ref();
    $scope.person = $firebaseObject(ref);
});

//- Logika logowania do aplikacji
weddingPlanner.controller('userLogin', ['$scope', function($scope) {
    $scope.inputType = 'password';
    $scope.appSignIn = function() {
        const email    = $scope.email;
        const password = $scope.password;

        if ((email === undefined || email === '') && (password === undefined || password === '')) {
            const messageString = 'Podano niekompletne dane';
            document.getElementById('error-message').innerHTML = messageString;
        }

        //- Firebase nie przeprowadza walidacji adresu email
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(firebaseUser) {
                if (typeof(Storage) !== "undefined") {
                    const dateLoginIn = new Date(),
                          dateStringTime = dateLoginIn.toDateString(),
                          dataLocalTime  = dateLoginIn.toLocaleTimeString();
                    if (!localStorage.getItem('lastsucceslogin')) {
                        localStorage.setItem("lastsucceslogin", dateStringTime + ', ' + dataLocalTime);
                    }
                    document.getElementById('last-success-login').innerHTML = localStorage.getItem('lastsucceslogin');
                }
            })
            .catch(function(error) {
                /* Obsługa błędów mogących występować podczas próby logowania */
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                    const messageString = 'Podane hasło jest błędne';
                    document.getElementById('error-message').innerHTML = messageString;
                }

                if (errorCode === 'auth/user-not-found') {
                    const messageString = 'Login, który podałeś nie istnieje';
                    document.getElementById('error-message').innerHTML = messageString;
                }

                if (errorCode === 'auth/invalid-email') {
                    const messageString = 'Wprowadź poprawny adres e-mail';
                    document.getElementById('error-message').innerHTML = messageString;
                }

                if (errorCode === 'auth/argument-error') {
                    const messageString = 'Podałeś niekompletne dane';
                    document.getElementById('error-message').innerHTML = messageString;
                }

            });

    };

    //- Pokazanie / ukrywanie hasła
    $scope.passwordHelper = function(eventName) {
        if ($scope.inputType === 'password') {
            $scope.inputType = 'text';
        } else if ($scope.inputType === 'text'){
            $scope.inputType = 'password';
        }
    }

}]);

weddingPlanner.controller("SampleCtrl", ["$scope", "Auth",
  function($scope, Auth) {
    $scope.auth = Auth;
    // any time auth state changes, add the user data to scope
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });
    document.getElementById('last-success-login').innerHTML = localStorage.getItem('lastsucceslogin');
  }
]);
