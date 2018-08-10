angular
    .module('weddingPlanner')
    .component('appImageBox', {
        templateUrl: 'templates/components/component-image-box.html',
        controller: function( $scope, $element, $window ) {

            const ctrl = this;

            // Konfiguracja komponentu <app-image-box/>

            ctrl.classHelpers = {
                componentName: 'image-box',
                componentInitialized: 'image-box--initialized'
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

            ctrl.imageBoxElements = [
                {
                    id: 0,
                    imageBoxSrc: 'assets/images/image-box-1.jpg',
                    imageBoxAlt: 'Administruj listą gości',
                    imageBoxTitle: 'Administruj listą gości',
                    imageBoxDescription: 'Moduł ten jest głownym zarządcą Twojej listy gości. Z jego poziomu możesz aktualizować listę gości',
                    imageBoxLinkLabel: 'Zobacz listę gości',
                    imageBoxLinkValue: '#/manage-guests',
                    imageBoxCssClass: 'image-box--managing'
                }, {
                    id: 1,
                    imageBoxSrc: 'assets/images/image-box-2.jpg',
                    imageBoxAlt: 'Dodaj gościa',
                    imageBoxTitle: 'Dodaj gościa',
                    imageBoxDescription: 'Korzystając z przygotowanego formularza dodaj osobę do wedding plannera',
                    imageBoxLinkLabel: 'Dodaj nowego gościa',
                    imageBoxLinkValue: '#/add-new-guest',
                    imageBoxCssClass: 'image-box--addiding'
                }, {
                    id: 3,
                    imageBoxSrc: 'assets/images/image-box-3.jpg',
                    imageBoxAlt: 'Statystyki',
                    imageBoxTitle: 'Statystyki',
                    imageBoxDescription: 'Sprawdź jak wyglądają aktualne statystyki ogólne, lub z podziałem na panią oraz pana młodego',
                    imageBoxLinkLabel: 'Sprawdź statystyki',
                    imageBoxLinkValue: '#/statistics',
                    imageBoxCssClass: 'image-box--statistics'
                }, {
                    id: 4,
                    imageBoxSrc: 'assets/images/image-box-4.jpg',
                    imageBoxAlt: 'Dokumentacja',
                    imageBoxTitle: 'Dokumentacja',
                    imageBoxDescription: 'Zapoznaj się ze dokumentacją w której znajdziesz szczegółowy opis dostępnych funkcjonalności',
                    imageBoxLinkLabel: 'Przejdź do dokumentacji',
                    imageBoxLinkValue: '#/documentation',
                    imageBoxCssClass: 'image-box--documentation'
                }, {
                    id: 5,
                    imageBoxSrc: 'assets/images/image-box-5.jpg',
                    imageBoxAlt: 'Notatnik',
                    imageBoxTitle: 'Notatnik',
                    imageBoxDescription: 'Korzystając z kategorii zarządzaj notatkami, które ułatwią Ci proces przygotowań do ślubu',
                    imageBoxLinkLabel: 'Przejdź do notatek',
                    imageBoxLinkValue: '#/wedding-notebook',
                    imageBoxCssClass: 'image-box--wedding-notebook'
                }, {
                    id: 6,
                    imageBoxSrc: 'assets/images/image-box-6.jpg',
                    imageBoxAlt: 'Lista rzeczy do zrobienia',
                    imageBoxTitle: 'Lista rzeczy do zrobienia',
                    imageBoxDescription: 'Zorganizuj się. Zanim wszystko poukładasz, musisz wiedzieć, co w ogóle masz do zrobienia',
                    imageBoxLinkLabel: 'Przygotuj listę',
                    imageBoxLinkValue: '#/todo-list',
                    imageBoxCssClass: 'image-box--todolist',
                    imageBoxIsNewest: {
                        value: true,
                        label: "Nowość"
                    }
                }, {
                    id: 7,
                    imageBoxSrc: 'assets/images/image-box-7.jpg',
                    imageBoxAlt: 'Zarządzaj wydatkami',
                    imageBoxTitle: 'Zarządzaj wydatkami',
                    imageBoxDescription: 'Moduł udostępniający narzędzia służące do analizy wydatków związanych z planowaniem wesela',
                    imageBoxLinkLabel: 'W trakcie realizacji...',
                    imageBoxLinkValue: '#/dashboard',
                    imageBoxCssClass: 'image-box--expenses',
                }, {
                    id: 8,
                    imageBoxSrc: 'assets/images/image-box-8.jpg',
                    imageBoxAlt: 'Aktualności',
                    imageBoxTitle: 'Aktualności',
                    imageBoxDescription: 'Sprawdź co ciekawego dzieje się wokół Ciebie. Moduł udostępnia ciekawe artykuły podzielone na kategorie',
                    imageBoxLinkLabel: 'Przeczytaj',
                    imageBoxLinkValue: '#/news'
                }
            ];

        }
    })
