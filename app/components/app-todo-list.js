angular
	.module('weddingPlanner')
	.component('appTodoList', {
		templateUrl: 'templates/components/component-todo-list.html',
		controller: function($scope, $element, $rootScope, $firebaseArray, $filter, $http, $timeout, plannerSnackbar) {
			const ctrl = this;

			ctrl.greaterThan = function(prop, val){
			    return function(item){
			      return item[prop] > val;
			    }
			}

			/* TodoLista daje również możliwość dodania
			 * daty, do której zadanie powinno zostać wykonane.
			 * Maksymalna data, która może zostać wybrana to maxDate
			 * Minimalna data która może zostać wybrana, to dzień, w którym
             * zadanie zostało dodane
			 */

			$scope.dateOptions = {
				formatYear: 'yyyy',
				maxDate: new Date(2030, 5, 22),
				minDate: new Date(),
				startingDay: 1,
			};


			/* Format daty, dostępny zarówno w kontrolce
			 * jak również w bazie danych
			 */
			$scope.formats = 'd MMMM, yyyy';
			$scope.format = $scope.formats;

			/* Kalendarze do wyboru daty zarówno przy dodawaniu nowego zadania, jak również podczas edycji */
			$scope.calendarStatus = {
				 opened: false
			};
			$scope.calendarOpener = function() {
				$scope.calendarStatus.opened = true;
			};
			$scope.calendarOpenerEditable = function() {
				$scope.calendarStatus.opened = true;
			}


			/* Wartości początkowe
			 * @TODO nazwać ładnie
			 */
            $scope.selectedDate = null;
            $scope.oryginalDateValue = null;
            $scope.timeToFinishTask = null;
			$scope.todoStatus = false;

			/* Obliczenie wartości liczbowej, która zwraca liczbę dni
			 * które zostały do godziny 0
			 */
			$scope.selectDate = function(dt) {
				if ( dt !== undefined ) {
					var xx = dt.getTime() - $scope.dateOptions.minDate;
					$scope.selectedDate = $filter('date')(dt, $scope.formats);
					$scope.oryginalDateValue =  dt.getTime();
					$scope.timeToFinishTask = Math.floor(xx/(1000*60*60*24)) + 1;
				}
			}

			/* Zmiana statusu zadania. Po jej zmianie następuje
			 * automatyczna zmiana w bazie danych oraz następuje
			 * update etykiety, która zwraca wiadomośc tekstową o statusie
			 */
            $scope.statusChecked = function(status, id) {
                const getCurrentRecord  = $scope.todoList.$getRecord(id);
				$scope.displayUser   = status === true ?  $rootScope.firebaseUserGlobal.displayName : '';
				$scope.beEasy = 'is--busy';

                $scope.todoList.$save(getCurrentRecord)
                    .then(function(ref) {
                        ref.update({
                            todoStatus: status,
							displayUser: $scope.displayUser
                        });
						$timeout(function() {
							$scope.beEasy = '';
						}, 1000);
                    })
                    .catch(function(error) {
                        console.error("Error:", error);
                      });
            }

			/* Obserwuję zmiane daty, która określa termin zakończenia zadania */
            // $scope.$watch('selectedDate', function(newValue) {
            //     return newValue;
            // });

			/* Dodanie do headera komponentu imienia zalogowanego użytkownika */
			$rootScope.$watch('firebaseUserGlobal', function() {
				if ( $rootScope.firebaseUserGlobal.displayName !== null ) {
					const userProfileFullName = $rootScope.firebaseUserGlobal.displayName.split(' ');
					$scope.firebaseUserAuthenticated = userProfileFullName[0];
				}
			});

			// Klasy pomocnicze
			ctrl.classHelpers = {
				componentName: 'todo-list',
				componentInitialized: 'todo-list--initialized'
			};

			// Dodanie klasy oraz atrybutu na komponent
			ctrl.$onInit = () => {
				$element
					.addClass(`
                        ${ctrl.classHelpers.componentName}
						${ctrl.classHelpers.componentInitialized}
                    `)
					.attr('data-component-name', ctrl.classHelpers.componentName);
			};

			/* Nawiązanie synchrozniacji z bazą danych.Tabela todo_list */
			const ref = firebase.database().ref().child("todo_list");
			$scope.todoList = $firebaseArray(ref);

			/* Uaktualnienie czasu, który pozostaje do wykonania zadania */
			$scope.todoList.$loaded()
	            .then(function() {
					ref.once('value', function(snapshot) {
						snapshot.forEach(function(childSnapshot) {
							let todoListElementId = $scope.todoList.$getRecord(childSnapshot.key)
							let todoListElementDateExpiration = childSnapshot.val().todoDestinationTimeOryginal;
							let actuallyDate = new Date();
							let actuallyDateTime = actuallyDate.getTime();
							let theTimeDifference = todoListElementDateExpiration - actuallyDateTime;
							let numberOfDays = Math.floor(theTimeDifference/(1000*60*60*24)) + 1;

							$scope.todoList.$save(todoListElementId)
			                    .then(function(ref) {
			                        ref.update({
			                            timeToFinishTask: numberOfDays < 0 ? -1 : numberOfDays
			                        });
			                    })
						});
					});
				});

			/* Zapisanie danych w bazie */
			$scope.enterTodoContentToDatabase = function() {

				$scope.todoList.$add({
					todoText: $scope.local.todoText,
					todoDestinationTime: $scope.selectedDate,
					todoDestinationTimeOryginal: $scope.oryginalDateValue,
                    timeToFinishTask: $scope.timeToFinishTask,
					todoStatus: $scope.todoStatus,
					displayUser: $rootScope.firebaseUserGlobal.displayName
				}).then(function() {
					$scope.local = {};
					$scope.formTodoListConfirmTask.$setPristine();
					$scope.formTodoListConfirmTask.$setUntouched();
				});
			};

			/* Usunięcie zadania z bazy */
			$scope.todoListTaskRemove = function (taskId) {
				const expectedTask = $scope.todoList.$getRecord(taskId);
				$scope.todoList.$remove(expectedTask).then(function () {
					$scope.result = "Zadanie zostało usunięte";
					plannerSnackbar.create($scope.result, 1500);
				}).catch(function (err) {
					$scope.result = "Wystąpił błąd. Spróbuj ponownie";
					plannerSnackbar.create($scope.result, 1500);
				});
			}

			/*
			 * Edycja zadania
			 * Wykorzystuję dwa elementy w tym samym miejscu. Ich pokazanie jest uwarunkowane akcją,
			 * którą użytkownik aktualnie wykonuje tj. dodawanie bądź edycja zadania
			*/
			$scope.todoListTaskEditableHidden = true;
			$scope.todoListTaskEdit = function (taskId) {
				const expectedTask = $scope.todoList.$getRecord(taskId);

				$scope.todoList.todoText = expectedTask.todoText;
				$scope.todoList.dt = expectedTask.todoDestinationTimeOryginal;
				$scope.todoListTaskEditableHidden = false;
				$scope.todoListTaskEditableVisible = true;

				/* Edycja zadania potwierdzona zapisanie rekordu  w bazie danych */
				$scope.todoListTaskEditableAction = function() {
					$scope.todoList.$save(expectedTask)
						.then(function(ref) {

							if ( $scope.todoList.dt !== expectedTask.todoDestinationTimeOryginal ) {
								ref.update({
									todoDestinationTime: $scope.selectedDate,
									todoDestinationTimeOryginal: $scope.oryginalDateValue,
									timeToFinishTask: $scope.timeToFinishTask
								});
							}

							if ( $scope.todoList.todoText !== expectedTask.todoText ) {
								ref.update({
									todoText: $scope.todoList.todoText
								});
							}

							$scope.result = "Zadanie zmodyfikowane";
							plannerSnackbar.create($scope.result, 1500);

						})
						.catch(function(error) {
							$scope.result = "Błąd. Spróbuj ponownie";
							plannerSnackbar.create($scope.result, 1500);
						  });
				}

			}
			$scope.todoListTaskEditableCanceled = function() {
				$scope.todoListTaskEditableHidden = true;
				$scope.todoListTaskEditableVisible = false;
			}


			/* Dodanie odpowiedniej labelki do badga prezentującego status zadania */
            $scope.todoStatusLabel = function(expectedStatusValue) {
                switch (expectedStatusValue) {
                    case true:
                        return 'Zadanie zakończone';
                        break;
                    case false:
                        return 'Zadanie w trakcie realizacji';
                        break;
                    default:
                        return 'Zadanie w trakcie realizacji';
                        break;
                }
            };

			/* Dodanie pomocniczej klasy na zadanie w zależności od jego statusu */
            $scope.statusClassModifier = function( expectedStatusValue ) {
                switch (expectedStatusValue) {
                    case true:
                        return 'todo-list__status--confirmed';
                        break;
                    case false:
                        return 'todo-list__status--pending';
                        break;
                    default:
                        return 'todo-list__status--pending';
                        break;
                }
            }

			/* Kiedy nastąpi zmiana taba, ukrywam ewentualnie wcześniej pokazaną edycję zadania i pokazuję blok
			 * umożliwiający pokazanie formularza z dodaniem nowego zadania */
			$scope.tabsDeselected = function() {
				$scope.todoListTaskEditableVisible = false;
				$scope.todoListTaskEditableHidden = true;
			}

		}
	});
