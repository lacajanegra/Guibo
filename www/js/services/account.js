(function(){

	var account = angular.module('service.account', ['utils.constants']);

	account.factory('AccountService', [ '$http', '$q', 'AppConstants',
		
		function( $http, $q, AppConstants ) {

			var service = {};

			service.retrieveAccount = function(accountNumber) {

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

				var data = { accountNumber : accountNumber };

				$http.post(AppConstants.BASE_URL + AppConstants.RETRIEVE_ACCOUNT, data).then(success).catch(error);

				// var responseDummy = {
				// 	product: { 
				// 		company: { 
				// 			name: 'Kuvasz',
				// 			address: 'Merced #838',
				// 			code: '1234567',
				// 			logo: 'https://media.licdn.com/mpr/mpr/shrink_200_100/p/5/005/085/1ad/2c63816.png',
				// 			id: 60,
				// 		},
				// 		description: 'Test Product',
				// 		code: '123456789012345',
				// 		type: 'Basico',
				// 		id: 64
				// 	},
				// 	id: 64,
				// 	accountNumber: '3102546-3',
				// 	clientNumber: '3102546-3',
				// 	holderIdentification: '12345678',
				// 	holderName: 'CARRANZA MACHACA OLIBEL'
				// };

				 // deferred.resolve(responseDummy);
				
				return deferred.promise;

			};

			service.enrollAccount = function(userId, accountId, holderIdentification) {

				var deferred = $q.defer();
				
				var success = function(response) {
					console.log('RESPONSE:', angular.toJson(response.data.setting));
					deferred.resolve(response.data.setting);
				};

				var error = function(error) {
					console.log('ERROR:', angular.toJson(error));					
					deferred.reject(error.data.message);
				};

				var data = { 
					userId : userId,
					accountId : accountId,
					holderIdentification : holderIdentification
				};

				$http.post(AppConstants.BASE_URL + AppConstants.ENROLL_ACCOUNT, data).then(success).catch(error);

				// deferred.resolve("SUCCESS");
				
				return deferred.promise;

			};

			service.removeAccount = function( accountId, userId ) {

				var deferred = $q.defer();
				
				var success = function(response) {
					console.log('RESPONSE:', angular.toJson(response.data));
					deferred.resolve(response.data.message);
				};

				var error = function(error) {
					console.log('ERROR:', angular.toJson(error.data));
					deferred.reject(error.data.message);
				};

				var data = {
					accountId : accountId,
					userId : userId
				};

				console.log("AccountService removeAccount", angular.toJson(data) );
				
				$http.post(AppConstants.BASE_URL + AppConstants.REMOVE_ACCOUNT , data)
					.then(success).catch(error);
				
				// deferred.resolve("SUCCESS");
				
				return deferred.promise;
			}

			service.updateNotificationSetting = function( settingList ) {

				var deferred = $q.defer();
				
				var success = function(response) {
					console.log('RESPONSE:', angular.toJson(response.data));
					deferred.resolve(response.data.message);
				};

				var error = function(error) {
					console.log('ERROR:', angular.toJson(error.data));
					deferred.reject(error.data.message);
				};

				var data = {
					settings : settingList
				};

				console.log("AccountService", angular.toJson(settingList));
				$http.post(AppConstants.BASE_URL + AppConstants.NOTIFICATION_SETTINGS , data)
					.then(success).catch(error);
				
				// deferred.resolve("SUCCESS");
				
				return deferred.promise;
			}

			return service;

		}]);

})()