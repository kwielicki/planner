angular
	.module('weddingPlanner')
	.component('compHeader', {
		templateUrl: 'templates/components/component-header.html',
		controller: function($scope, $element, $rootScope, $location, $localStorage, Auth, $window) {

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

			/* Dropdown menu will be closed after click on any list element */
			ctrl.sideBarMenuStatus = false;
			ctrl.sideBarMenuHidding = function( viewLocation ) {
				ctrl.sideBarMenuStatus = false;
				$location.path(viewLocation);
			};

			/* Static models for menu dropdown renderers */
			ctrl.pathToSvg = "../../assets/images/svg/";
			ctrl.menuItems__modules = [{
					name: 'Panel główny',
					url: '/dashboard',
					title: 'Przejdź do panelu głównego',
					icon: '../../assets/images/svg/puzzle.svg'
				},
				{
					name: 'Zarządzaj listą gości',
					url: '/manage-guests',
					title: 'Zarządzaj listą gości',
					icon: '../../assets/images/svg/networking.svg'
				},
				{
					name: 'Dodaj nowego gościa',
					url: '/add-new-guest',
					title: 'Dodaj nowego gościa',
					icon: '../../assets/images/svg/interview.svg'
				},
				{
					name: 'Organizer weselny',
					url: '/wedding-organizer',
					title: 'Organizer weselny',
					icon: '../../assets/images/svg/chat.svg'
				},
				{
					name: 'Notatnik weselny',
					url: '/wedding-notebook',
					title: 'Notatnik weselny',
					icon: '../../assets/images/svg/document.svg'
				},
				{
					name: 'Lista rzeczy do zrobienia',
					url: '/todo-list',
					title: 'Lista rzeczy do zrobienia',
					icon: '../../assets/images/svg/task.svg'
				},
				{
					name: 'Zarządzaj wydatkami',
					url: '/manage-expenses',
					title: 'Zarządzaj wydatkami',
					specialClass: 'not--available',
					icon: '../../assets/images/svg/profit.svg'
				},
				{
					name: 'Statystyki',
					url: '/statistics',
					title: 'Zapoznaj się ze statystykami',
					icon: '../../assets/images/svg/presentation.svg'
				}
			];

			ctrl.menuItems__doc = [
				{
					name: 'Dokumentacja',
					url: '/documentation',
					title: 'Dokumentacja aplikacji Wedding Planner',
					icon: '../../assets/images/svg/briefcase.svg'
				}
			];


			ctrl.menuItems__additional = [
				{
					name: 'Aktualności',
					url: '/news',
					title: 'Aktualności',
					icon: '../../assets/images/svg/global.svg'
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
