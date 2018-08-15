// Navbar Controller
angular
    .module('weddingPlanner')
    .controller('MainNavCtrl', [ '$scope', '$location', '$rootScope', function ( $scope, $location, $rootScope) {
    /* Występuje tutaj podział elementów w menu nawigacyjnym
     * 1 - globalNavigation {Panel głowny}
     * 2 - manage {Zarządzaj listą gości, Dodaj nowego gościa}
     * 3 - dataAnalyst {Statystyki}
     * 4 - documentation {dokumentacja}
     ***
     * Każda zmiana wiąże się z przebudową poniższego obiektu
     */

     /* Obsługa dropdown menu w nawigacji */
     $scope.propertiesMenuCloses = "Otwórz menu";
     $scope.toggled = function (open) {
        /* open to typ boolean
         * - zwraca true, gdy menu jest otworzone
         * - zwraca false, gdy menu jest zamknięte
         */
        if ( open === true ) {
            $scope.propertiesMenuCloses = "Zamknij menu";
        } else {
            $scope.propertiesMenuCloses = "Otwórz menu";
        }
     }

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
                },{
                    name:   'Dodaj nowego gościa',
                    url:    '/add-new-guest',
                    title:  'Dodaj nowego gościa'
                },{
                    name:   'Organizer weselny',
                    url:    '/wedding-organizer',
                    title:  'Organizer weselny'
                },{
                    name: 'Notatnik weselny',
                    url:  '/wedding-notebook',
                    title:'Notatnik weselny'
                },{
                    name: 'Lista rzeczy do zrobienia',
                    url:  '/todo-list',
                    title:'Lista rzeczy do zrobienia'
                },{
                    name: 'Zarządzaj wydatkami',
                    url:  '/manage-expenses',
                    title:'Zarządzaj wydatkami',
                    specialClass: 'not--available'
                },{
                    name:  'Aktualności',
                    url:   '/news',
                    title: 'Najświeższe informacje ze świata oraz z Polski'
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
}]);



// Table sorting
angular
    .module('weddingPlanner')
    .controller('mainController', function($scope, $rootScope) {


    if ( $rootScope.plannerGlobal.manageGuestCurrentSortingOrder !== null ) {
        $scope.sortType = $rootScope.plannerGlobal.manageGuestCurrentSortingValue;
    }

  $scope.sortingTableManagement = function (sortName, sortOrder, sortLabel) {
    $scope.sortType = sortName;

    if ( sortOrder === true ) {
        $rootScope.plannerGlobal.manageGuestCurrentSortingOrder = 'malejący';
    } else {
        $rootScope.plannerGlobal.manageGuestCurrentSortingOrder = 'rosnący';
    }

    $rootScope.plannerGlobal.manageGuestCurrentSortingValue = sortName;
    $rootScope.plannerGlobal.manageGuestCurrentSortingLabel = sortLabel;
  };

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
