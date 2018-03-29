//- Logika logowania do aplikacji
angular
    .module('weddingPlanner')
    .controller('userLogin', ['$scope', '$window', '$localStorage', function( $scope, $window, $localStorage ) {

        $scope.inputType = 'password';
        $scope.loginText = 'Zaloguj się';

        $scope.appSignIn = function( isValid, isError ) {

            /* Dodanie klaski na loginButton */
            $scope.authorizationInit = true;
            $scope.loginText = "Trwa uwierzytelnianie...";

            const dateLoginIn = new Date();

            /*
             * Walidacja z wykorzystaniem ng-submit. Jest to początkowa walidacja,
             * która występuje tylko wówczas, gdy kontrolki
             * - user.name
             * - user.password
             * są puste tj. posiadają klasę ng-invalid
             */

            if ( !isValid ) {

                $scope.firebaseAuthenticatedFailed = true;
                $scope.firebaseErrorMessage = 'Podano niekompletne dane';
                $scope.loginText = "Niepowodzenie. Spróbuj ponownie...";

                if ( isError.email !== undefined ) {
                    if ( !isError.email[0].$valid ) {
                        $scope.firebaseErrorMessage = 'Wprowadź poprawny adres e-mail';
                    }
                }
                $scope.authorizationInit = false;

                /* Jeśli jedna z kontrolek jest błędnie zwalidowana,
                 * zatrzymuję wykonywanie metody logowania tj.
                 * signInWithEmailAndPassword()
                 */
                return;

            } else {


                $scope.user = {
                    email: $scope.user.email,
                    password: $scope.user.password
                };

            }


            //- Firebase nie przeprowadza walidacji adresu email
                firebase.auth().signInWithEmailAndPassword( $scope.user.email, $scope.user.password )
                .then(function(firebaseUser) {

                    $scope.loginText = "Uwierzytelnianie zakończone";
                    /* Kiedy nastąpi uwierzytelnienie, następuje przekierowanie
                     * na dedykowany route
                     */
                    $window.location.href = '/#/dashboard';

                    /*
                     * Dodanie daty ostatniego (poprawnego) zalogowania
                     * Dana zostaje zapisana w localStorage
                     */
                    if (typeof(Storage) !== "undefined") {

                        if ( !$localStorage.lastSuccessedLoginData ) {
                            $localStorage.lastSuccessedLoginData = dateLoginIn;
                        }

                    }
                })
                .catch(function(error) {

                    // W Local storage trzymam również datę ostatniej nieudanej próby logowania
                    $localStorage.lastUnsuccessfulLoginData = dateLoginIn;

                    /* Obsługa błędów mogących występować podczas próby logowania */
                    $scope.firebaseAuthenticatedFailed = true;
                    var errorCode = error.code;


                    if (errorCode === 'auth/wrong-password') {
                        const messageString = 'Podane hasło jest błędne';
                        $scope.firebaseErrorMessage = messageString;
                    }

                    if (errorCode === 'auth/user-not-found') {
                        const messageString = 'Login, który podałeś nie istnieje';
                        $scope.firebaseErrorMessage = messageString;
                    }

                    if (errorCode === 'auth/invalid-email') {
                        const messageString = 'Wprowadź poprawny adres e-mail';
                        $scope.firebaseErrorMessage = messageString;
                    }

                    if (errorCode === 'auth/argument-error') {
                        const messageString = 'Podałeś niekompletne dane';
                        $scope.firebaseErrorMessage = messageString;
                    }

                    if (errorCode === 'auth/user-disabled') {
                        const messageString = `Użytkownik o loginie - ${$scope.user.email} - został zablokowny. Skontaktuj się z administratorem.`;
                        $scope.firebaseErrorMessage = messageString;
                    }

                    $scope.loginText = "Niepowodzenie. Spróbuj ponownie...";
                    $scope.authorizationInit = false;

                    // Aktualizuję scope, m.in. powoduje to poprawne odświeżenie komunikatu walidującego
                    $scope.$apply();
                });
        };

        /*
         * Pokazanie / ukrycie hasła po evencie click
         * Cel - możliwość sprawdzenia poprawności hasła
         */
        $scope.passwordHelperTitleContent = 'Pokaż hasło';
        $scope.passwordHelper = function() {
            if ($scope.inputType === 'password') {
                $scope.inputType = 'text';
                $scope.passwordHelperClassStatus = 'is--activated';
                $scope.passwordHelperTitleContent = 'Ukryj hasło';
            } else if ($scope.inputType === 'text'){
                $scope.inputType = 'password';
                $scope.passwordHelperClassStatus = null;
                $scope.passwordHelperTitleContent = 'Pokaż hasło';
            }
        }

    }]);
