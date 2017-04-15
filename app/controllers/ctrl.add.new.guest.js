weddingPlanner.controller("addNewGuest", function($scope, $firebaseArray) {


  var ref = firebase.database().ref().child("list_of_guest"),
      d = new Date(),
      days = ["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"];


  /* Zbiór funkcji, które odpowiadają za formatowanie daty,
   * która jest przekazywana do modelu bazy danych.
   */
    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    function dateFormat() {
      var d = new Date();
      var x = document.getElementById("demo");
      var h = addZero(d.getHours());
      var m = addZero(d.getMinutes());
      var s = addZero(d.getSeconds());
      return h + ":" + m + ":" + s;
    }

  //- Synchronizujemy obiekt person z tablica firebase
  $scope.persons = $firebaseArray(ref);


  /* Funkcja odpowiadająca za dodanie nowej osoby do bazy danych
   * Dodajemy do bazy takie dane jak:
   * -- fullName w skład którego wchodzą firstName oraz surName
   * -- guestCount odpowiadający za przechowywanie liczby gości
   * -- dataAddeded odpowiadający za przechowywanie datę dodania oraz ew. modyfikacji
   * -- membership odpowiadający za przechowywanie przynależnosci grupowej (pan/pani)
   * -- status odpowiadający za przechowywanie statusu
   * -- phoneNumber odpowiadający za przechowywanie numeru telefonu
   */

  $scope.addNewPerson = function() {
    $scope.persons.$add({
      firstName: $scope.firstName,
      surName: $scope.surName,
      guestCount: $scope.guestCount,
      children: $scope.children,
      dataAdded: d.getDate() + '-' + d.getMonth() + '-' + d.getUTCFullYear() + ',' + dateFormat(),
      membership: $scope.membership,
      status: $scope.status,
      phoneNumber: $scope.phoneNumber,
      extraInformation: $scope.extraInformation
    });
    $('input').val('');

  };


  /* Funkcja odpowiadająca za Usunięcie zadanej osoby z bazy danych */
  $scope.removeIt = function(person) {
    $scope.persons.$remove(person);
    $(document).ready(function(){
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
    });
  }

  /* Funkcja odpowiadająca za edycja zadanej osoby w bazie danych */
  $scope.saveIt = function(person) {
    $scope.persons.$save(person);
    $(document).ready(function(){
        $('.modal-backdrop').remove();
    });
  }


});


weddingPlanner.controller('changePath', ['$scope', '$location',function($scope, $location){
  $scope.go = function (hash) {
    $location.path(hash);
    console.log($location.path(hash));
   }
 }]);
