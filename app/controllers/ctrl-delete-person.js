weddingPlanner.controller('ctrlDeletePerson', [ '$scope', '$firebaseArray', '$uibModal',  function ( $scope, $firebaseArray, $uibModal ) {
    const ref = firebase.database().ref().child("list_of_guest");
    $scope.persons = $firebaseArray(ref);

    const $firebaseSceope = $scope;

    $scope.deletePerson = function(personID) {
        const expectedPerson = $scope.persons.$getRecord(personID);
        $scope.animationsEnabled = true;

        var templateModal = `
            <div class="modal-planner__header">
                <h3 class="modal-planner__title">Osoba która zostanie usunięta to -
                    <span class="text-uppercase modal-planner__guest-name">${expectedPerson.firstName} ${expectedPerson.surName}</span>
                    <i class="fa fa-question-circle" title="${expectedPerson.firstName} ${expectedPerson.surName} - dodany przez ${expectedPerson.creator}"></i>
                </h3>
            </div>
            <div class="modal-body">
                <div ng-hide="whenDeleteGuestComplete">
                    <div class="modal-description text-xs-center">
                        <h2 class="modal-description-title">Uwaga!</h2>
                        <h3 class="modal-description-subtitle">Dane dla tego gościa zostanę trwale usunięte.</h3>
                    </div>
                    <div class="modal-buttons">
                        <a href="#" ng-click="deletePermanent()" class="btn btn-danger">Usuń trwale</a>
                        <a href="#" ng-click="closeModal()" class="btn btn-default">Nie usuwaj</a>
                    </div>
                </div>
                <div ng-show="whenDeleteGuestComplete" class="hide text-xs-center">${expectedPerson.firstName} ${expectedPerson.surName} - gość usunięty</div>
                <div ng-show="whenDeleteGuestError" class="hide text-xs-center">Oops. Wystąpił błąd. Skontaktuj się z administratorem.</div>

            </div>
            <a href="#" class="modal-close" title="Zamknij okno" ng-click="closeModal()">Zamknij</a>
        `;

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            template: templateModal,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            windowClass: 'modal--centered modal--shadowed modal-planner modal-planner--delete',
            openedClass: 'modal-opened modal-overlay--light',
            size: 'md',
            controller: function( $scope ) {
                $scope.deletePermanent = function() {
                    /* Argument personID zwraca identyfikator rekordu
                     * w firebase. Jest on przekazywany jako parametr w widoku.
                     */
                    $firebaseSceope.persons.$remove(expectedPerson)
                        .then(value => {
                            $firebaseSceope.whenDeleteGuestComplete = true;
                        })
                        .catch(err => {
                            $firebaseSceope.whenDeleteGuestError = true;
                        })
                    $scope.whenDeleteGuestComplete = true;
                };
                $scope.closeModal = function() {
                    $scope.$close();
                };
            }
        }).result.catch( function ( resp ) {
            if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
        });
    }

}]);
