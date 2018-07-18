angular
    .module('weddingPlanner')
    .component('appBreadcrumbs', {
        templateUrl: 'templates/components/component-breadcrumbs.html',
        controller: function( $scope, $element, $rootScope, $route ) {

            const ctrl = this;

			/* Wystawienie aktualnej wartości url'a */
			$rootScope.plannerGlobal.breadcrumbsUrl = $route.current.breadcrumbsTitle;

			$scope.$watchCollection('[$root.plannerGlobal.breadcrumbsUrl]', function(oldValue, newValue) {
                $scope.currentLabelForUrl = $rootScope.plannerGlobal.breadcrumbsUrl;
            });

            // Klasy pomocnicze
            ctrl.classHelpers = {
                componentName: 'breadcrumbs',
				componentInitialized: 'breadcrumbs--initialized'
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

        }
    })
