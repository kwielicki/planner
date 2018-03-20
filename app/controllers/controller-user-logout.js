/* Controller obsługujący poprawne wylogowanie z aplikacji.
 * Jeśli promise signOut() zostanie rozwiązany poprawnie,
 * następuje przekierowanie zgodnie z ($locationProviderem) na routa
 * który wymaga od użytkownika kompletnej autoryzacji
 */

angular
    .module('weddingPlanner')
    .controller('ctrlUserLogout', function( $scope, $window ) {
        $scope.appSignOut = function() {
            /* @TODO tuż przed wylogowaniem należy zniszczyć wszelkie
             * powiązania do referencyjnych tablic Firebas'a korzystając z
             * metody $destroy(). W innym przypadku, w momencie wylogowywania z widoku
             * na którym jest wykonywana jakakolwiek zależność z bazą występuje błąd:
             * np. Error: permission_denied at /to_do_list_category: Client doesn't have permission to access the desired data.
             * To jest znany błąd nie wpływający na działanie aplikacji.
             */
            firebase.auth().signOut()
                .then(function() {
                    $window.location.href = "/#/login";
                }).catch(function(err) {
                    console.log(err);
                });
        }
    });
