(function(){
	var login = angular.module('controllers.login', 
		['service.auth', 'utils.loading', 'service.device']);

	login.controller('LoginController', [ 
		'$rootScope',
		'$scope', 
		'$state', 
		'$ionicHistory', 
		'AuthService', 
		'Loading', 
		'$ionicPopup',
		'DeviceService',

		function( $rootScope, $scope, $state, $ionicHistory, AuthService, Loading, $ionicPopup, DeviceService ){
			
			$scope.user = {};
			var guiboDevice = angular.fromJson( window.localStorage.getItem('device') );

		 //    var push = PushNotification.init({
			//       android: {
			//         senderID: "687585600231"
			//       },

			//       ios: {
			//         senderID: "687585600231",
			//         gcmSandbox : true,
			//         alert: "true",
			//         badge: "true",
			//         sound: "true"
			//       },
			//     });
		    
			// push.on('registration', function(data) {
			// 	console.log("registration data", angular.toJson(data))
			// 	guiboDevice.registrationToken = data.registrationId;
			// 	console.log("guiboDevice", angular.toJson(guiboDevice))
			// 	window.localStorage.setItem('device', angular.toJson(guiboDevice))
			// 	DeviceService.updateToken(guiboDevice)
			// })

			$scope.loginUser = function() {
				
				console.log("loginUser", angular.toJson($scope.user));				

				var success = function(response) {
					Loading.hide();
					console.log("RESPONSE: ", angular.toJson(response));
					window.localStorage.setItem('user', angular.toJson(response));
					window.localStorage.setItem('uemail', angular.toJson($scope.user.username));
					$rootScope.$broadcast('pushRegistration')
					$ionicHistory.nextViewOptions({ disableBack: true });
					$state.go('app.bills-inbox');
				};

				var error = function(errorMessage) {
					console.log("ERROR: ", angular.toJson(errorMessage));
					$ionicPopup.alert({
					     title: 'Error en Login',
					     template: errorMessage
					});
					Loading.hide();
				};
				$state.go('app.bills-inbox');
				Loading.show().then(function() {
					return AuthService.signin($scope.user.username, $scope.user.password, guiboDevice);
				}).then(success).catch(error);
			}

		}]);
})()