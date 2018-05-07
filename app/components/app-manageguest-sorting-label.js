angular
    .module('weddingPlanner')
    .component('appManageGuestSortingLabel', {
        templateUrl: 'templates/components/component-manageguest-sorting-label.html',
        controller: function( $scope, $element, $rootScope ) {

            const ctrl = this;
            
            $scope.manageTableFiltered = false;

            $scope.$watchCollection('[$root.plannerGlobal.manageGuestCurrentSortingLabel, $root.plannerGlobal.manageGuestCurrentSortingOrder]', function(oldValue, newValue) {

                if ( oldValue[0] !== undefined ) {
                    $scope.manageTableFiltered = true;
                }

                $scope.currentSortingLabel = $rootScope.plannerGlobal.manageGuestCurrentSortingLabel;
                $scope.currentSortingOrder = $rootScope.plannerGlobal.manageGuestCurrentSortingOrder;

            });

            // Klasy pomocnicze
            ctrl.classHelpers = {
                componentName: 'manageguest-sorting-label',
				componentInitialized: 'manageguest-sorting-label--initialized'
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
