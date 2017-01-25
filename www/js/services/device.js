(function(){

	var device = angular.module('service.device', ['utils.constants']);

	device.factory('DeviceService', [ '$http', '$q', 'AppConstants',
		
		function( $http, $q, AppConstants ) {

			var service = {};

			service.updateToken = function(device) {

				var deferred = $q.defer();
				
				var success = function(response) {
					console.log('RESPONSE:', angular.toJson(response));
					deferred.resolve(response.data.account);
				};

				var error = function(error) {
					console.log('ERROR:', angular.toJson(error));
					if(error.data) {
						deferred.reject(error.data.message);
					} else {
						deferred.reject(AppConstants.DEFAULT_ERROR);
					}
				};

				var data = { device : device };

				$http.post(AppConstants.BASE_URL + AppConstants.UPDATE_TOKEN, data).then(success).catch(error);
				
				return deferred.promise;

			};

			return service;

		}]);

})()