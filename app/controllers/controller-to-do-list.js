angular
    .module('weddingPlanner')
    .controller('ctrlToDoList', function( $scope, $firebaseArray, Auth, $rootScope ) {

        /* Utworzenie połączenia pomiędzy aplikacją a tabelami w bazie danych o nazwach
         * 1 - to_do_list_category
         * 2 - to_do_list_note
         */

         $scope.isPlannerCardActivated = false;


        // 1 - to_do_list_category
        const ref = firebase.database().ref().child("to_do_list_category");
        $scope.todoList = $firebaseArray(ref);

        // 2- to_do_list_note
        const refListNote = firebase.database().ref().child("to_do_list_note");
        $scope.todoNoteList = $firebaseArray(refListNote);

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
                 * Tablica wypełniona poniższymi danymi, to tak naprawdę "defaultowe" dane,
                 * które sugeruję użytkownikowi jako trafne kategorii których oczekuje
                 */
                var todoCategoryArray = [
                    {
                        id: 1,
                        title: "Zakupy"
                    }, {
                        id: 2,
                        title: "Wieczór panieński"
                    }, {
                        id: 3,
                        title: "Wizyta u fryzjera"
                    }
                ];

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

                    /* Uzupełniam selectize o kolejne dane, które dodał użytkownik
                     * @TODO do zaimplementowania obsługa dodawania / edycji nazwy kategorii,
                     * @TODO należy mieć na uwadzę referencyjność dwóch wyżej wymienionych tablic
                     * @TODO podczas interakcji z kategorią narazy uaktualnić wymagane notatki
                     */
                    $scope.todoListSelectizeOptions = todoCategoryArray;

                    /* Obsługa przypadku, gdy baza danych jest pusta */
                    if (!$scope.todoList.length) {

                        /* Korzystając z dyrektywy ng-show="todoListDatabaseEmpty" pokazuję komunikat jeśli aplikacja
                         * nie posiada żadnej dostępnej kategorii.
                         * Użytkownik jest zobowiązany do utworzenia kategorii w celu wygenerowania notatki
                         */
                        $scope.todoListDatabaseEmpty = true;

                        /* Korzystając z dyrektywy ng-class="preloaderChecker" do momentu pełnego załadowania się danych z bazy
                         * nakładam przy pomocy CSS maskę, która sprawia UX'owe wrażenie zaczytywania danych z bazy
                         */
                        $scope.preloaderChecker = true;

                    } else {

                        /* Kiedy nastąpi zakończenie komnikacji pomiędzy bazą a aplikacją maska CSS'owa zostaje ukryta,
                         * poprzez usunięcie klasy o nazwie "is--loaded"
                         */
                        $scope.preloaderChecker = true;
                    }
                });


                /* Logika dotycząca obsługi panelu zarządzającego pokazywaniem / ukrywaniem
                 * poszczególnych notatek zawartych w ramach danej kategorii.
                 */

                    // Ukrywam kontrolkę do dodawania notatek, jeśli żadna kategoria nie została wybrana
                    $scope.todoListContentEmpty = true;

                    /* Tablica do której pushuję obiekty pobrane z firebase
                     * aby potem przefiltrować po nich w ng-repeat
                     */
                    var dynamicalArrayWithCurrentNotes = [];


                $scope.todoListShowContent = function ( currentCategoryID ) {

                    /* Podczas wyboru kategorii, ustawiam filtrowanie notatek na Domyślne
                     * od najnowszych do najstarszych, resetuję również element aktywny z dropdown filtrowania
                     */
                    $scope.propertyName = '-timestamp';
                    $rootScope.actuallySelectedToDoFilter = 'Filtruj notatki';
                    $rootScope.actuallySelected = false;
                    $rootScope.actuallySelectedLabelForToDoFilter = false;



                    /* Tablica, która zostanie wypełniona notakami, przyporządkowanymi
                     * do wybranej Kategorii
                     */
                    dynamicalArrayWithCurrentNotes = [];

                    /* Propertisy odpowiedzialne za:
                     * - pokazanie preloadera
                     * - pokazanie informacji o braku kategorii, notatek
                     */
                    $scope.preloaderChecker = true;
                    $scope.todoListContentNoteAvailable = true;
                    $scope.todoListContentEmpty = false;


                    /*
                     * @TODO Opisać co tutaj się wyprawia.
                     */
                    $scope.availableContent = $scope.todoList.$getRecord(currentCategoryID);
                    refListNote.once('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            if (childSnapshot.val().assignedCategoryID === $scope.availableContent.$id) {
                                $scope.xs = $scope.todoNoteList.$getRecord(childSnapshot.key);
                                dynamicalArrayWithCurrentNotes.push($scope.xs);
                            }
                        })
                    });

                    if (dynamicalArrayWithCurrentNotes.length > 0) {

                        $scope.todoListContentNoteEmpty = false;
                        $scope.isPlannerCardActivated = true;
                    } else {
                        $scope.todoListContentNoteEmpty = true;
                        $scope.isPlannerCardActivated = false;
                    }
                    $scope.dynamicalArrayWithCurrentNotes = dynamicalArrayWithCurrentNotes;
                };

                /* Dodanie notatki i przyporządkowanie jej do odpowiedniej kategorii */
                $scope.todoListAddNote = function( currentCategoryID ) {
                    $scope.preloaderChecker = false;
                    $scope.todoNoteList.$add({
                        assignedCategoryID: currentCategoryID,
                        assignedCategoryName: $scope.todoList.$getRecord(currentCategoryID).todoCategoryName,
                        noteTitle: $scope.noteTitle ,
                        noteDescription: $scope.noteDescription,
                        noteAuthor: Auth.$getAuth().email,
                        noteStatus: {
                            name: $scope.noteStatus.noteNamePriority,
                            value: $scope.noteStatus.noteValuePriority
                        },
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    }).then(function( ref ) {

                        /* Po dodaniu kolejnej notatki do zadanej kategorii, uaktualniam wcześniej przygotowaną tablicę
                         * o kolejny object o id ref
                         */
                        var currentAddidingElement = $scope.todoNoteList.$getRecord(ref.key);

                        dynamicalArrayWithCurrentNotes.push(currentAddidingElement);
                        $scope.dynamicalArrayWithCurrentNotes = dynamicalArrayWithCurrentNotes;
                        $scope.preloaderChecker = true;
                    });
                }

                /* Obserwuję zmiany podczas wypełniania wymaganych kontrolek dla notatek
                 * Title
                 * Description
                 * Status - jest selectem
                 * Option przyjmuje postać '{"noteValuePriority": number, "noteNamePriority": string}'
                 * Następnie krzystam z metody angular.fromJson, aby przygotować obiekt, który dodam do firebase
                 * - noteValuePriority > zostanie wykorzystane do sortowania według priorytetów
                 * - noteNamePriority > zostanie użyte do przekazania odpowiedniej klasy na komponent card
                 *   co umożliwi wyświetlenie odpowiedniej belki sygnalizującej priorytet
                 * @TODO dodać timestamp serwerowy (skorzystać z API angularFire)
                */
                $scope.observable = {
                    title: "",
                    description: "",
                    status: '{"noteValuePriority": 1, "noteNamePriority": "noteNeutralPriority"}'
                };

                /* Funkcja wykonywana na 3 różnych kontrolkach
                 * - kontrolka tytułu notatki
                 * - kontrolka opisu notatki
                 * - kontrolka statusu notatki
                 * - takie informacje jak: kategoria, autor - są dodowane dynamicznie
                 */
                $scope.noteControlObservable = function() {
                    $scope.noteTitle       = $scope.observable.title;
                    $scope.noteDescription = $scope.observable.description;
                    $scope.noteStatus      = angular.fromJson($scope.observable.status);
                }


            });

        /* Akcja odpowiedzialna za dodanie kategorii do todoLisy */
        $scope.todoListSelectizeConfig = {
          create: true,
          valueField: 'title',
          labelField: 'title',
          delimiter: '|',
          placeholder: 'Wybierz lub dodaj nową kategorię',
          onInitialize: function(){
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
                                var todoCategoryName = (childSnapshot.val().todoCategoryName).toLowerCase();
                                todoListSelectizeArray.push(todoCategoryName);
                            });

                        });
                        if (!todoListSelectizeArray.includes(($scope.todoCategoryName).toLowerCase())) {
                            $scope.todoListDatabaseEmpty = false;
                            $scope.todoList.$add({
                                todoCategoryName: $scope.todoCategoryName
                            });
                        } else {
                            $scope.todoCategoryDuplicated = false;
                        }
                    });


              }
          },
          onChange: function () {
              if ($scope.todoCategoryName === undefined) {
                  $scope.todoCategoryDuplicated = true;
              }
          },
          maxItems: 1,
          render: {
              option_create: function ( data ) {
                  return '<div class="create app-selectize__newcat">Dodaję kategorię: <strong>' + data.input + '</strong>&hellip;</div>';
              }
            }
        };


        /* Dodanie pomocniczej klasy na aktywny element
         * w widget "Dostępne kategorie"
         */
        $scope.selected = null;
        $scope.activeItem   = function( index ) {
           $scope.selected  = index;
        };

        /* Properties */

            // Widget Kategorii
            $scope.categoryWidgetHeader = "Stwórz kategorię lub wybierz już istniejącą, a następnie wygeneruj dla niej notatkę.";

    });
