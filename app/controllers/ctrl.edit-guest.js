weddingPlanner.controller("appEditGuest", function($scope, $firebaseArray, recordId) {

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

        })
});
