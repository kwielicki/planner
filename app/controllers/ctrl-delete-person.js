weddingPlanner.controller('ctrlDeletePerson', [ '$scope', '$firebaseArray',  function ( $scope, $firebaseArray ) {
    const ref = firebase.database().ref().child("list_of_guest");
    $scope.persons = $firebaseArray(ref);

    $scope.deletePerson = function(personID) {
        const expectedPerson = $scope.persons.$getRecord(personID);
        /* Argument personID zwraca identyfikator rekordu
         * w firebase. Jest on przekazywany jako parametr w widoku.
         */
        $scope.persons.$remove(expectedPerson)
            .then(value => {
                /* @TODO zaimplementować modal */
                alert('Gość został usunięty')
            })
            .catch(err => {
                /* @TODO zaimplementować modal */
                alert('Oops. Wystąpił błąd. Skontaktuj się z administratorem.');
            })
    }
}]);
