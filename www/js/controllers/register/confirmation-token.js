(function(){

	var confirmationToken = angular.module('controllers.register.confirmation-token', ['service.auth', 'utils.loading']);

	confirmationToken.controller( 'ConfirmationTokenController', [ '$rootScope', '$scope', '$state', 'AuthService','Loading',
		function ( $rootScope, $scope, $state, AuthService, Loading ) {
			
			$scope.user = {};
			$scope.user.email = $rootScope.email;			

			$scope.validateToken = function() {
				Loading.show();
				var success = function(response) {
					Loading.hide();
					$state.go('registration');
				};

				var error = function(errorMessage) {
					Loading.hide();
					$ionicPopup.alert({
					     title: 'Error en el código',
					     template: errorMessage
					});
				};

				AuthService.validateToken($scope.user.email, $scope.user.token).then(success).catch(error);
			}

		}]);

})()