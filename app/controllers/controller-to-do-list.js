weddingPlanner.controller('ctrlToDoList', function( $scope, $firebaseArray ) {

    /* Utworzenie połączenia pomiędzy aplikacją a bazą danych o nazwie
     * to_do_list_category
     */
    const ref = firebase.database().ref().child("to_do_list_category");
    $scope.todoList = $firebaseArray(ref);

    /* Czekamy na spełnienie się obietnicy z todoList
     * Kiedy promise będzie rozwiązany wykonuję metodę once
     * i iteruję po itemach bazy w celu wygenrowania tablicy, która
     * będzie źródłem danych z których skorzysta "Selectize"
     * w celu wygenerowania opcji wyboru.
     */
    $scope.todoList.$loaded()
        .then(function() {

            /* Pusta tablica, czeka na zapełnienie danymi z bazy danych
             * Wymagana jest tablica o określonej strukturze:
             * todoCategoryId - id potrzeby w bazie to_do_list_category,
             * todoCategoryName - nazwa potrzeby (etykieta opcji)
             */
            var todoCategoryArray = [];

            ref.once('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {

                    var todoCategoryId = childSnapshot.key; // ID
                    var todoCategoryName = childSnapshot.val().todoCategoryName; // Nazwa

                    /* Pushuję do tablicy todoCategoryArray obiekty składające się z
                     * - ID kategorii
                     * - nazwy kategorii
                     * Dzięki temu selectize otrzymuje tablicę na kształt:
                     * [{id: id1, name: name1}, {id: id2, name: name2}]
                     */
                    todoCategoryArray.push({
                        id: todoCategoryId,
                        title: todoCategoryName
                    });

                });

                /* Wypełniam opcję w selectize danymi z bazy danych */
                $scope.todoListSelectizeOptions = todoCategoryArray;

                /* Obsługa przypadku, gdy baza danych jest pusta */
                if (!todoCategoryArray.length) {
                    console.log('Baza pusta'); /* @TODO - w przyszłości do usunięcia */

                    /* Jeśli baza danych jest pusta, pokazuję informację co trzeba
                     * zrobić, aby zacząć pracę z todoList
                     */
                    $scope.todoListDatabaseEmpty = true;
                    $scope.preloaderChecker = true;
                } else {
                    console.log('Baza pełna'); /* @TODO - w przyszłości do usunięcia */
                    $scope.preloaderChecker = true;
                }
            });

            /* Kliknięcie w konkretny link */
            $scope.todoListContentEmpty = true;
            $scope.todoListShowContent = function ( currentCategoryID ) {
                $scope.preloaderChecker = true;
                $scope.todoListContentEmpty = false;
                $scope.availableContent = $scope.todoList.$getRecord(currentCategoryID);
            }

        });

    $scope.todoListSelectizeConfig = {
      create: true,
      valueField: 'title',
      labelField: 'title',
      delimiter: '|',
      placeholder: 'Wybierz kategorię...',
      onInitialize: function( selectize ){
          $scope.todoListSelectizeSelected = true;
          $scope.todoCategoryDirty = true;
          $scope.todoCategoryDuplicated = true;

          /* Dodanie kategorii do bazy danych */
          $scope.todoListSelectizeAdd = function() {
              /* Gdy osoba próbuje dodać kategorię, bez jej wyboru rzucam
               * wyjątek i pokazuję stosowny komunikat. A następnie zwracam ten wyjątek
               * i kończę działanie metody.
               */
              if ($scope.todoCategoryName === undefined) {
                  $scope.todoCategoryDirty = false;
                  console.log("Ooops. Kategoria nie została wybrana.")
                  return;
              }
              $scope.todoCategoryDirty = true;

              /* Tutaj jest logika dotycząca pokazywania odpowiednich komunikatów
               * w przypadki kiedy użytkownik próbuje zduplikować kategorię
               * Rzucam wyjątek w postaci komunikatu
               */
              var todoListSelectizeArray = [];
              $scope.todoList.$loaded()
                .then(function() {
                    ref.once('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            var todoCategoryName = childSnapshot.val().todoCategoryName;
                            todoListSelectizeArray.push(todoCategoryName);
                        });

                    });
                    if (!todoListSelectizeArray.includes($scope.todoCategoryName)) {
                        $scope.todoListDatabaseEmpty = false;
                        $scope.todoList.$add({
                            todoCategoryName: $scope.todoCategoryName
                        });
                    } else {
                        $scope.todoCategoryDuplicated = false;
                        console.log("Ooops. Wybrana kategoria - " + "'"+ $scope.todoCategoryName +"' jest używana.")
                    }
                });


          }
      },
      onChange: function ( selectize ) {

      },
      maxItems: 1
    };
});
