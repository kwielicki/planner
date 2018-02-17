/* Controller obsługujący poprawne wylogowanie z aplikacji.
 * Jeśli promise signOut() zostanie rozwiązany poprawnie,
 * następuje przekierowanie zgodnie z ($locationProviderem) na routa
 * który wymaga od użytkownika kompletnej autoryzacji
 */

weddingPlanner.controller('ctrlUserLogout', function( $scope, $window ) {
    $scope.appSignOut = function() {
        firebase.auth().signOut()
            .then(function() {
                $window.location.href = "/#/login";
            });
    }
});
