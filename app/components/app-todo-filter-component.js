angular.
    module('weddingPlanner').
    component('todoFilter', {
        templateUrl: 'templates/components/component-todo-filter.html',
        controller: function ( $scope, $rootScope ) {
            /* Domyślne sortowanie jest ustawione na Datę dodania (od najświeższych)
            * tj. "-timestamp", właściwość ta jest dynamicznie generowana przez server firebase i przypisana do każdej dodawanej notatki
            */
            $scope.$parent.$parent.propertyName = '-timestamp';
            $rootScope.actuallySelected = null;
            $rootScope.actuallySelectedLabelForToDoFilter = false;

            $scope.setOrderProperty = function ( propertyName, elementID, sortPropertyLabel, sortName ) {
                $scope.$parent.$parent.propertyName = propertyName;
                $rootScope.actuallySelectedToDoFilter = sortPropertyLabel + ": " + sortName;
                $rootScope.actuallySelected  = elementID;
            }


            /* Filtrowanie notatek
             * Przefiltrować można po:
             * - czasie dodania (domyślnie, notatki są posortowane od najnowszych do najstarszych), w tym:
             *  -- od najnowszych do nastarszych
             *  -- od najstarszych do najnowszych
             * - priorytecie (każda notatka posiada jeden z trzech dostępnych priorytetów)
             *  -- wysoki
             *  -- normalny (jest to domyślna opcja przy mechaniźmie obsługującym dodawanie notatki)
             *  -- niski
             * - tytuł (alfabetycznie)
             *  -- rosnąco ( a-z )
             *  -- malejąco ( z-a )
            */
            $scope.segmentsSorting = [
                {
                    "Czas dodania": [
                        {"sortName": "najnowsze", "sortProperty": "-timestamp", "sortPropertyLabel": "Czas dodania"},
                        {"sortName": "najstarsze", "sortProperty": "+timestamp", "sortPropertyLabel": "Czas dodania"}
                    ]
                }, {
                    "Priorytet": [
                        {"sortName": "wysoki", "sortProperty": "-noteStatus.value === 2", "sortPropertyLabel": "Priorytet"},
                        {"sortName": "normalny", "sortProperty": "-noteStatus.value === 1", "sortPropertyLabel": "Priorytet"},
                        {"sortName": "niski", "sortProperty": "-noteStatus.value === 0", "sortPropertyLabel": "Priorytet"}
                    ]
                }, {
                    "Tytuł (alfabetycznie)": [
                        {"sortName": "rosnąco", "sortProperty": "+noteTitle", "sortPropertyLabel": "Tytuł (alfabetycznie)"},
                        {"sortName": "malejąco", "sortProperty": "-noteTitle", "sortPropertyLabel": "Tytuł (alfabetycznie)"}
                    ]
                }
            ]

        }
    });
