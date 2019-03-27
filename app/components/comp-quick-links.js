angular
    .module('weddingPlanner')
    .component('compQuickLinks', {
        templateUrl: 'templates/components/component-quick-links.html',
        controller: function( $element, $rootScope, $firebaseArray, $location ) {

        const ctrl = this;

        // Klasy pomocnicze
        ctrl.classHelpers = {
            componentName: 'quick-links',
            componentInitialized: 'quick-links--initialized'
        };

            ctrl.$onInit = () => {

                $rootScope.$watch('firebaseUserGlobal', function( response ) {

                    ctrl.firebaseUserAuthenticated = $rootScope.firebaseUserGlobal;

                    if ( response !== undefined && response !== null ) {
                        var   userEmail = $rootScope.firebaseUserGlobal.email,
                              key = {'.': '_'},
                              validEmail = userEmail.replace(/[.#$]/g, (char) => key[char] || '');

                        const refUsers  = firebase.database().ref().child("quick_links").child('users').child(`user__${validEmail}`),
                              refStatus  = firebase.database().ref().child("quick_links").child('status').child(`user__${validEmail}`);

                        ctrl.quickLinks = $firebaseArray(refUsers);
                        ctrl.quickLinksStatus = $firebaseArray(refStatus);
                        ctrl.quickLinksStatus.$loaded()
                         	.then((response) => {
                         		$element
                         			.addClass(`
                                        ${ctrl.classHelpers.componentName}--loaded
                                    `)
                         	});
                        $rootScope.quickLinksStatus = true;
                    }

				});
                $element
                    .addClass(`
                        ${ctrl.classHelpers.componentName}
						${ctrl.classHelpers.componentInitialized}
                    `)
					.attr('data-component-name', ctrl.classHelpers.componentName);

                    /* The method below allows to distinguish which menu item
        			 * should be setting as active
        			 */
        			ctrl.isActive = function (viewLocation) {
        				return viewLocation === $location.path();
        			};

            }

        }
    })
