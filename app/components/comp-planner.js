angular
    .module('weddingPlanner')
    .component('compPlanner', {
        templateUrl: 'templates/components/comp-planner.html',
        controller: function( $scope, $element, $firebaseArray, $http, plannerSnackbar, $filter, $timeout ) {

            const ctrl = this;

			/* Korzystam z API, aby przetłumaczyć nazwę kategorii z języka Polskiego na angielski */
			const STATICS = {
				yandexKey: 'trnsl.1.1.20180813T190420Z.b7986516fc90e6d0.36e97d0d4ac0e7e6056328a5c3666741b9aa880e',
				yandexLang: 'pl-en'
			};


            /* Referencja do głównej bazy danych, przechowujących informację dot. plannera */
			ctrl.planner_DB__ref = $firebaseArray(firebase.database().ref().child("planner_db"));

            /* Metoda plannerCategoryAdd odpowiada za dodanie kategorii do bazy danych
             * Przy dodawaniu tej metody występuje walidacja eliminująca możliwośc dodania drugi raz
             * tej samej kategorii
             */
			ctrl.plannerCategoryAdd = function(categoryName) {
				const encodeCategoryName = encodeURI(categoryName);

				$http({
					method: 'GET',
					url: `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${STATICS.yandexKey}&text=${encodeCategoryName}&lang=${STATICS.yandexLang}`
				}).then(function(response) {

                    /* Nazwa kategorii przetłumaczona na język angielski */
					const translatedText = response.data.text[0],
						  translateTextSplitted = translatedText.toLowerCase().split(' '),
						  translateCategoryIdentifier = translateTextSplitted.join('_');

                    /* Przygotowana referencja na zadaną kategorię w bazie plannera */
				  	ctrl.planned_DB_category__ref = firebase.database().ref().child("planner_db").child(`cat__${translateCategoryIdentifier}`);

					/* Obsługa wyjątku, kiedy Ktoś próbuje dodać kategorię, która już istnieje w bazie danych */
					if ( ctrl.planner_DB__ref.$getRecord(`cat__${translateCategoryIdentifier}`) !== null ) {
						plannerSnackbar.create('Próbujesz dodać kategorię, która już istnieje w bazie danych', 1500);
					} else {
                        /* Dodanie do plannera unikalnej kategorii */
						ctrl.planned_DB_category__ref.set({
							categoryName: categoryName
						}).then(function(response) {
							plannerSnackbar.create('Kategoria została dodana', 1500);
						}).catch(function(error) {
							console.log(error);
						});
					}
				});
			}

            /* Dodanie notatki dla kategorii. Notatka dostaje defaultowe dane */
            ctrl.planner_DB__ref.$loaded()
                .then(function() {
                    ctrl.plannerNoteAddByCategoryRef = function(plannerNoteName, title) {
                        $firebaseArray(firebase.database().ref().child("planner_db").child(`${plannerNoteName}`).child(`elements`))
                            .$add({
                                title: title,
                                advance: {
                                    currency: 'zł',
                                    amount: ''
                                },
                                supplement: {
                                    currency: 'zł',
                                    amount: ''
                                },
                                price: {
                                    currency: 'pln',
                                    amount: ''
                                },
                                status: {
                                    label: {
                                        done: 'Zrealizowane',
                                        inprogress: 'Nie zrealizowane',
                                        defalut: 'Nie zrealizowane'
                                    },
                                    value: false
                                },
                                desc: '-'
                            })
                    }
                });

            // Klasy pomocnicze
            ctrl.classHelpers = {
                componentName: 'planner',
				componentInitialized: 'planner--initialized'
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

            // Usuwanie pojedynczego elementu
            ctrl.plannerRemoveExpectedNote = function(key,cat) {
                $firebaseArray(firebase.database().ref().child("planner_db").child(cat).child('elements')).$loaded()
                    .then(function(response) {
                        const elId = response.$getRecord(key);
                        response.$remove(elId)
                            .then(function() {
                                plannerSnackbar.create(`${elId.title} - został usunięty`, 1500);
                            });
                });
            };


            // Zapisywanie pojedynczego elementu
            ctrl.plannerSaveExpectedNote = function( key, cat, value) {
                $firebaseArray(firebase.database().ref().child("planner_db").child(cat).child('elements')).$loaded()
                    .then(function(response) {
                        const elId = response.$getRecord(key);
                        console.log(value.advance.amount)
                        elId.advance.amount = value.advance.amount;
                        elId.price.amount = value.price.amount;
                        elId.status.value = value.status.value;
                        elId.desc = value.desc;

                        response.$save(elId)
                        .then(function(response) {
                            console.log(response)
                        }).catch(function(err) {
                            console.log(err);
                        });


                });
            }

            $scope.expandedRecord = null;
            // Zapisywanie pojedynczego elementu
            ctrl.plannerEditExpectedNote = function(value) {
                $scope.copy = angular.copy(value);
                $scope.expandedRecord = value;
            }

            /* Porzucenie zmian */
            ctrl.plannerDiscardExpectedNote = function(value) {
                value.advance.amount    = $scope.copy.advance.amount;
                value.supplement.amount = $scope.copy.supplement.amount;
                value.price.amount      = $scope.copy.price.amount;
                value.status.value      = $scope.copy.status.value;
                $scope.expandedRecord = null;
            }



        }
    })
