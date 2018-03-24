angular
    .module('weddingPlanner')
    .component('userProfile', {
        templateUrl: 'templates/components/component-user-profile.html',
        controller: function ( $scope,  ) {

            var storage = firebase.storage();
            var storageRefDirecory = storage.ref();
            var storageImagesRefenrece = storageRefDirecory.child('user-images/user-photo.png');
            var user = firebase.auth().currentUser;
            $scope.userProfileSrcSelected = false;


            var metadata = {
              contentType: 'image/png',
              customMetadata: {
                cacheControl: 'public,max-age=300'
              }
            };

            $scope.userprofileSrc = '';


            // Zabawy z obrazkami
            $scope.fileNameGetter = function (  photoElement ) {

                var file        = photoElement.files,
                    fileObject  = file[0],
                    fileBlobUrl = window.URL.createObjectURL(fileObject);

                    console.log(fileObject)

                if ( fileObject.type === "image/png" || fileObject.type === "image/jpeg" ) {


                    if (fileObject.size <= 10000 ) {

                        $scope.$apply(function() {
                            $scope.userProfileSrcSelected = true;
                            $scope.fileObject = fileObject;
                        });

                    } else {

                        console.log("Plik jest zby duży");
                        $scope.userProfileSrcSelected = false;

                    }

                    

                } else {
                    console.log("Nie jest Ok")
                    $scope.userProfileSrcSelected = false;
                }

                $scope.$apply();


            };

            //Przycisk Przy pomocy którego wysyłamy obrazek do firebase storage
            $scope.userProfileUpload = function() {

                console.log(metadata);

                var userProfileUploadePhoto = storageImagesRefenrece.put($scope.fileObject, metadata);


                /* Pełna obsługa przesyłu grafiki do firebase storage */
                userProfileUploadePhoto.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
    
                    /* Pokazuję wartość % z przesyłu pliku do firebase storage */
                    $scope.userProfileUploadProgress = snapshot.bytesTransferred / snapshot.totalBytes;
                    $scope.userProfileUploadedInit   = true;
                    $scope.$apply();


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

                    console.log('Upload is completed');

                    $scope.currentUserProfileImage = userProfileUploadePhoto.snapshot.downloadURL;
                    $scope.userProfileSrcSelected = true
                    $scope.$apply();

                    user.updateProfile({
                        photoURL: userProfileUploadePhoto.snapshot.downloadURL
                    }).then( function() {
                
                    }).catch( function( error ) {
                        console.log( error );
                    });

                });
            }

            /* Przenieść warunek dot. usera na samą górę */
            if ( user !== null ) {

                user.providerData.forEach(function (profile) {

                    console.log(profile);

                    $scope.currentUserName          = profile.displayName;
                    $scope.currentUserProfileImage  = profile.photoURL;

                    if ( $scope.currentUserProfileImage !== null ) {
                        $scope.userProfileSrcSelected = true;
                    }

                });

            }

            user.updateProfile({
                displayName: 'Krzysztof Wielicki'
            }).then( function() {
                
            }).catch( function( error ) {
                console.log( error );
            });

        }
    });
