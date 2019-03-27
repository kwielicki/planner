angular
    .module('weddingPlanner')
    .component('compGoogleDriveIntegration', {
        templateUrl: 'templates/components/comp-google-drive-integration.html',
        controller: function( $scope, $element, $firebaseArray, plannerSnackbar ) {

            const ctrl = this;

            /* Referencja do głównej bazy danych, przechowujących informację dot. danych
             * wymaganych podczas integracji z Google Drive
             */
			ctrl.google_drive_DB__ref = firebase.database().ref().child("google_drive_integration");
            ctrl.google_drive_DB__Array = $firebaseArray(ctrl.google_drive_DB__ref);

            // Klasy pomocnicze
            ctrl.classHelpers = {
                componentName: 'google-drive-integration',
				componentInitialized: 'google-drive-integration--initialized'
            };

            /* Template renderer */
            function rendererForSuccessEditing(editablePerson, variant = 'fa-check-circle', information = 'pomyślnie') {
                return `
                    <div class="planner-snackbar-header">
                        <h4 class="planner-snackbar__icon">
                            <i class="fa ${variant} nav__icon" aria-hidden="true"></i>
                        </h4>
                    </div>
                    <div class="planner-snackbar-body">
                        <div class="planner-snackbar__subtitle">Nastąpiła zmiana danych do Google Drive</div>
                        <p class="planner-snackbar__description">
                            <strong>Google Drive</strong>
                            <span class="planner-snackbar__info"> - aktualizacja danych zakończona pomyślnie</span>
                        </p>
                    </div>
                `;
            }

            // Dodanie klasy oraz atrybutu na komponent
            ctrl.$onInit = () => {
                $element
                    .addClass(`
                        ${ctrl.classHelpers.componentName}
						${ctrl.classHelpers.componentInitialized}
                    `)
					.attr('data-component-name', ctrl.classHelpers.componentName);
                ctrl.preloaderHidden = true;
                ctrl.google_drive_DB__Array.$loaded()
                    .then(function(response) {
                        ctrl.google_drive_DB__ref.once('value', (snapshot) => {
                            const childData = snapshot.val();
                            const {
                                clientID,
                                apiKEY
                            } = childData;

                            ctrl.clientID = clientID;
                            ctrl.apiKEY = apiKEY;
                            ctrl.preloaderHidden = false;
                        });
                    })
                ctrl.setGoogleDriveIntegration = (clientID, apiKey) => {
                    ctrl.preloaderHidden = true;
                    ctrl.google_drive_DB__ref.update({
                        clientID: ctrl.clientID,
                        apiKEY: ctrl.apiKEY
                    }).then( () => {
                        ctrl.preloaderHidden = false;
                        plannerSnackbar.create(rendererForSuccessEditing(null), 2000, '', 'success');
                        $scope.$evalAsync();
                    });
                }
            };

        }
    })
