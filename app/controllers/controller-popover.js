/*
 * Kontroler zarządzający komponentem popover
 */
angular
    .module('weddingPlanner')
    .controller('controllerPopover', ['$scope', '$http' , '$sce', function( $scope, $http, $sce, element ) {

        /* Korzystam z serwisu $http i metodą get pobieram wymagany URL
         * pod którym znajduje się HTML, który zawiera elementy popovera
         */
        $http({
            url: 'templates/components/component-popover.html',
            method: 'GET'
          }).then(function successCallback(response) {

            /* Korzystam z serwisu $sce i ustalam, że jest on bezpiecznym URL'em */
            const popoverTemplateUrl = $sce.trustAsUrl(response.config.url);

            const newElement = angular.element("<div class='popover--overlay'></div>");

            $scope.$watch('displayMode', function(value) {
                switch(value) {
                    case 'mobile':
                        angular.element(document).find('body').append(newElement);
                        break;
                    default:
                        angular.element(newElement).remove();
                        break;
                }
            });

            /* Zadaniem metody appPopoverInit jest otworzenie popovera po clicku */
            $scope.appPopoverInit = function ( event ) {

                angular.element(newElement).addClass('is--activated');


                /* Zmienna popoverContent przechowuje "stringa" z atrybutu data-popover content
                 * @TODO: dodać atrybut, który da możliwość przekazania HTML'a.
                */
                const popoverContent = event.currentTarget.attributes['data-popover-content'].nodeValue;

                /* W appPopover przekazuję link do templatki, dane z powyższego atrybutu oraz ustawian flage
                 * open na true -> wyzwala popover
                 */
                $scope.appPopover = {
                    templateUrl: $sce.valueOf(popoverTemplateUrl),
                    content: popoverContent,
                    open: true
                };
            };

            /* W templatce znajduje się przycisk, który powoduje zamknięcie popovera
             * Zarówno w metodzie zamykającej jak i otwierającej popover korzystam z dyrektywy
             * "popover-is-open", która zwraca "true lub false". Dzięki niej działa customowy wyzwalacz.
             * Powodem takiego zastosowania, jest brak możliwości przekazania dowolnego contentu
             * oraz dodania przycisku zamykającego do templatki
             *
             * Uwaga!
             * Zarówno templateUrl jak i content jest wymagany. W innym wypadku w momencie zamknięcia
             * występuje "przeskok wysokości okna", ponieważ Popover jest pusty. Efekt ten występuje,
             * kiedy popover otwieram/zamykam korzystając z animacji fadeIn/fadeOut
             */
            $scope.popoverClose = function() {
                $scope.appPopover = {
                    open: false,
                    templateUrl: $sce.valueOf(popoverTemplateUrl),
                    content: $scope.appPopover.content
                };

                angular.element(newElement)
                    .removeClass('is--activated')
            };

          });
    }]);
