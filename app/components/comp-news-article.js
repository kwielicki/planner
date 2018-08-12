angular
    .module('weddingPlanner')
    .component('compNewsArticle', {
        templateUrl: 'templates/components/comp-news-article.html',
        bindings: {
         article: '<'
        },
        controller: function( $scope, $element, $window ) {

            const ctrl = this;

            // Klasy pomocnicze
            ctrl.classHelpers = {
                componentName: 'news__article'
            };

            // Dodanie klasy oraz atrybutu na komponent
            ctrl.$onInit = () => {
                $element
                    .addClass(`
                        ${ctrl.classHelpers.componentName}
                    `)
            };
        }
    })
