weddingPlanner.controller("appEditGuest", function($scope, $firebaseArray, recordId, notify) {

    /* Referencja do tabeli znajdującej się w bazie danych */
    const ref = firebase.database().ref("list_of_guest");

    /* Tabela, zwracająca dane z bazy danych */
    $scope.persons = $firebaseArray(ref);


    /* Jeśli tabela zostanie w pełni odczytana,
     * wykonuję na niej metodę $getRecord a jako argument
     * podaję wartość ID, który został przekazany jako return
     * metody resolve w routingu
     */
    $scope.persons.$loaded()
        .then(function() {
            const currentEditableID = recordId.personID();
            const getCurrentRecord  = $scope.persons.$getRecord(currentEditableID);

            /* @param null
            * Jeśli getCurrentRecord zwraca null, znaczy to tyle, że w bazie nie ma
            * rekordu o ID do którego dajemy zapytanie
            */
            if (getCurrentRecord === null) {
                console.log('Brak recordu o ID "' + currentEditableID + '" w bazie danych.')
            } else {
                $scope.person = getCurrentRecord;
            }

            /* Metoda sendRecordToDataBase ma za zadanie zapisanie
             * zedytowanego rekordu do bazy danych
             */
            $scope.sendRecordToDataBase = function() {
                $scope.persons.$save(getCurrentRecord)
                .then(function(ref) {
                    notify({
                            messageTemplate: "\n    <div class=\"notification-header\">\n      <h4 class=\"notification-header__icon\"><i class=\"fa fa-check-circle nav__icon\" aria-hidden=\"true\"></i></h4>\n    </div>\n    <div class=\"notification-body\">\n      <h2 class=\"notification-body__title\"><span>Rekord zmodyfikowany!</span></h2>\n      <p class=\"notification-body__description\"> \n         <strong>" + getCurrentRecord.firstName + " " + getCurrentRecord.surName + "</strong>\n          Dane zostały zmodyfikowane.</p>\n    </div>\n ",
                            position: 'right',
                            classes: 'notification-success',
                            duration: 1500,
                            maximumOpen: 1
                          });
                    }, function(error) {
                        notify({
                            messageTemplate: "\n                      <div class=\"notification-header\">\n                        <h4 class=\"notification-header__icon\"><i class=\"fa fa-exclamation-circle nav__icon\" aria-hidden=\"true\"></i></h4>\n                      </div>\n                      <div class=\"notification-body\">\n                        <h2 class=\"notification-body__title\"><span>Oops... wyst\u0105pi\u0142 b\u0142\u0105d!</span></h2>\n                        <p class=\"notification-body__description\"> \n                           <strong>" + $scope.firstName + " " + $scope.surName + "</strong>\n                           Rekord nie zosta\u0142 dodany do systemu. Zweryfikuj poprawno\u015B\u0107 wprowadzonych danych.</p>\n                      </div>\n                    ",
                            position: 'right',
                            classes: 'notification-warning',
                            dration: 0,
                            maximumOpen: 1
                          });
                    });
            }
        })
});
