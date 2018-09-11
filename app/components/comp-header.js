angular
	.module('weddingPlanner')
	.component('compHeader', {
		templateUrl: 'templates/components/component-header.html',
		controller: function($scope, $element, $rootScope, $location, $localStorage, Auth) {

			/* Controler object for compHeader */
			const ctrl = this;

			/* Passing the correct value about last succesed login */
			ctrl.user = {
				lastSuccessedLoginData: $localStorage.lastSuccessedLoginData
			};


			/* The component "compHeader" contains information about userName, or userEmail
			 * The method below allows for presentation these elements
			 */
			ctrl.auth = Auth;
            ctrl.auth.$onAuthStateChanged(function(firebaseUser) {
                ctrl.firebaseUser = firebaseUser;
                /* Firebase standardowo zwraca null'a we właściwości firebaseUserDisplayName
                 * jednakże, można zrobić update. Jeśli taka operacja zostanie wykonana,
                *  w menusie pokazuję ten element
                */
                if ( firebaseUser !== null ) {
                    if ( firebaseUser.displayName !== null ) {
                        ctrl.firebaseUserDisplayName = true;
                    }
                }
                // For global usage
                $rootScope.firebaseUserGlobal = firebaseUser;
            });


			/* The method below allows to distinguish which menu item
			 * should be setting as active
			 */
			ctrl.isActive = function (viewLocation) {
				return viewLocation === $location.path();
			};


			/* Dropdown menu support in main navigation */
			ctrl.toggleMenuStatus = "Otwórz menu";
			ctrl.toggled = function(open) {
				/* open is a boolean type
				 * - returning true if menu is opened
				 * - returning false if menu is closed
				 */
				if (open === true) {
					ctrl.toggleMenuStatus = "Zamknij menu";
				} else {
					ctrl.toggleMenuStatus = "Otwórz menu";
				}
			}


			/* Static models for menu dropdown renderers */
			ctrl.menuItems__dashboard = [{
				name: 'Panel główny',
				url: '/dashboard',
				title: 'Przejdź do panelu głównego'
			}];

			ctrl.menuItems__modules = [{
					name: 'Zarządzaj listą gości',
					url: '/manage-guests',
					title: 'Zarządzaj listą gości'
				},
				{
					name: 'Dodaj nowego gościa',
					url: '/add-new-guest',
					title: 'Dodaj nowego gościa'
				},
				{
					name: 'Organizer weselny',
					url: '/wedding-organizer',
					title: 'Organizer weselny'
				},
				{
					name: 'Notatnik weselny',
					url: '/wedding-notebook',
					title: 'Notatnik weselny'
				},
				{
					name: 'Lista rzeczy do zrobienia',
					url: '/todo-list',
					title: 'Lista rzeczy do zrobienia'
				},
				{
					name: 'Zarządzaj wydatkami',
					url: '/manage-expenses',
					title: 'Zarządzaj wydatkami',
					specialClass: 'not--available'
				},
				{
					name: 'Statystyki',
					url: '/statistics',
					title: 'Zapoznaj się ze statystykami'
				},
				{
					name: 'Dokumentacja',
					url: '/documentation',
					title: 'Dokumentacja aplikacji Wedding Planner'
				}
			];

			ctrl.menuItems__additional = [
				{
					name: 'Aktualności',
					url: '/news',
					title: 'Aktualności'
				}
			];

			// Klasy pomocnicze
			ctrl.classHelpers = {
				componentName: 'header',
				componentInitialized: 'header--initialized'
			};

			// Dodanie klasy oraz atrybutu na komponent
			ctrl.$onInit = () => {
				$element
					.addClass(`
                        ${ctrl.classHelpers.componentName}
						${ctrl.classHelpers.componentInitialized}
                    `)
					.attr('data-component-name', ctrl.classHelpers.componentName);

				$rootScope.$watch('firebaseUserGlobal', function() {
					ctrl.firebaseUserAuthenticated = $rootScope.firebaseUserGlobal;
				});
			};

		}
	})
