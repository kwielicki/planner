angular
	.module('weddingPlanner').filter('offset', function() {
		return function(input, start) {
			start = parseInt(start, 10);
			return input.slice(start);
		};
	});

angular
	.module('weddingPlanner')
	.controller("addNewGuest", function($scope, $firebaseArray, notify, Auth, $rootScope, $location, $anchorScroll) {

		/*
		 * Paginacja
		 * - currentPage -> paginacja działa od 1 strony
		 * - itemsPerPage -> liczba elementów wyświetlana na 1 stronie paginacji
		 * - maxSize -> ustawione na 0, aby ukryć listę z poszczególnymi stronami paginacji
		 */
		$scope.currentPage = 1;
		$scope.itemPerPage = 10;
		$scope.label = $scope.itemPerPage;
		$scope.maxSize = 0;
		$scope.start = 0;

		/* Przygotowanie dropdownu, który umożliwia użytkownikowi zmianę ilości
		 * wyświetlanych elementów per strona paginacji
		 */
		$rootScope.$watch('numberOfTotalPersons', function() {
			$scope.numberOfTotalPersons = $rootScope.numberOfTotalPersons;
			if ($scope.numberOfTotalPersons !== undefined) {
				$scope.elements = [
                    {
						'itemsPerPage': 10
					}, {
						'itemsPerPage': 30
					}, {
						'itemsPerPage': 50
					}, {
						'itemsPerPage': 100
					}, {
						'itemsPerPage': 200
					}, {
						'itemsPerPage': 300
					}
                ];

			}
		});
		$scope.pageChanged = function() {
			$scope.start = ($scope.currentPage - 1) * $scope.itemPerPage;

		};
		$scope.clickedEl = function(number) {
			$scope.itemPerPage = number.itemsPerPage;
			$scope.label = number.itemsPerPage;
		}

		var ref = firebase.database().ref().child("list_of_guest");

		ref.once('value', function(snapshot) {
			$rootScope.numberOfTotalPersons = snapshot.numChildren();
		});

		/* Metoda tableManagementDetails służy do pokazania
		 * informacji dodatkowych znajdujących się w tableManagementDetails
		 */
		$scope.tableManagementDetails = function(event) {
			var $this = $(event.currentTarget);
			$this.addClass('ng-cloak');
			$this.next().slideDown();
		}

		/* Metoda tableManagementHideDetails służy do ukrywania
		 * informacji dodatkowych znajdujących się w tableManagementDetails
		 */
		$scope.tableManagementHideDetails = function(event) {
			var $this = $(event.currentTarget);
			$this.parent().slideUp(400, function() {
				$this.parents('.table-management__row ').find('.table-management__row-details').removeClass('ng-cloak');
			});
		}

		//- Synchronizujemy obiekt person z tablica firebase
		$scope.persons = $firebaseArray(ref);

		/* Funkcja odpowiadająca za dodanie nowej osoby do bazy danych
		 * Dodajemy do bazy takie dane jak:
		 * -- fullName w skład którego wchodzą firstName oraz surName
		 * -- guestCount odpowiadający za przechowywanie liczby gości
		 * -- dataAddeded odpowiadający za przechowywanie datę dodania oraz ew. modyfikacji
		 * -- membership odpowiadający za przechowywanie przynależnosci grupowej (pan/pani)
		 * -- status odpowiadający za przechowywanie statusu
		 * -- phoneNumber odpowiadający za przechowywanie numeru telefonu
		 */

		$scope.persons.$loaded()
			.then(function() {
				$scope.dbLoaded = true;
			});
		$scope.addNewPerson = function() {
			$scope.persons.$add({
				firstName: $scope.firstName,
				surName: $scope.surName,
				fullName: $scope.firstName + ' ' + $scope.surName,
				guestCount: parseInt($scope.guestCount, 10),
				children: ($scope.children !== undefined) ? parseInt($scope.children, 10) : 0,
				dataAdded: firebase.database.ServerValue.TIMESTAMP,
				membership: $scope.membership,
				status: $scope.status,
				creator: Auth.$getAuth().email,
				phoneNumber: ($scope.phoneNumber !== undefined) ? parseInt($scope.phoneNumber, 10) : '-',
				extraInformation: ($scope.extraInformation !== undefined) ? $scope.extraInformation : 'brak'
			}).then(function(ref) {
				notify({
					messageTemplate: "\n    <div class=\"notification-header\">\n      <h4 class=\"notification-header__icon\"><i class=\"fa fa-check-circle nav__icon\" aria-hidden=\"true\"></i></h4>\n    </div>\n    <div class=\"notification-body\">\n      <h2 class=\"notification-body__title\"><span>Powodzenie!</span></h2>\n      <p class=\"notification-body__description\"> \n         <strong>" + $scope.firstName + " " + $scope.surName + "</strong>\n         Rekord zosta\u0142 dodany do systemu. Dane zosta\u0142y wprowadzone w spos\xF3b prawid\u0142owy.</p>\n    </div>\n ",
					position: 'right',
					classes: 'notification-success',
					duration: 0
				});
				$scope.formAddNewGuest.$setPristine();
				$scope.formAddNewGuest.$setUntouched();
			}, function(error) {
				notify({
					messageTemplate: "\n                      <div class=\"notification-header\">\n                        <h4 class=\"notification-header__icon\"><i class=\"fa fa-exclamation-circle nav__icon\" aria-hidden=\"true\"></i></h4>\n                      </div>\n                      <div class=\"notification-body\">\n                        <h2 class=\"notification-body__title\"><span>Oops... wyst\u0105pi\u0142 b\u0142\u0105d!</span></h2>\n                        <p class=\"notification-body__description\"> \n                           <strong>" + $scope.firstName + " " + $scope.surName + "</strong>\n                           Rekord nie zosta\u0142 dodany do systemu. Zweryfikuj poprawno\u015B\u0107 wprowadzonych danych.</p>\n                      </div>\n                    ",
					position: 'right',
					classes: 'notification-warning',
					dration: 0
				});
			});

		};
	});
