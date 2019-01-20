/* Filtr odpowiedzialny za sumowanie elementów obiektu */

angular
	.module('weddingPlanner')
	.filter('sumColumn', function(){
	        return function(dataSet, columnToSum){
	            let sum = 0;

				if ( dataSet !== undefined ) {
					Object.keys(dataSet).forEach(function(key) {

						if ( !dataSet[key].status.value ) {
							sum += dataSet[key][columnToSum].amount;
						}

		            });
					return sum;
				}

	        };
	    });
