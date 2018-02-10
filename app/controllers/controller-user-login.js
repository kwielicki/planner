//- Logika logowania do aplikacji
weddingPlanner.controller('userLogin', ['$scope', function($scope) {

    $scope.inputType = 'password';
    $scope.appSignIn = function() {
        const email    = $scope.email;
        const password = $scope.password;

        if ((email === undefined || email === '') && (password === undefined || password === '')) {
            const messageString = 'Podano niekompletne dane';
            document.getElementById('error-message').innerHTML = messageString;
        }

        //- Firebase nie przeprowadza walidacji adresu email
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(firebaseUser) {
                if (typeof(Storage) !== "undefined") {
                    const dateLoginIn = new Date(),
                          dateStringTime = dateLoginIn.toDateString(),
                          dataLocalTime  = dateLoginIn.toLocaleTimeString();
                    if (!localStorage.getItem('lastsucceslogin')) {
                        localStorage.setItem("lastsucceslogin", dateLoginIn.getDate() + '-' + ('0'+(dateLoginIn.getMonth()+1)).slice(-2) + '-' + dateLoginIn.getUTCFullYear());
                    }
                    document.getElementById('last-success-login').innerHTML = localStorage.getItem('lastsucceslogin');
                }
            })
            .catch(function(error) {
                /* Obsługa błędów mogących występować podczas próby logowania */
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode)
                if (errorCode === 'auth/wrong-password') {
                    const messageString = 'Podane hasło jest błędne';
                    document.getElementById('error-message').innerHTML = messageString;
                }

                if (errorCode === 'auth/user-not-found') {
                    const messageString = 'Login, który podałeś nie istnieje';
                    document.getElementById('error-message').innerHTML = messageString;
                }

                if (errorCode === 'auth/invalid-email') {
                    const messageString = 'Wprowadź poprawny adres e-mail';
                    document.getElementById('error-message').innerHTML = messageString;
                }

                if (errorCode === 'auth/argument-error') {
                    const messageString = 'Podałeś niekompletne dane';
                    document.getElementById('error-message').innerHTML = messageString;
                }

            });

    };

    /*
     * Pokazanie / ukrycie hasła po evencie
     * mouseenter oraz mouseleave
     * Cel - możliwość sprawdzenia poprawności hasła
     */
    $scope.passwordHelper = function() {
        if ($scope.inputType === 'password') {
            $scope.inputType = 'text';
        } else if ($scope.inputType === 'text'){
            $scope.inputType = 'password';
        }
    }

}]);
