angular
    .module('weddingPlanner')
    .component('appIntroBanner', {
        templateUrl: 'templates/components/component-intro-banner.html',
        transclude: {
            'note': '?introBannerNote',
            'desclimer': '?introBannerDesclimer'
        },
        bindings: {
		 introbannertitle: '@',
		 introbannerdescription: '@'
        },
        controller: function( $scope, $element, $window ) {

            const ctrl = this;

            // Klasy pomocnicze
            ctrl.classHelpers = {
                componentName: 'intro-banner',
				componentInitialized: 'intro-banner--initialized'
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
