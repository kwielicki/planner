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

  /* Logika dotycząca pobrania informacji niezbędnych do przeprowadzenia analizay statystycznej */

var arrayFullGuestNumber = [],
    arrayFullGuestNumberStatusConfirmed = [],
    arrayFullGuestNumberStatusUnconfirmed = [],
    arrayFullGuestNumberStatusDeclined = [];

var arrayFullChildrenNumber = [],
    arrayWomenChildrenNumber = [],
    arrayManChildrenNumber = [];

var arrayFullGuestNumberWomen = [],
    arrayFullGuestNumberStatusConfirmedWomen = [],
    arrayFullGuestNumberStatusUnconfirmedWomen = [],
    arrayFullGuestNumberStatusDeclinedWomen = [];

var arrayFullGuestNumberMan = [],
    arrayFullGuestNumberStatusConfirmedMan = [],
    arrayFullGuestNumberStatusUnconfirmedMan = [],
    arrayFullGuestNumberStatusDeclinedMan = [];

function getSum(total, num) {
    return total + num;
}

function myFunction(item, arrayName) {
    item.text(arrayName.reduce(getSum));
}

ref.once('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    
      // Pobieramy dane dotyczące liczby gości
      var fullGuestNumbers = childData.guestCount;

      // Lista wszystkich gości
      arrayFullGuestNumber.push(fullGuestNumbers);
      myFunction($('.statistics__global__numberOfGuest'), arrayFullGuestNumber);

      // Liczba gości potwierdzonych / oczekujących / z odmową (całkowity zbiór)
      if (childData.status === "Potwierdzony") {
        arrayFullGuestNumberStatusConfirmed.push(fullGuestNumbers);
        myFunction($('.statistics__global__numberOfGuestConfirmed'), arrayFullGuestNumberStatusConfirmed);
      } else if (childData.status === "Oczekujący") {
        arrayFullGuestNumberStatusUnconfirmed.push(fullGuestNumbers);
        myFunction($('.statistics__global__numberOfGuestUnconfirmed'), arrayFullGuestNumberStatusUnconfirmed);
      } else {
        arrayFullGuestNumberStatusDeclined.push(fullGuestNumbers);
        myFunction($('.statistics__global__numberOfGuestDeclined'), arrayFullGuestNumberStatusDeclined);
      }

      /* Szacowanie liczby dzieci
       * a - wszystkie
       * b - ze strony Pani Młodej
       * c - ze strony Pana Młodego
       */
        var fullChildrenNumbers = childData.children;
        //- a (wszystkie)
        arrayFullChildrenNumber.push(fullChildrenNumbers);
        myFunction($('.statistics__global__numberOfChildren'), arrayFullChildrenNumber);

        //- b (ze strony Pani Młodej)
        if (childData.membership === "Pani Młoda") {
          arrayWomenChildrenNumber.push(fullChildrenNumbers);
          myFunction($('.statistics__global__numberOfChildrenWomen'), arrayFullChildrenNumber);
        }

        //- c (ze strony Pana Młodego)
        if (childData.membership === "Pan Młody") {
          arrayManChildrenNumber.push(fullChildrenNumbers);
          myFunction($('.statistics__global__numberOfChildrenMan'), arrayFullChildrenNumber);
        }

      // Liczba gości potwierdzonych / oczekujących / z odmową (zbiór Pani Młodej)
      if (childData.membership === "Pani Młoda") {
        arrayFullGuestNumberWomen.push(fullGuestNumbers);
        myFunction($('.statistics__global__numberOfGuestWomen'), arrayFullGuestNumberWomen);
      }
      if (childData.membership === "Pani Młoda" && childData.status === "Potwierdzony") {
        arrayFullGuestNumberStatusConfirmedWomen.push(fullGuestNumbers);
        myFunction($('.statistics__global__numberOfGuestConfirmedWomen'), arrayFullGuestNumberStatusConfirmedWomen);
      } else if (childData.membership === "Pani Młoda" && childData.status === "Oczekujący") {
        arrayFullGuestNumberStatusUnconfirmedWomen.push(fullGuestNumbers);
        myFunction($('.statistics__global__numberOfGuestUnconfirmedWomen'), arrayFullGuestNumberStatusUnconfirmedWomen);
      } else if (childData.membership === "Pani Młoda" && childData.status === "Odmowa") {
        arrayFullGuestNumberStatusDeclinedWomen.push(fullGuestNumbers);
        myFunction($('.statistics__global__numberOfGuestDeclinedWomen'), arrayFullGuestNumberStatusDeclinedWomen);
      } else if (childData.membership === "Pan Młody" && childData.status === "Potwierdzony") {
        arrayFullGuestNumberStatusConfirmedMan.push(fullGuestNumbers);
        myFunction($('.statistics__global__numberOfGuestConfirmedMan'), arrayFullGuestNumberStatusConfirmedMan);
      } else if (childData.membership === "Pan Młody" && childData.status === "Oczekujący") {
        arrayFullGuestNumberStatusUnconfirmedMan.push(fullGuestNumbers);
        myFunction($('.statistics__global__numberOfGuestUnconfirmedMan'), arrayFullGuestNumberStatusUnconfirmedMan);
      } else if (childData.membership === "Pan Młody" && childData.status === "Odmowa") {
        arrayFullGuestNumberStatusDeclinedMan.push(fullGuestNumbers);
        myFunction($('.statistics__global__numberOfGuestDeclinedMan'), arrayFullGuestNumberStatusDeclinedMan);
      }

      // Liczba gości potwierdzonych / oczekujących / z odmową (zbiór Pana Młodego)
      if (childData.membership === "Pan Młody") {
        arrayFullGuestNumberMan.push(fullGuestNumbers);
        myFunction($('.statistics__global__numberOfGuestMan'), arrayFullGuestNumberMan);
      }


  });
});;

       


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
