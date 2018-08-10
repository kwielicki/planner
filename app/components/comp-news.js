angular
    .module('weddingPlanner')
    .component('compNews', {
        templateUrl: 'templates/components/comp-news.html',
        controller: function( $scope, $element, $http, $rootScope ) {

            const ctrl = this;

            // Klasy pomocnicze
            ctrl.classHelpers = {
                componentName: 'news',
				componentInitialized: 'news--initialized'
            };

            // Dodanie klasy oraz atrybutu na komponent
            ctrl.$onInit = () => {
                $element
                    .addClass(`
                        ${ctrl.classHelpers.componentName}
						${ctrl.classHelpers.componentInitialized}
                    `)
					.attr('data-component-name', ctrl.classHelpers.componentName);

                /* Etykieta dla listy z byborem kategorii */
                ctrl.categoryLabel = "Wybrana kategoria:";

                /* Wykorzystanie API https://newsapi.org/s/poland-news-api */
                /* Dostępne kategorie newsów */
                ctrl.newsCategory = [
                    {label: 'Ogólne', value: 'general'},
                    {label: 'Biznes', value: 'business'},
                    {label: 'Rozrywka', value: 'entertainment'},
                    {label: 'Zdrowie', value: 'health'},
                    {label: 'Nauka', value: 'science'},
                    {label: 'Sport', value: 'sports'},
                    {label: 'Technologia', value: 'technology'},
                ];

                // Kategoria ::Ogólne:: ustawiona została jako domyślna
                ctrl.selectedNewsCategory = ctrl.newsCategory[0].label;

                /* Zapytanie o listę newsów w innej kategorii */
                ctrl.changeNewsCategory = function(category) {
                    ctrl.getNews(_, category.value);
                    ctrl.selectedNewsCategory = category.label;
                }

                /* Zapytanie po listę z artykułami */
                ctrl.getNews = function (httpRequestCountry = 'pl', httpRequestCategory = 'general') {
                    $http({
                        method: 'GET',
                        url: `https://newsapi.org/v2/top-headlines?country=${httpRequestCountry}&category=${httpRequestCategory}&apiKey=d166dcd861194b818e8660ce5a318e7f`
                    }).then(function(response) {
                        ctrl.topHeadLinesArticles = response.data.articles;
                    });
                }
                ctrl.getNews();

                ctrl.openedMaterialDropdown = function(open) {
                    /* open to typ boolean
                     * - zwraca true, gdy menu jest otworzone
                     * - zwraca false, gdy menu jest zamknięte
                     */
                    if ( open === true ) {
                        ctrl.isOpen = true;
                    } else {
                        ctrl.isOpen = false;
                    }
                }

            };

        }
    })
