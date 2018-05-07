angular
    .module('weddingPlanner')
    .component('userProfile', {
        templateUrl: 'templates/components/component-user-profile.html',
        controller: function ( $scope, $timeout ) {

            var storage = firebase.storage();
            var storageRefDirecory = storage.ref();
            var storageImagesRefenrece = storageRefDirecory.child('user-images/user-photo.png');
            var user = firebase.auth().currentUser;
            $scope.userProfileSrcSelected = true;


            var metadata = {
              contentType: 'image/png',
              customMetadata: {
                cacheControl: 'public,max-age=300'
              }
            };


            $scope.userprofileSrc = '';

            // Zabawy z obrazkami
            $scope.fileNameGetter = function (  photoElement ) {

                const fileElement = angular.element('#fileUploader');

                var file        = photoElement.files,
                    fileObject  = file[0],
                    fileBlobUrl = window.URL.createObjectURL(fileObject);


                if ( fileObject.type === "image/png" || fileObject.type === "image/jpeg" ) {

                    $scope.fileObject = fileObject;
                    
                    $scope.$apply(function(){
                      $scope.currentUserProfileImage = fileBlobUrl;
                   });

                } 

                

            };

            /* Przenieść warunek dot. usera na samą górę */
            if ( user !== null ) {

                user.providerData.forEach(function (profile) {
                    /* Pobranie odpowiednich danych z firebase i wypełnienie nimi modelu */
                    const userProfileFullName = profile.displayName.split(' ');
                    $scope.userProfile = {
                        firstname: userProfileFullName[0], // firstName
                        surname: userProfileFullName[1] // surName
                    };


                    $scope.currentUserProfileImage  = profile.photoURL;


                    $scope.userProfileName = function( userProfileFirstName, userProfileSurName) {

                        /* Aktualizacja profilu użytkownika o takie dane jak:
                         * - imię,
                         * - nazwisko
                         */

                        $scope.userProfile = {
                            firstname: userProfileFirstName,
                            surname: userProfileSurName
                        };


                        /* Korzystając z metody equals porównuję dwa stringi. Metoda ta zwraca boolean 
                         * Porównuje obiekt user i jego właściwość displayName, które pochodzą z bazy
                         * z tym co użytkownik aktualnie wpisał do kontrolek znajdujących się w profilu
                         * użytkownika tj. imię oraz nazwisko
                         */
                        if ( angular.equals(user.displayName,`${userProfileFirstName} ${userProfileSurName}`) ) {
                            $scope.result = "Dane profilowe są aktualne";
                            $timeout( function(){
                                $scope.result = "";
                            }, 1000 );
                        } else {
                            $scope.result = "Trwa aktualizacja profilu...";
                            user.updateProfile({
                                displayName: `${userProfileFirstName} ${userProfileSurName}`
                            }).then( function() {
                                $scope.$apply(function(){
                                    $scope.result = "Profil zaktualizowany";
                                    $timeout( function(){
                                        $scope.result = "";
                                    }, 1000 );
                                });
                            }).catch( function( error ) {
                                console.log( error );
                            });
                        }



                        

                        /* Pełna obsługa przesyłu grafiki do firebase storage */
                        const fileElement = angular.element('#fileUploader');
                        if ( fileElement.val() != '' ) {
                            
                            const userProfileUploadePhoto = storageImagesRefenrece.put($scope.fileObject, metadata);

                            userProfileUploadePhoto.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
        

                                $scope.$apply(function(){
                                    $scope.userProfileUploadProgress = snapshot.bytesTransferred / snapshot.totalBytes;
                                    $scope.userProfileUploadedInit   = true;
                                    $scope.dynamic = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                });

                                switch (snapshot.state) {
                                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                                        console.log('Upload is paused');
                                        break;
                                    case firebase.storage.TaskState.RUNNING: // or 'running'
                                        console.log('Upload is running');
                                        break;
                                }

                            }, function(error) {

                                // A full list of error codes is available at
                                // https://firebase.google.com/docs/storage/web/handle-errors
                                switch (error.code) {
                                    case 'storage/unauthorized':
                                        // User doesn't have permission to access the object
                                        break;
                                    case 'storage/canceled':
                                        // User canceled the upload
                                        break;
                                    case 'storage/unknown':
                                        // Unknown error occurred, inspect error.serverResponse
                                        break;
                                }

                            }, function() {

                                user.updateProfile({
                                    photoURL: userProfileUploadePhoto.snapshot.downloadURL
                                }).then( function() {
                                    $scope.$apply(function(){
                                        $scope.currentUserProfileImage = userProfileUploadePhoto.snapshot.downloadURL;
                                        $scope.userProfileSrcSelected = true;
                                        angular.element('#fileUploader').val(null);
                                        $timeout( function(){
                                            $scope.userProfileUploadedInit   = false;
                                        }, 1000 );
                                    });
                                }).catch( function( error ) {
                                    console.log( error );
                                });

                            });
                        }

                    }

                });


            }

        }
    });