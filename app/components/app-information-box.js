angular
    .module('weddingPlanner')
    .component('appInformationBox', {
        templateUrl: 'templates/components/component-information-box.html',
        transclude: {
            'content': '?informationBoxContent'
        },
        bindings: {
		 informationBoxContent: '@'
        },
        controller: function( $scope, $element, $window ) {

            const ctrl = this;

            // Klasy pomocnicze
            ctrl.classHelpers = {
                componentName: 'information-box',
				componentInitialized: 'information-box--initialized'
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
