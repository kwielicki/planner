weddingPlanner.controller("addNewGuest", function($scope, $firebaseArray, notify) {


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
      guestCount: parseInt($scope.guestCount, 10),
      children: parseInt($scope.children, 10),
      dataAdded: d.getDate() + '-' + d.getMonth() + '-' + d.getUTCFullYear() + ',' + dateFormat(),
      membership: $scope.membership,
      status: $scope.status,
      phoneNumber: parseInt($scope.phoneNumber, 10),
      extraInformation: $scope.extraInformation
    }).then(function(ref) {
                notify({
                    messageTemplate: "\n    <div class=\"notification-header\">\n      <h4 class=\"notification-header__icon\"><i class=\"fa fa-check-circle nav__icon\" aria-hidden=\"true\"></i></h4>\n    </div>\n    <div class=\"notification-body\">\n      <h2 class=\"notification-body__title\"><span>Powodzenie!</span></h2>\n      <p class=\"notification-body__description\"> \n         <strong>" + $scope.firstName + " " + $scope.surName + "</strong>\n         Rekord zosta\u0142 dodany do systemu. Dane zosta\u0142y wprowadzone w spos\xF3b prawid\u0142owy.</p>\n    </div>\n ",
                    position: 'right',
                    classes: 'notification-success',
                    duration: 0
                  });
                $('input').val('');
            }, function(error) {
                notify({
                    messageTemplate: "\n                      <div class=\"notification-header\">\n                        <h4 class=\"notification-header__icon\"><i class=\"fa fa-exclamation-circle nav__icon\" aria-hidden=\"true\"></i></h4>\n                      </div>\n                      <div class=\"notification-body\">\n                        <h2 class=\"notification-body__title\"><span>Oops... wyst\u0105pi\u0142 b\u0142\u0105d!</span></h2>\n                        <p class=\"notification-body__description\"> \n                           <strong>" + $scope.firstName + " " + $scope.surName + "</strong>\n                           Rekord nie zosta\u0142 dodany do systemu. Zweryfikuj poprawno\u015B\u0107 wprowadzonych danych.</p>\n                      </div>\n                    ",
                    position: 'right',
                    classes: 'notification-warning',
                    dration: 0
                  });
            });;

  };

  /* Logika dotycząca pobrania informacji niezbędnych do przeprowadzenia analizy statystycznej */

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
    

      /* 
       * Logika odpowiedzialna za "Liczbę gości"
       * 1 - wszystkich
       * 2 - potwierdzonych
       * 3 - oczekujących
       * 4 - z odmową
       */

        var fullGuestNumbers = parseInt(childData.guestCount, 10);

        //- 1 Liczba wszystkich gości
          arrayFullGuestNumber.push(fullGuestNumbers);
          myFunction($('.statistics__global__numberOfGuest'), arrayFullGuestNumber);

        //- 2,3,4 Liczba gości potwierdzonych / oczekujących / z odmową
          switch (childData.status) {
            case "Potwierdzony":
              arrayFullGuestNumberStatusConfirmed.push(fullGuestNumbers);
              myFunction($('.statistics__global__numberOfGuestConfirmed'), arrayFullGuestNumberStatusConfirmed);
              break;
            case "Oczekujący":
              arrayFullGuestNumberStatusUnconfirmed.push(fullGuestNumbers);
              myFunction($('.statistics__global__numberOfGuestUnconfirmed'), arrayFullGuestNumberStatusUnconfirmed);
              break;
            case "Odmowa":
              arrayFullGuestNumberStatusDeclined.push(fullGuestNumbers);
              myFunction($('.statistics__global__numberOfGuestDeclined'), arrayFullGuestNumberStatusDeclined);
              break;
          }

      /* 
       * Logika odpowiedzialna za "Liczbę dzieci"
       * 1 - wszystkich
       * 2 - ze strony Pani Młodej
       * 3 - ze strony Pana Młodego
       */

        var fullChildrenNumbers = parseInt(childData.children, 10);
        
        //- 2,3 Liczba dzici (od strony pani Młodej, pana Młodego)
          switch (childData.membership) {
            case "Pani Młoda":
              arrayWomenChildrenNumber.push(fullChildrenNumbers);
              myFunction($('.statistics__global__numberOfChildrenWomen'), arrayWomenChildrenNumber);
              break;
            case "Pan Młody":
              arrayManChildrenNumber.push(fullChildrenNumbers);
              myFunction($('.statistics__global__numberOfChildrenMan'), arrayManChildrenNumber);
              break;
            default:

          }

        //- 1 Łączna liczba dzieci
          arrayFullChildrenNumber.push(fullChildrenNumbers);
          myFunction($('.statistics__global__numberOfChildren'), arrayFullChildrenNumber);

       /* 
       * Logika odpowiedzialna za liczbę gości ze strony Pani Młodej oraz Pana Młodego
       * 1 - wszystkich
       * 2 - potwierdzonych
       * 3 - oczekujących
       * 4 - z odmową
       */

      switch (childData.membership) {
        case "Pani Młoda":
          arrayFullGuestNumberWomen.push(fullGuestNumbers);
          myFunction($('.statistics__global__numberOfGuestWomen'), arrayFullGuestNumberWomen);
          switch (childData.status) {
            case "Potwierdzony":
              arrayFullGuestNumberStatusConfirmedWomen.push(fullGuestNumbers);
              myFunction($('.statistics__global__numberOfGuestConfirmedWomen'), arrayFullGuestNumberStatusConfirmedWomen);
              break;
            case "Oczekujący":
              arrayFullGuestNumberStatusUnconfirmedWomen.push(fullGuestNumbers);
              myFunction($('.statistics__global__numberOfGuestUnconfirmedWomen'), arrayFullGuestNumberStatusUnconfirmedWomen);
              break;
            case "Odmowa":
              arrayFullGuestNumberStatusDeclinedWomen.push(fullGuestNumbers);
              myFunction($('.statistics__global__numberOfGuestDeclinedWomen'), arrayFullGuestNumberStatusDeclinedWomen);
              break;
          }
          break;
        case "Pan Młody":
          arrayFullGuestNumberMan.push(fullGuestNumbers);
          myFunction($('.statistics__global__numberOfGuestMan'), arrayFullGuestNumberMan);
          switch (childData.status) {
            case "Potwierdzony":
              arrayFullGuestNumberStatusConfirmedMan.push(fullGuestNumbers);
              myFunction($('.statistics__global__numberOfGuestConfirmedMan'), arrayFullGuestNumberStatusConfirmedMan);
              break;
            case "Oczekujący":
              arrayFullGuestNumberStatusUnconfirmedMan.push(fullGuestNumbers);
              myFunction($('.statistics__global__numberOfGuestUnconfirmedMan'), arrayFullGuestNumberStatusUnconfirmedMan);
              break;
            case "Odmowa":
              arrayFullGuestNumberStatusDeclinedMan.push(fullGuestNumbers);
              myFunction($('.statistics__global__numberOfGuestDeclinedMan'), arrayFullGuestNumberStatusDeclinedMan);
              break;
          }
          break;
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
