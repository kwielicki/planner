weddingPlanner.controller('ctrlDeletePerson', [ '$scope', '$firebaseArray', '$uibModal',  function ( $scope, $firebaseArray, $uibModal ) {
    const ref = firebase.database().ref().child("list_of_guest");
    $scope.persons = $firebaseArray(ref);

    const $firebaseSceope = $scope;

    $scope.deletePerson = function(personID) {
        const expectedPerson = $scope.persons.$getRecord(personID);
        $scope.animationsEnabled = true;

        var templateModal = "\n            <div class=\"modal-planner__header\">\n                <h3 class=\"modal-planner__title\">Osoba kt\xF3ra zostanie usuni\u0119ta to -\n                    <span class=\"text-uppercase modal-planner__guest-name\">" + expectedPerson.firstName + " " + expectedPerson.surName + "</span>\n                    <i class=\"fa fa-question-circle\" title=\"" + expectedPerson.firstName + " " + expectedPerson.surName + " - dodany przez " + expectedPerson.creator + "\"></i>\n                </h3>\n            </div>\n            <div class=\"modal-body\">\n                <div ng-hide=\"whenDeleteGuestComplete\">\n                    <div class=\"modal-description text-xs-center\">\n                        <h2 class=\"modal-description-title\">Uwaga!</h2>\n                        <h3 class=\"modal-description-subtitle\">Dane dla tego go\u015Bcia zostan\u0119 trwale usuni\u0119te.</h3>\n                    </div>\n                    <div class=\"modal-buttons\">\n                        <a href=\"#\" ng-click=\"deletePermanent()\" class=\"btn btn-danger\">Usu\u0144 trwale</a>\n                        <a href=\"#\" ng-click=\"closeModal()\" class=\"btn btn-default\">Nie usuwaj</a>\n                    </div>\n                </div>\n                <div ng-show=\"whenDeleteGuestComplete\" class=\"hide text-xs-center\">" + expectedPerson.firstName + " " + expectedPerson.surName + " - go\u015B\u0107 usuni\u0119ty</div>\n                <div ng-show=\"whenDeleteGuestError\" class=\"hide text-xs-center\">Oops. Wyst\u0105pi\u0142 b\u0142\u0105d. Skontaktuj si\u0119 z administratorem.</div>\n\n            </div>\n            <a href=\"#\" class=\"modal-close\" title=\"Zamknij okno\" ng-click=\"closeModal()\">Zamknij</a>\n        ";

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
                     $firebaseSceope.persons.$remove(expectedPerson).then(function (value) {
                         $firebaseSceope.whenDeleteGuestComplete = true;
                     }).catch(function (err) {
                         $firebaseSceope.whenDeleteGuestError = true;
                     });
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
