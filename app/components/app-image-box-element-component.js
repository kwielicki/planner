angular
    .module('weddingPlanner')
    .component('appImageBoxElement', {
        templateUrl: 'templates/components/component-image-box-element.html',
        bindings: {
         element: '<'
        },
        controller: function( $scope, $element, $window ) {

            const ctrl = this;

            // Klasy pomocnicze
            ctrl.classHelpers = {
                componentName: 'image-box__element'
            };

            // Dodanie klasy oraz atrybutu na komponent
            ctrl.$onInit = () => {
                $element
                    .addClass(`
                        ${ctrl.classHelpers.componentName}
                    `)
            };

            // Pojedynczy element klikalny
            $scope.elementClickable = function( imageBoxExpectedLinkValue ) {
                $window.location.href = imageBoxExpectedLinkValue;
            }


        }
    })
