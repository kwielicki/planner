angular
    .module('weddingPlanner')
    .component('compSearchGuest', {
        templateUrl: 'templates/components/comp-search-guest.html',
        controller: function( $element, $firebaseArray, $route, $scope, $window, plannerSnackbar, $location ) {

        const ctrl = this;

        // Klasy pomocnicze
        ctrl.classHelpers = {
            componentName: 'search-guest',
            componentInitialized: 'search-guest--initialized'
        };

            ctrl.$onInit = () => {
                $element
                    .addClass(`
                        ${ctrl.classHelpers.componentName}
						${ctrl.classHelpers.componentInitialized}
                    `)
					.attr('data-component-name', ctrl.classHelpers.componentName);


				/* Template renderer */
				function rendererForSuccessEditing(editablePerson, variant = 'fa-check-circle', information = 'pomyślnie') {

					/* Destrukturyzacja obiektu */

					return `
		                <div class="planner-snackbar-header">
		                    <h4 class="planner-snackbar__icon">
		                        <i class="fa ${variant} nav__icon" aria-hidden="true"></i>
		                    </h4>
		                </div>
		                <div class="planner-snackbar-body">
							<div class="planner-snackbar__subtitle">Nastąpiła zmiana gościa do edycji</div>
		                    <p class="planner-snackbar__description">
								<strong>${editablePerson}</strong>
		                        <span class="planner-snackbar__info"> - zmiana widoku edycji zakończona ${information}.</span>
		                    </p>
		                </div>
		            `;
				}

                const refForListOfGuest     = firebase.database().ref().child("list_of_guest");
				ctrl.currentEditablePerson  = $route.current.pathParams.personID;

				ctrl.searchGuest = function(value) {
					ctrl.queryList = [];
					ctrl.isNotEmpty = false;
					if ( value === '' ) return;
					refForListOfGuest
						.orderByChild('fullName')
						.startAt(value)
						.endAt(`${value}\uf8ff`)
						.limitToFirst(30)
						.on('child_added', (snapshot) => {
							let snapshotID = snapshot.key;
							let snapshotFN = snapshot.val().fullName;
							ctrl.queryList.push({
								id: snapshotID,
								fullName: snapshotFN
							});
							ctrl.isNotEmpty = true;
						});
				}
				ctrl.toggleSearch = function () {
				    $window.onclick = null;
				    ctrl.isNotEmpty = !ctrl.isNotEmpty;

				    if (ctrl.isNotEmpty) {
				        $window.onclick = function (event) {
				            ctrl.isNotEmpty = false;
				            $scope.$apply();
				        };
				    }
				};

				ctrl.setSnackbarHelper = (value, pathID) => {
					plannerSnackbar.create(rendererForSuccessEditing(value), 2000, '', 'success');
				}
            }
        }
    })
