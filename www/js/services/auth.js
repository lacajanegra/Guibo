(function(){

	var auth = angular.module('service.auth', ['utils.constants']);

	auth.factory('AuthService', [ '$http', '$q', 'AppConstants',
		function( $http, $q, AppConstants ) {

			var service = {};

			service.sendTokenValidator = function(email) {

				var deferred = $q.defer();
				
				var success = function(response) {
					console.log('RESPONSE:', angular.toJson(response));
					deferred.resolve("SUCCESS");
				};

				var error = function(error) {
					console.log('ERROR:', angular.toJson(error));
					deferred.reject(error.data.message);
				};

				var data = { email : email };

				$http.post(AppConstants.BASE_URL + AppConstants.SEND_TOKEN_VALIDATOR, data).then(success).catch(error);

				// deferred.resolve("SUCCESS");
				
				return deferred.promise;
			};

			service.validateToken = function(email, token) {

				var deferred = $q.defer();
				
				var success = function(response) {
					console.log('RESPONSE:', angular.toJson(response));
					deferred.resolve("SUCCESS");
				};

				var error = function(error) {
					console.log('ERROR:', angular.toJson(error));					
					deferred.reject(error.data.message);
				};

				var data = { email : email, token : token };

				$http.post(AppConstants.BASE_URL + AppConstants.VALIDATE_TOKEN, data).then(success).catch(error);
				
				// deferred.resolve("SUCCESS");

				return deferred.promise;
			};

			service.registerUser = function( user ) {

				var deferred = $q.defer();
				
				var success = function(response) {
					console.log('RESPONSE:', angular.toJson(response.data));
					deferred.resolve(response.data.user);
				};

				var error = function(error) {
					console.log('ERROR:', angular.toJson(error));					
					deferred.reject(error.data.message);
				};

				var data = { user : user };

				$http.post(AppConstants.BASE_URL + AppConstants.REGISTER_USER, data).then(success).catch(error);

				// deferred.resolve("SUCCESS");

				return deferred.promise;
			};

			service.signin = function( identifier, password , device ) {

				var deferred = $q.defer();
				
				var success = function(response) {
					console.log('RESPONSE:', angular.toJson(response.data));
					deferred.resolve(response.data.user);
				};

				var error = function(error) {
					console.log('ERROR:', angular.toJson(error.data));
					var message = AppConstants.DEFAULT_ERROR;
					if ( error && error.data && error.data.message ) {
						message = error.data.message;
					}
					deferred.reject(message);
				};

				var data = {
					identifier : identifier, 
					password : password, 
					device : device };

				// $http.post(AppConstants.BASE_URL + AppConstants.SIGNIN, data, { timeout : 3000 } ).then(success).catch(error);
				deferred.resolve( { id : 1234 } );

				return deferred.promise;
			};

			service.logout = function( user , device ) {

				var deferred = $q.defer();
				var success = function(response) {
					console.log('RESPONSE:', angular.toJson(response));
					deferred.resolve("SUCCESS");
				};

				var error = function(error) {
					console.log('ERROR:', angular.toJson(error));
					deferred.reject("ERROR");
				};

				var data = { user : user, device : device };
				console.log("data logout", angular.toJson(data));

				// $http.post(AppConstants.BASE_URL + AppConstants.LOGOUT, data).then(success).catch(error);
				deferred.resolve("SUCCESS");

				return deferred.promise;
			};

			service.forgotPassword = function( identifier , secretQuestion, secretAnswer ) {

				var deferred = $q.defer();
				
				var success = function(response) {
					console.log('RESPONSE:', angular.toJson(response));
					deferred.resolve("SUCCESS");
				};

				var error = function(error) {
					console.log('ERROR:', angular.toJson(error));
					deferred.reject("ERROR");
				};
		
				var data = { identifier: identifier, question : secretQuestion, answer : secretAnswer };

				$http.post(AppConstants.BASE_URL + AppConstants.FORGOT_PASSWORD, data).then(success).catch(error);

				// deferred.resolve("SUCCESS");

				return deferred.promise;
			};

			return service;

		}]);

})()