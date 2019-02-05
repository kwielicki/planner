angular
	.module('weddingPlanner')
	.filter('guestStatistic', function(){
	        return function(dataSet, columnToSum, profile, value, membership){
	            let sum = 0;
				if ( dataSet !== undefined ) {
					Object.keys(dataSet).forEach(function(key) {
						if ( profile !== undefined ) {
							if ( value !== undefined && dataSet[key][profile] === value) {
								if ( membership !== undefined ) {
									if ( dataSet[key]['status'] === membership ) {
										sum += parseInt(dataSet[key][columnToSum], 10);
									}
								} else {
									sum += parseInt(dataSet[key][columnToSum], 10);
								}
							}
						} else {
							sum += parseInt(dataSet[key][columnToSum], 10);
						}
		            });
					return sum;
				}
	        };
	    });
