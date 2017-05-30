weddingPlanner.controller('pageHeader', [ '$scope', function ( $scope ) {
    $scope.pageHeader = {
        title: {
            "dashboard": "Panel główny",
            "addNewGuest": "Dodaj nowego gościa",
            "manageGuests": "Zarządzaj listą gości",
            "errorPage": "Strona nie istnieje",
            "documentation": "Dokumentacja",
            "statistics": "Statystyki",
            "error": "Bez paniki"
        },
        subtitle: {
            "addNewGuest": "Korzystając z poniższego formularza, wypełnij niezbędne dane, aby dodać gościa do bazy danych. Pamiętaj, że w każdej chwili po dodaniu go do bazy będziesz w stanie nanieść konieczne modyfikacje",
            "manageGuests": "Korzystając z poniższego formularza, wypełnij niezbędne dane, aby dodać gościa do bazy danych. Pamiętaj, że w każdej chwili po dodaniu go do bazy będziesz w stanie nanieść konieczne modyfikacje",
            "dashboard": "Wybierz interesujący Cię widok i skorzystaj z jego funkcji. Poniżej znajdziesz dostępne moduły.",
            "documentation": "Znajdziesz tutaj informacje na temat zmian, które zostały wprowadzone podczas wydania nowej wersji aplikacji",
            "statistics": "ogólne oraz spersonalizowane",
            "error": "Jeszcze nie popsułeś internetu."
        },
        description: {
            "error": "Niestety, strona o podanym adresie nie została odnaleziona."
        }
    }

}]);
