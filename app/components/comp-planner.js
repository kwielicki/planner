angular
    .module('weddingPlanner')
    .component('compPlanner', {
        templateUrl: 'templates/components/comp-planner.html',
        controller: function( $scope, $element, $firebaseArray, $http, plannerSnackbar, $filter, $timeout ) {

            /* Zasięg komponentu */
            const ctrl = this;

            /* Referencja do głównej bazy danych, przechowujących informację dot. plannera */
			ctrl.planner_DB__ref = firebase.database().ref().child("planner_db");
            ctrl.planner_DB__Array = $firebaseArray(ctrl.planner_DB__ref);

			/* Korzystam z API, aby przetłumaczyć nazwę kategorii z języka Polskiego na angielski */
			const STATICS = {
				yandexKey: 'trnsl.1.1.20180813T190420Z.b7986516fc90e6d0.36e97d0d4ac0e7e6056328a5c3666741b9aa880e',
				yandexLang: 'pl-en'
			};

            /* Zmienna przechowująca kolory, które są wykorzystywane na Froncie, przy prezentacji notatek.
             * Kolory są generowane losowo z poniżej możliwych wartości */
            const circleBackgroundColors = [
                '#03CEA4',
                '#FB4D3D',
                '#E40066',
                '#EAC435',
                '#B18FCF',
                '#DDFFF7',
                '#FFD2FC',
                '#E980FC',
                '#FF9000',
                '#43AA8B',
                '#B2B09B',
                '#F6F7EB'
            ];

            /* Snackbar
             * Constant waiting time for the user message
             */
            const CONSTS = {
                snackbarDelay: 1500
            };

            /* Funkcja, której zadaniem jest "wyłapanie" losowgo indexu z tablicy - circleBackgroundColors */
            function circleRandomBackgroundColor(colorPalete) {
                return circleBackgroundColors[Math.floor(Math.random()*circleBackgroundColors.length)];
            }

            /* Sortowanie kategorii odbywa się chronologicznie (od najstarszej do najmłodszej )
             * timestamp jest generowany przez firebase
            */
            ctrl.chronological = '-timestamp';

            /* Metoda plannerCategoryAdd odpowiada za dodanie kategorii do bazy danych
             * Przy dodawaniu tej metody występuje walidacja eliminująca możliwośc dodania drugi raz
             * tej samej kategorii
             */
			ctrl.plannerCategoryAdd = function(categoryName) {
				const encodeCategoryName = encodeURI(categoryName);

                /* Zapytanie do API traslatora */
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
					if ( ctrl.planner_DB__Array.$getRecord(`cat__${translateCategoryIdentifier}`) !== null ) {
						plannerSnackbar.create('Próbujesz dodać kategorię, która już istnieje w bazie danych', CONSTS.snackbarDelay);
					} else {
                        /* Dodanie do plannera unikalnej kategorii */
						ctrl.planned_DB_category__ref.set({
							categoryName: categoryName,
                            characterCircleBackground: circleRandomBackgroundColor(circleBackgroundColors),
                            timestamp: firebase.database.ServerValue.TIMESTAMP
						}).then(function(response) {
							plannerSnackbar.create('Kategoria została dodana', CONSTS.snackbarDelay);
                            ctrl.cat_name = '';
						}).catch(function(error) {
							console.log(error);
						});
					}
				});
			}

            /* Dodanie notatki dla kategorii. Notatka dostaje defaultowe dane */
            ctrl.planner_DB__Array.$loaded()
                .then(function(response) {
                    ctrl.plannerNoteAddByCategoryRef = function(plannerNoteName, title) {
                        ctrl.hide = false;
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
                                    currency: 'zł',
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
                    ctrl.dbLoaded = true;
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
            ctrl.plannerRemoveExpectedNote = function(key,expectedCategory) {
                $firebaseArray(firebase.database().ref().child("planner_db").child(expectedCategory).child('elements')).$loaded()
                    .then(function(response) {
                        const elId = response.$getRecord(key);
                        response.$remove(elId)
                            .then(function() {
                                plannerSnackbar.create(`${elId.title} - został usunięty`, CONSTS.snackbarDelay);
                            });
                });
            };


            // Zapisywanie pojedynczego elementu
            ctrl.dbActionCompleted = false;
            ctrl.plannerSaveExpectedNote = function( key, cat, value) {
                ctrl.dbActionCompleted = true;
                $firebaseArray(firebase.database().ref().child("planner_db").child(cat).child('elements')).$loaded()
                    .then(function(response) {
                        const elId = response.$getRecord(key);
                        elId.advance.amount = value.advance.amount;
                        elId.price.amount = value.price.amount;
                        elId.status.value = value.status.value;
                        elId.desc = value.desc;

                        response.$save(elId)
                            .then(function(response) {
                                $timeout(function() {
                                    ctrl.dbActionCompleted = false;
                                    $scope.expandedRecord = null;
                                }, 1500);
                            }).catch(function() {
                                plannerSnackbar.create('Sprawdź poprawność wprowadzonych danych', CONSTS.snackbarDelay);
                                ctrl.dbActionCompleted = false;
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
                value.desc              = $scope.copy.desc;
                $scope.expandedRecord = null;
            }

            /* Category removing
             * This option is available only when expected category hasn't any elements ( notes )
             */
            ctrl.plannerRemoveCategory = (value) => {
                const categoryId = value.$id;
                $firebaseArray(firebase.database().ref().child("planner_db")).$loaded()
                    .then(function(response) {
                        const category = response.$getRecord(categoryId);
                        if ( category.elements === undefined ) {
                            response.$remove(category)
                                .then(function() {
                                    plannerSnackbar.create(`Kategoria ${category.categoryName} - została usunięta`, CONSTS.snackbarDelay);
                                });
                        }
                });
            }
        }
    })
