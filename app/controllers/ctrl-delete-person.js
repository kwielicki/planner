angular
    .module('weddingPlanner')
    .controller('ctrlDeletePerson', [ '$scope', '$firebaseArray', '$uibModal', '$rootScope',  function ( $scope, $firebaseArray, $uibModal, $rootScope ) {
        const ref = firebase.database().ref().child("list_of_guest");
        $scope.persons = $firebaseArray(ref);

        const $firebaseSceope = $scope;

        $scope.deletePerson = function(personID) {
            const expectedPerson = $scope.persons.$getRecord(personID);
            $scope.animationsEnabled = true;
            let templateModal = `
                    <div class="modal-planner__header">
                        <div class="modal-planner__title">
                            <span ng-hide="whenDeleteGuestComplete">Proces usuwania gościa (1/2)</span>
                            <span ng-show="whenDeleteGuestComplete">Proces usuwania gościa (2/2)</span>
                            <i class="fa fa-question-circle" title="${expectedPerson.firstName} ${expectedPerson.surName} został dodany przez ${expectedPerson.creator}."></i>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div>
                            <div class="modal-description text-xs-center" ng-hide="whenDeleteGuestComplete">
                                <h4 class="modal-description-title">Uwaga!</h4>
                                <h5 class="modal-description-subtitle">
                                    Czy chcesz usunąć trwale dane dotyczące <br/> gościa&nbsp;<abbr>${expectedPerson.firstName}&nbsp;${expectedPerson.surName}</abbr>
                                </h5>
                            </div>
                            <div class="modal-description text-xs-center hide" ng-show="whenDeleteGuestComplete">
                                Gość, <abbr>${expectedPerson.firstName} ${expectedPerson.surName}</abbr> <br/> został usunięty z Twojej bazy danych.
                            </div>
                            <div class="modal-buttons" ng-hide="whenDeleteGuestComplete">
                                <a href="#" ng-click="deletePermanent()" class="btn btn-material btn-xs">Usuń trwale</a>
                                <a href="#" ng-click="closeModal()" class="btn btn-material btn-xs">Nie usuwaj</a>
                            </div>
                            <div class="modal-buttons" ng-show="whenDeleteGuestComplete">
                                <a href="#" ng-click="closeModal()" class="btn btn-material btn-xs hide">Zamknij okno</a>
                            </div>
                        </div>
                        <div ng-show="whenDeleteGuestError" class="hide text-xs-center">Oops. Wystąpił błąd. Skontaktuj się z administratorem.</div>
                    </div>
                `;

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                template: templateModal,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                windowClass: 'modal--centered modal--shadowed modal-planner modal-planner--delete',
                openedClass: 'modal-opened modal-overlay--dark',
                size: 'md',
                controller: function( $scope ) {
                    $scope.deletePermanent = function() {
                        /* Argument personID zwraca identyfikator rekordu
                         * w firebase. Jest on przekazywany jako parametr w widoku.
                         */
                         $firebaseSceope.persons.$remove(expectedPerson).then(function (value) {
                            $firebaseSceope.whenDeleteGuestComplete = true;

                            ref.once('value', function(snapshot) {
                                /* Po usunięciu gościa z bazy danych zostaje wykonana aktualizacja ilości gości */
                                $rootScope.numberOfTotalPersons = snapshot.numChildren();
                            });

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
