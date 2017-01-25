(function(){

	var stats = angular.module('service.stats', ['utils.constants']);

	stats.factory('StatsService', [ '$http', '$q', 'AppConstants',
		
		function( $http, $q, AppConstants ) {

			var service = {};

			service.saveStats = function(stastList) {

				var deferred = $q.defer();
				
				var success = function(response) {
					console.log('RESPONSE:', angular.toJson(response));
					deferred.reject("SAVE");
				};

				var error = function(error) {
					console.log('ERROR:', angular.toJson(error));					
					deferred.reject("ERROR");
				};

				var data = { stats : stastList };
				
				$http.post(AppConstants.BASE_URL + AppConstants.SAVE_STATS, data).then(success).catch(error);

				// deferred.resolve("SUCCESS");
				
				return deferred.promise;

			};			

			return service;

		}]);

})()