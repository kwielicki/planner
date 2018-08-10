angular
    .module('weddingPlanner')
    .component('compCookies', {
        templateUrl: 'templates/components/comp-cookies.html',
        transclude: {
			'content': '?cookieTitle',
            'content': '?cookieDescription',
			'content': '?cookieName',
			'content': '?cookieValue',
			'content': '?cookieSetTimeout',
			'content': '?cookieAcceptLabel'
        },
        bindings: {
			cookieTitle: '@',
			cookieDescription: '@',
			cookieName: '@',
			cookieValue: '@',
			cookieSetTimeout: '@',
			cookieAcceptLabel: '@'
        },
        controller: function( $scope, $element, $window, $cookies, $timeout ) {

            const ctrl = this;

            // Klasy pomocnicze
            ctrl.classHelpers = {
                componentName: 'cookies',
				componentInitialized: 'cookies--initialized'
            };
			const defaults = {
				defaultCookieLabel: "Akceptuję",
				defaultCookieSetTimeout: 2000
			};


            // Dodanie klasy oraz atrybutu na komponent
            ctrl.$onInit = () => {

				/* Ustawienie defaultoweych wartości dla ciastka takich jak etykieta przycisku czy setTimeout */
				if (angular.isUndefined(ctrl.cookieAcceptLabel) || ctrl.cookieAcceptLabel === null) {
					ctrl.cookieAcceptLabel = defaults.defaultCookieLabel;
				}
				if (angular.isUndefined(ctrl.cookieSetTimeout) || ctrl.cookieSetTimeout === null) {
					ctrl.cookieSetTimeout = defaults.defaultCookieSetTimeout;
				}

                $element
                    .addClass(`
                        ${ctrl.classHelpers.componentName}
						${ctrl.classHelpers.componentInitialized}
                    `)
					.attr('data-component-name', ctrl.classHelpers.componentName);

				/* Sprawdzam czy istnieje ciastko cookiesAccepted i czy ma wartośc ustawioną na true */
				if ($cookies.get(ctrl.cookieName) && $cookies.getObject(ctrl.cookieName)) {
					ctrl.cookiesPolictyAccepted = false;
				} else {
					$timeout(function() {
						ctrl.cookiesPolictyAccepted = true;
					}, ctrl.cookieSetTimeout);
				}

				// Akceptacja ciastka
				ctrl.dateFromTheFuture = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
				ctrl.cookieAccept = () => {
					$cookies.put(`${ctrl.cookieName}`, ctrl.cookieValue, {
						expires: ctrl.dateFromTheFuture
					});
					ctrl.cookiesPolictyAccepted = false;
				}
            };

        }
    })
