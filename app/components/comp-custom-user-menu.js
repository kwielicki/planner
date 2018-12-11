angular
    .module('weddingPlanner')
    .component('compCustomUserMenu', {
        templateUrl: 'templates/components/component-custom-user-menu.html',
        controller: function( $scope, $element, $window, $route, $firebaseArray, $rootScope, $q ) {

            const ctrl = this,
                  ref  = firebase.database().ref().child("quick_links"),
                  refUsers  = ref.child('users');

            ctrl.quickLinks = $firebaseArray(ref);

            // Klasy pomocnicze
            ctrl.classHelpers = {
                componentName: 'custom-user-menu',
				componentInitialized: 'custom-user-menu--initialized'
            };

            // Promise Required
            function getUserEmail(user) {
                return $q((resolve,reject) => {
                    $rootScope.$watch('firebaseUserGlobal', function( response ) {
                        resolve($rootScope.firebaseUserGlobal.email);
                    });
                })
            }
            const UserEmail = getUserEmail();

            // Dodanie klasy oraz atrybutu na komponent
            ctrl.$onInit = () => {
                $element
                    .addClass(`
                        ${ctrl.classHelpers.componentName}
						${ctrl.classHelpers.componentInitialized}
                    `)
					.attr('data-component-name', ctrl.classHelpers.componentName);


                UserEmail.then((response) => {
                    var userEmail = response,
                        firebaseReservedCharacters = [".", "#", "$", "[","]"];

                    var key = {'.': '_'},
                        validEmail = userEmail.replace(/[.#$]/g, (char) => key[char] || '');

                    /* Przygotowuję możliwe linki */
                    const availableRoutes    = $route.routes,
                          arrayOfGivenRoutes = Object.entries(availableRoutes);
                    ctrl.uniqueRouteOriginalPath = [];

                    for ( const [key, value] of arrayOfGivenRoutes ) {
                        if ( value.templateUrl !== undefined && value.availableForCustomUserMenu) {
                            ctrl.uniqueRouteOriginalPath.push(value);
                        }
                    }

                    /* Kliknięcie w dostępny Link powoduje zapamiętanie wyboru
                     * Komponent umozliwia dodanie maksymalnie 4 linków.
                    */

                    let selectedLinks = [],
                        numberOfSelectedLinks = 0;
                    ctrl.isDisabled = true;
                    ctrl.selectAvailableRoute = ( routeObject, isSelected ) => {
                        ctrl.deactivation = false;
                        /* Element menu został zaznaczony */
                        if ( isSelected) {
                            selectedLinks.push(routeObject);
                        } else {
                            /* Element menu został odznaczony, następuje jego usunięcie */
                            const hashKey = routeObject.$$hashKey;
                            angular.forEach(selectedLinks, ( object, index ) => {
                                if (object.$$hashKey === hashKey) {
                                    // remove the matching item from the array
                                    selectedLinks.splice(index, 1);
                                    // and exit the loop right away
                                    return;
                                };
                            });
                        }

                        /* Alerty */
                        if ( selectedLinks.length >= 4 ) {
                            ctrl.isItActivated = true;
                        } else {
                            ctrl.isItActivated = false;
                        }

                        /* Przycisk umożliwiający zapisnie szybkich linków */
                        if ( selectedLinks.length > 0 && selectedLinks.length <= 4 ) {
                            ctrl.isDisabled = false;
                            ctrl.disableQL = true;
                        } else {
                            ctrl.isDisabled = true;
                        }

                        ctrl.selectedLinks = selectedLinks;

                    }

                    ctrl.quickLinks_DB_user__ref = firebase.database().ref().child("quick_links").child('users').child(`user__${validEmail}`);
                    ctrl.quickLinksPerUser = $firebaseArray(ctrl.quickLinks_DB_user__ref);

                    ctrl.dbLoaded  = false;

                    $firebaseArray(refUsers).$loaded()
                        .then(response => {
                            ctrl.dbLoaded = true;
                        });


                    const objWithLinks = link => {
                        return {
                            quickLinkpath: `/#${link.originalPath}`,
                            quickLinkPathAbsolute: link.originalPath,
                            quickLinkTitle: link.breadcrumbsTitle,
                            quickLinkIcon: link.quickLinksIcon
                        };
                    }

                    ctrl.customUserMenuDisable = ()=> {
                        $firebaseArray(refUsers).$loaded()
                            .then(response => {
                                const quickLinkUID = response.$getRecord(`user__${validEmail}`);
                                if (quickLinkUID !== null ) {
                                    response.$remove(quickLinkUID)
                                        .then(() => {
                                            ctrl.disableQL = true;
                                            ctrl.isDisabled = false;
                                            ctrl.deactivation = true;
                                        })
                                }
                            });
                    }

                    ctrl.customUserMenuCreator = function() {
                        ctrl.disableQL = false;
                        $firebaseArray(refUsers).$loaded()
                            .then(response => {
                                const quickLinkUID = response.$getRecord(`user__${validEmail}`);
                                if (quickLinkUID !== null ) {
                                    response.$remove(quickLinkUID)
                                        .then(function() {

                                        }, (error) => {
                                            console.log(error);
                                        });
                                }
                                selectedLinks.map( ( link ) => {
                                    ctrl.quickLinksPerUser.$add(objWithLinks(link)).then( (ref) => {
                                        ctrl.isDisabled = true;
                                    }, (error) => {
                                        console.log(error);
                                    });
                                })
                            })
                    }

                }, function(err) {
                    console.log(err);
                });

            };
        }
    })
