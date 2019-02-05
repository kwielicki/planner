angular
    .module('weddingPlanner')
    .component('compStatistic', {
        templateUrl: 'templates/components/comp-statistic.html',
        controller: function( $scope, $element, $window, $firebaseArray ) {

            const ctrl = this;

            // Klasy pomocnicze
            ctrl.classHelpers = {
                componentName: 'statistic',
				componentInitialized: 'statistic--initialized'
            };

            // Dodanie klasy oraz atrybutu na komponent
            ctrl.$onInit = () => {
                $element
                    .addClass(`
                        ${ctrl.classHelpers.componentName}
						${ctrl.classHelpers.componentInitialized}
                    `)
					.attr('data-component-name', ctrl.classHelpers.componentName);

				const refListOfGuest = firebase.database().ref().child("list_of_guest");
				ctrl.guestData = [];

                $firebaseArray(refListOfGuest).$loaded()
                    .then( () => {
                        refListOfGuest.once('value', (snapshot) => {
                            snapshot.forEach( (childSnapshot) => {
                                const childData = childSnapshot.val();
                                ctrl.guestData.push(childData);
                            });
                        });
                        ctrl.dbLoaded  = true;
                        ctrl.preloaderHidden = 'hidden';
                    });

                /* Komponent i18n */
                ctrl.i18n = {
                    overallGuestsLabel: 'Łączna liczba gości',
                    overallChildrenAccordionHeader: 'Statystyki dot. dzieci',
                    overallChildrenLabel: "Łączna liczba dzieci",
                    waitingGuests: 'Goście oczekujący',
                    confirmedGuests: 'Goście potwierdzeni',
                    declinedGuests: 'Goście z odmową',
                    waitingChildren: 'Dzieci ze statusem rodzica "oczekujący"',
                    confirmedChildren: 'Dzieci ze statusem rodzica "potwierdzony"',
                    declinedChildren: 'Dzieci ze statusem rodzica "odmowa"',
                };

            };
        }
    })
