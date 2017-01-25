(function(){

	var bill = angular.module('service.bill', ['utils.constants']);

	bill.factory('BillService', [ '$http', '$q', 'AppConstants',
		
		function( $http, $q, AppConstants ) {

			var service = {};

			service.retrieveBill = function(billId, userId) {

				var deferred = $q.defer();
				
				var success = function(response) {
					console.log('RESPONSE:', angular.toJson(response.data));					
					deferred.resolve(response.data);
				};

				var error = function(error) {
					console.log('ERROR:', angular.toJson(error));
					deferred.reject("ERROR");
				};

				var data = { billId : billId , userId : userId };
				
				$http.post(AppConstants.BASE_URL + AppConstants.RETRIEVE_BILLS, data).then(success).catch(error);

				// deferred.resolve("SUCCESS");
				
				return deferred.promise;

			};

			service.retrieveHistoricalBills = function(userId) {

				var deferred = $q.defer();
				
				var success = function(response) {
					console.log('RESPONSE:', angular.toJson(response));					
					deferred.resolve("HISTORICAL_BILLS");
				};

				var error = function(error) {
					console.log('ERROR:', angular.toJson(error));					
					deferred.reject("ERROR");
				};

				var data = { user : userId };

				$http.post(AppConstants.BASE_URL + AppConstants.HISTORICAL_BILLS, data).then(success).catch(error);

				// deferred.resolve("SUCCESS");
				
				return deferred.promise;

			};

			return service;

		}]);

})()