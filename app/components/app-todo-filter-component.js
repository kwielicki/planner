angular.
    module('weddingPlanner').
    component('todoFilter', {
        templateUrl: 'templates/components/component-todo-filter.html',
        controller: function ( $scope ) {
            /* Domyślne sortowanie jest ustawione na Datę dodania (od najświeższych)
            *
            */
            $scope.$parent.propertyName = '-timestamp';
            $scope.selected = false;

            $scope.setOrderProperty = function ( propertyName, elementID ) {
                $scope.$parent.propertyName = propertyName;
                $scope.selected = elementID;
                console.log($scope.$parent);
                console.log($scope);
            }


            /* Filtrowanie notatek
             * Przefiltrować można po:
             * - czasie dodania (domyślnie, notatki są posortowane od najnowszych do najstarszych), w tym:
             *  -- od najnowszych do nastarszych
             *  -- od najstarszych do najnowszych
            */
            $scope.segmentsSorting = [
                {
                    "Czas dodania": [
                        {"sortName": "najnowsze", "sortProperty": "-timestamp"},
                        {"sortName": "najstarsze", "sortProperty": "+timestamp"}
                    ]
                }, {
                    "Priorytet": [
                        {"sortName": "wysoki", "sortProperty": "-noteStatus.value === 2"},
                        {"sortName": "normalny", "sortProperty": "-noteStatus.value === 1"},
                        {"sortName": "niski", "sortProperty": "-noteStatus.value === 0"}
                    ]
                }, {
                    "Tytuł (alfabetycznie)": [
                        {"sortName": "rosnąco", "sortProperty": "+noteTitle"},
                        {"sortName": "malejąco", "sortProperty": "-noteTitle"}
                    ]
                }
            ]

        }
    });
