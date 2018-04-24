angular
    .module('weddingPlanner')
    .controller('pageHeader', [ '$scope', function ( $scope ) {
        $scope.pageHeader = {
            title: {
                "errorPage": "Strona nie istnieje",
                "error": "Bez paniki",
                "userProfile": "Profil użytkownika"
            },
            subtitle: {
                "documentation": "Znajdziesz tutaj informacje na temat zmian, które zostały wprowadzone podczas wydania nowej wersji aplikacji",
                "error": "Jeszcze nie popsułeś internetu."
            },
            description: {
                "error": "Niestety, strona o podanym adresie nie została odnaleziona."
            }
        }

    }]);
