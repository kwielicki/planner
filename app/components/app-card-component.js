angular.
    module('weddingPlanner').
    component('plannerCard', {
        templateUrl: 'templates/components/component-card.html',
        controller: function( $scope ) {
            $scope.categoryName       = $scope.$parent.currentArrayWithCurrentNotes.assignedCategoryName;
            $scope.noteTitle          = $scope.$parent.currentArrayWithCurrentNotes.noteTitle;
            $scope.noteDescription    = $scope.$parent.currentArrayWithCurrentNotes.noteDescription;
            $scope.noteAuthor         = $scope.$parent.currentArrayWithCurrentNotes.noteAuthor;
            $scope.priorityName       = $scope.$parent.currentArrayWithCurrentNotes.noteStatus.name;
            $scope.priorityValue      = $scope.$parent.currentArrayWithCurrentNotes.noteStatus.value;
            $scope.noteIndex          = $scope.$parent.$index;


            // Ustawienie odpowiedniego napisu uwzględniając wagę priorytetową
            $scope.noteStatusLabel = function() {
                switch ($scope.priorityName) {
                    case 'noteLowPriority':
                        return 'Priorytet niski';
                        break;
                    case 'noteNeutralPriority':
                        return 'Priorytet normalny';
                        break;
                    case 'noteHighPriority':
                        return 'Priorytet wysoki';
                        break;
                    default:
                        return 'Priorytet normalny';
                        break;
                }
            };

            $scope.noteClassModifier = function() {
                switch ($scope.priorityValue) {
                    case 0:
                        return 'card__priority--low';
                        break;
                    case 1:
                        return 'card__priority--neutral';
                        break;
                    case 2:
                        return 'card__priority--high';
                        break;
                    default:
                        return 'card__priority--neutral';
                        break;
                }
            }

            $scope.notePriorityLabel = $scope.noteStatusLabel();

        }
    });
