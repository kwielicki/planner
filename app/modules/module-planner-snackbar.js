/*
	@author Krzysztof Wielicki
*/

(function ( angular ) {
	"use strict";

	angular
		.module( "angular.plannerSnackbar", [] )
		.factory("plannerSnackbar", ['$rootScope', '$timeout', function ($rootScope, $timeout) {

		return {
			create : function ( content, duration, position ) {
				$timeout(function(){
					$rootScope.$broadcast('plannerCreateSnackbar', { 'content': content, 'duration': duration , 'position': position});
				});
			}
		}
	}])
		.directive( "plannerSnackbar", ["$rootScope", "$compile", "$timeout", function( $rootScope, $compile, $timeout ) {

			return function( scope, element, attrs ) {

				// plannerSnackbar container
				const plannerSnackbarContainer = angular.element( element );

				// plannerSnackbar czas trwania, default 3000ms
				const plannerSnackbarDuration = parseInt(attrs.plannerSnackbarDuration, 10) || 1500;

				// plannerSnackbar opóźnienie przed usunięciem z drzewa DOM, default 200ms
				const plannerSnackbarDelay   = parseInt(attrs.plannerSnackbarDelay, 10) || 200;


				// Broadcasting
				$rootScope.$on('plannerCreateSnackbar', function( event, received ) {

					// plannerSnackbar position
					switch ( received.position ) {
						case "top":
							received.position = 'planner-snackbar--top';
							break;
						case "bottom":
							received.position = 'planner-snackbar--bottom';
							break;
						case "bottom-right":
							received.position = 'planner-snackbar--botright';
							break;
						case "bottom-left":
							received.position = 'planner-snackbar--botleft';
							break;
						case "top-right":
							received.position = 'planner-snackbar--topright';
							break;
						case "top-left":
							received.position = 'planner-snackbar--topleft';
							break;
						default:
							received.position = 'planner-snackbar--botleft';
							break;
					}

					const plannerSnackbarPPosition = received.position;

					// Struktura snackbara
					const plannerSnackbarTemplate = `
						<div class="planner-snackbar planer-snackbar--opened ${received.position}">
							<div class="planner-snackbar__content">${received.content}</div>
						</div>
					`;

					// Pokazanie wyłącznie jednego snackbara
					if ( $('.planner-snackbar').length > 0 ) {
						$('.planner-snackbar').remove()
					};

					// Kompilacja strktury snackbara
					const plannerSnackbarTemplateCompiler = angular.element( $compile(plannerSnackbarTemplate)(scope) );

					// Utworzenie snackbara
					plannerSnackbarContainer.append(plannerSnackbarTemplateCompiler);

					$timeout(function() {
						plannerSnackbarTemplateCompiler.addClass('planner-snackbar--animated');
					}, 50)

					// plannerSnackbar czas trwania
					$timeout(function() {

						// Ukrycie snackbara
						plannerSnackbarTemplateCompiler.removeClass('planner-snackbar--opened');

						// Usunięcie snackbara
						$timeout(function() {
							plannerSnackbarTemplateCompiler.remove();
						}, plannerSnackbarDelay, false);
					}, received.duration || plannerSnackbarDuration, false);
				});
			}

		}]);

})(angular);
