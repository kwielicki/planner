angular
	.module('weddingPlanner')
	.component('compEditGuest', {
		templateUrl: 'templates/components/comp-edit-guest.html',
		controller: function($scope, $element, $rootScope, $route, $firebaseArray, notify, Auth, plannerSnackbar, $location) {

			const ctrl = this;

			/* Referencja do tabeli znajdującej się w bazie danych */
			const ref = firebase.database().ref("list_of_guest");

			const {
				personID
			} = $route.current.params;

			/* Tabela, zwracająca dane z bazy danych */
			$scope.persons = $firebaseArray(ref);

			/* Wystawienie aktualnej wartości url'a */
			$rootScope.plannerGlobal.breadcrumbsUrl = $route.current.breadcrumbsTitle;

			$scope.$watchCollection('[$root.plannerGlobal.breadcrumbsUrl]', function(oldValue, newValue) {
				$scope.currentLabelForUrl = $rootScope.plannerGlobal.breadcrumbsUrl;
			});

			// Klasy pomocnicze
			ctrl.classHelpers = {
				componentName: 'editguest',
				componentInitialized: 'editguest--initialized'
			};

			/* Template renderer */
			function rendererForSuccessEditing(editablePerson, variant = 'fa-check-circle', information = 'pomyślnie') {

				/* Destrukturyzacja obiektu */
				const {
					firstName,
					surName
				} = editablePerson;

				return `
	                <div class="planner-snackbar-header">
	                    <h4 class="planner-snackbar__icon">
	                        <i class="fa ${variant} nav__icon" aria-hidden="true"></i>
	                    </h4>
	                </div>
	                <div class="planner-snackbar-body">
						<div class="planner-snackbar__subtitle">Edycja danych gościa</div>
	                    <p class="planner-snackbar__description">
							<strong>${firstName} ${surName}</strong>
	                        <span class="planner-snackbar__info"> - modyfikacja zakończona ${information}.</span>
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


				/* Jeśli tabela zostanie w pełni odczytana,
				 * wykonuję na niej metodę $getRecord a jako argument
				 * podaję wartość ID, który został przekazany jako return
				 * metody resolve w routingu
				 */
				$scope.persons.$loaded()
					.then(function() {
						const currentEditableID = personID;
						const getCurrentRecord = $scope.persons.$getRecord(currentEditableID);



						/* @param null
						 * Jeśli getCurrentRecord zwraca null, znaczy to tyle, że w bazie nie ma
						 * rekordu o ID do którego dajemy zapytanie
						 */
						if (getCurrentRecord === null) {
							// do nothing
						} else {
							$scope.person = getCurrentRecord;
						}

						/* Metoda sendRecordToDataBase ma za zadanie zapisanie
						 * zedytowanego rekordu do bazy danych
						 */
						$scope.sendRecordToDataBase = function() {
							$scope.persons.$save(getCurrentRecord)
								.then(function(ref) {
									/*
									 * - update właściwości fullName
									 * - dodanie informacji o osobie, która dokonała modyfikacji
									 * - dodanie informacji o dacie dokonania modyfikacji
									 * @TODO dodanie opcji, która pozowali sprawdzić co zostało zmienione
									 */
									ref.update({
										fullName: getCurrentRecord.firstName + ' ' + getCurrentRecord.surName,
										editedBy: Auth.$getAuth().email,
										editedDate: firebase.database.ServerValue.TIMESTAMP,
										editedDifference: 'Przepraszam, ale aktualnie nie posiadam informacji co uległo edycji.'
									}).then(() => {
										plannerSnackbar.create(rendererForSuccessEditing(getCurrentRecord), 2000, '', 'success');
									});
								}, function(error) {
									plannerSnackbar.create(rendererForSuccessEditing(getCurrentRecord,'fa-exclamation-triangle', 'niepowodzeniem'), 2000, '', 'danger');
								});
						}
					})
			};

		}
	})
