angular
    .module('weddingPlanner').filter('offset', function() {
              return function(input, start) {
                start = parseInt(start, 10);
                return input.slice(start);
              };
            });

angular
    .module('weddingPlanner')
    .controller("addNewGuest", function($scope, $firebaseArray, notify, Auth, $rootScope, $location, $anchorScroll) {

        /*
         * Paginacja
         * - currentPage -> paginacja działa od 1 strony
         * - itemsPerPage -> liczba elementów wyświetlana na 1 stronie paginacji
         * - maxSize -> ustawione na 0, aby ukryć listę z poszczególnymi stronami paginacji
         */
        $scope.currentPage = 1;
        $scope.itemPerPage = 5;
        $scope.label = $scope.itemPerPage;
        $scope.maxSize = 0;
        $scope.start = 0;

        /* Przygotowanie dropdownu, który umożliwia użytkownikowi zmianę ilości
         * wyświetlanych elementów per strona paginacji
         */
        $rootScope.$watch('numberOfTotalPersons', function() {
            $scope.numberOfTotalPersons = $rootScope.numberOfTotalPersons;
            if ( $scope.numberOfTotalPersons !== undefined ) {

                var arry = [];

                for (var i = $scope.itemPerPage; i < $scope.numberOfTotalPersons; i+=$scope.itemPerPage) {
                    arry.push({'itemsPerPage': i})
                }

                arry.push({'itemsPerPage': $scope.numberOfTotalPersons});
                $scope.elements = arry;

            }
        });
        $scope.pageChanged = function() {
            $scope.start = ($scope.currentPage - 1) * $scope.itemPerPage;

        };
        $scope.clickedEl = function(number) {
            $scope.itemPerPage = number.itemsPerPage;
            $scope.label = number.itemsPerPage;
        }

        var ref = firebase.database().ref().child("list_of_guest"),
            d = new Date(),
            days = ["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"];

        /* Zbiór funkcji, które odpowiadają za formatowanie daty,
        * która jest przekazywana do modelu bazy danych.
        */
        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        function dateFormat() {
          var d = new Date();
          var x = document.getElementById("demo");
          var h = addZero(d.getHours());
          var m = addZero(d.getMinutes());
          var s = addZero(d.getSeconds());
          return h + ":" + m + ":" + s;
        }

        /* Metoda tableManagementDetails służy do pokazania
         * informacji dodatkowych znajdujących się w tableManagementDetails
         */
        $scope.tableManagementDetails = function( event ) {
            var $this = $(event.currentTarget);
            $this.addClass('ng-cloak');
            $this.next().slideDown();
        }

        /* Metoda tableManagementHideDetails służy do ukrywania
         * informacji dodatkowych znajdujących się w tableManagementDetails
         */
        $scope.tableManagementHideDetails = function( event ) {
            var $this = $(event.currentTarget);
            $this.parent().slideUp(400, function() {
                $this.parents('.table-management__row ').find('.table-management__row-details').removeClass('ng-cloak');
            });
        }

        //- Synchronizujemy obiekt person z tablica firebase
            $scope.persons = $firebaseArray(ref);

        /* Funkcja odpowiadająca za dodanie nowej osoby do bazy danych
        * Dodajemy do bazy takie dane jak:
        * -- fullName w skład którego wchodzą firstName oraz surName
        * -- guestCount odpowiadający za przechowywanie liczby gości
        * -- dataAddeded odpowiadający za przechowywanie datę dodania oraz ew. modyfikacji
        * -- membership odpowiadający za przechowywanie przynależnosci grupowej (pan/pani)
        * -- status odpowiadający za przechowywanie statusu
        * -- phoneNumber odpowiadający za przechowywanie numeru telefonu
        */

        $scope.persons.$loaded()
            .then(function() {
                $scope.dbLoaded = true;
            });

      $scope.addNewPerson = function() {
        $scope.persons.$add({
          firstName: $scope.firstName,
          surName: $scope.surName,
          guestCount: parseInt($scope.guestCount, 10),
          children: ($scope.children !== undefined) ? parseInt($scope.children, 10) : 0,
          dataAdded: d.getDate() + '-' + ('0'+(d.getMonth()+1)).slice(-2) + '-' + d.getUTCFullYear() + ',' + dateFormat(),
          membership: $scope.membership,
          status: $scope.status,
          creator: $scope.auth.$getAuth().email,
          phoneNumber: ($scope.phoneNumber !== undefined) ? parseInt($scope.phoneNumber, 10) : '-',
          extraInformation: ($scope.extraInformation !== undefined) ? $scope.extraInformation: 'brak'
        }).then(function(ref) {
            notify({
                    messageTemplate: "\n    <div class=\"notification-header\">\n      <h4 class=\"notification-header__icon\"><i class=\"fa fa-check-circle nav__icon\" aria-hidden=\"true\"></i></h4>\n    </div>\n    <div class=\"notification-body\">\n      <h2 class=\"notification-body__title\"><span>Powodzenie!</span></h2>\n      <p class=\"notification-body__description\"> \n         <strong>" + $scope.firstName + " " + $scope.surName + "</strong>\n         Rekord zosta\u0142 dodany do systemu. Dane zosta\u0142y wprowadzone w spos\xF3b prawid\u0142owy.</p>\n    </div>\n ",
                    position: 'right',
                    classes: 'notification-success',
                    duration: 0
                  });
                $scope.formAddNewGuest.$setPristine();
                $scope.formAddNewGuest.$setUntouched();
            }, function(error) {
                notify({
                    messageTemplate: "\n                      <div class=\"notification-header\">\n                        <h4 class=\"notification-header__icon\"><i class=\"fa fa-exclamation-circle nav__icon\" aria-hidden=\"true\"></i></h4>\n                      </div>\n                      <div class=\"notification-body\">\n                        <h2 class=\"notification-body__title\"><span>Oops... wyst\u0105pi\u0142 b\u0142\u0105d!</span></h2>\n                        <p class=\"notification-body__description\"> \n                           <strong>" + $scope.firstName + " " + $scope.surName + "</strong>\n                           Rekord nie zosta\u0142 dodany do systemu. Zweryfikuj poprawno\u015B\u0107 wprowadzonych danych.</p>\n                      </div>\n                    ",
                    position: 'right',
                    classes: 'notification-warning',
                    dration: 0
                  });
            });

      };

      /* Logika dotycząca pobrania informacji niezbędnych do przeprowadzenia analizy statystycznej */

    var arrayFullGuestNumber = [],
        arrayFullGuestNumberStatusConfirmed = [],
        arrayFullGuestNumberStatusUnconfirmed = [],
        arrayFullGuestNumberStatusDeclined = [];

    var arrayFullChildrenNumber = [],
        arrayWomenChildrenNumber = [],
        arrayManChildrenNumber = [];

    var arrayFullGuestNumberWomen = [],
        arrayFullGuestNumberStatusConfirmedWomen = [],
        arrayFullGuestNumberStatusUnconfirmedWomen = [],
        arrayFullGuestNumberStatusDeclinedWomen = [];

    var arrayFullGuestNumberMan = [],
        arrayFullGuestNumberStatusConfirmedMan = [],
        arrayFullGuestNumberStatusUnconfirmedMan = [],
        arrayFullGuestNumberStatusDeclinedMan = [];

    function getSum(total, num) {
        return total + num;
    }

    function myFunction(item, arrayName) {
        item.text(arrayName.reduce(getSum));
    }

    ref.once('value', function(snapshot) {

        // Liczba wszystkich rekordów
        $rootScope.numberOfTotalPersons = snapshot.numChildren();

      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();


          /*
           * Logika odpowiedzialna za "Liczbę gości"
           * 1 - wszystkich
           * 2 - potwierdzonych
           * 3 - oczekujących
           * 4 - z odmową
           */

            var fullGuestNumbers = parseInt(childData.guestCount, 10);
            //- 1 Liczba wszystkich gości
              arrayFullGuestNumber.push(fullGuestNumbers);
              myFunction($('.statistics__global__numberOfGuest'), arrayFullGuestNumber);

            //- 2,3,4 Liczba gości potwierdzonych / oczekujących / z odmową
              switch (childData.status) {
                case "Potwierdzony":
                  arrayFullGuestNumberStatusConfirmed.push(fullGuestNumbers);
                  myFunction($('.statistics__global__numberOfGuestConfirmed'), arrayFullGuestNumberStatusConfirmed);
                  break;
                case "Oczekujący":
                  arrayFullGuestNumberStatusUnconfirmed.push(fullGuestNumbers);
                  myFunction($('.statistics__global__numberOfGuestUnconfirmed'), arrayFullGuestNumberStatusUnconfirmed);
                  break;
                case "Odmowa":
                  arrayFullGuestNumberStatusDeclined.push(fullGuestNumbers);
                  myFunction($('.statistics__global__numberOfGuestDeclined'), arrayFullGuestNumberStatusDeclined);
                  break;
              }

          /*
           * Logika odpowiedzialna za "Liczbę dzieci"
           * 1 - wszystkich
           * 2 - ze strony Pani Młodej
           * 3 - ze strony Pana Młodego
           */

            var fullChildrenNumbers = parseInt(childData.children, 10);

            //- 2,3 Liczba dzici (od strony pani Młodej, pana Młodego)
              switch (childData.membership) {
                case "Pani Młoda":
                  arrayWomenChildrenNumber.push(fullChildrenNumbers);
                  myFunction($('.statistics__global__numberOfChildrenWomen'), arrayWomenChildrenNumber);
                  break;
                case "Pan Młody":
                  arrayManChildrenNumber.push(fullChildrenNumbers);
                  myFunction($('.statistics__global__numberOfChildrenMan'), arrayManChildrenNumber);
                  break;
                default:

              }

            //- 1 Łączna liczba dzieci
              arrayFullChildrenNumber.push(fullChildrenNumbers);
              myFunction($('.statistics__global__numberOfChildren'), arrayFullChildrenNumber);

           /*
           * Logika odpowiedzialna za liczbę gości ze strony Pani Młodej oraz Pana Młodego
           * 1 - wszystkich
           * 2 - potwierdzonych
           * 3 - oczekujących
           * 4 - z odmową
           */

          switch (childData.membership) {
            case "Pani Młoda":
              arrayFullGuestNumberWomen.push(fullGuestNumbers);
              myFunction($('.statistics__global__numberOfGuestWomen'), arrayFullGuestNumberWomen);
              switch (childData.status) {
                case "Potwierdzony":
                  arrayFullGuestNumberStatusConfirmedWomen.push(fullGuestNumbers);
                  myFunction($('.statistics__global__numberOfGuestConfirmedWomen'), arrayFullGuestNumberStatusConfirmedWomen);
                  break;
                case "Oczekujący":
                  arrayFullGuestNumberStatusUnconfirmedWomen.push(fullGuestNumbers);
                  myFunction($('.statistics__global__numberOfGuestUnconfirmedWomen'), arrayFullGuestNumberStatusUnconfirmedWomen);
                  break;
                case "Odmowa":
                  arrayFullGuestNumberStatusDeclinedWomen.push(fullGuestNumbers);
                  myFunction($('.statistics__global__numberOfGuestDeclinedWomen'), arrayFullGuestNumberStatusDeclinedWomen);
                  break;
              }
              break;
            case "Pan Młody":
              arrayFullGuestNumberMan.push(fullGuestNumbers);
              myFunction($('.statistics__global__numberOfGuestMan'), arrayFullGuestNumberMan);
              switch (childData.status) {
                case "Potwierdzony":
                  arrayFullGuestNumberStatusConfirmedMan.push(fullGuestNumbers);
                  myFunction($('.statistics__global__numberOfGuestConfirmedMan'), arrayFullGuestNumberStatusConfirmedMan);
                  break;
                case "Oczekujący":
                  arrayFullGuestNumberStatusUnconfirmedMan.push(fullGuestNumbers);
                  myFunction($('.statistics__global__numberOfGuestUnconfirmedMan'), arrayFullGuestNumberStatusUnconfirmedMan);
                  break;
                case "Odmowa":
                  arrayFullGuestNumberStatusDeclinedMan.push(fullGuestNumbers);
                  myFunction($('.statistics__global__numberOfGuestDeclinedMan'), arrayFullGuestNumberStatusDeclinedMan);
                  break;
              }
              break;
          }

      });
    });

    });
