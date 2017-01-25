(function(){

	var validateEmail = angular.module('controllers.register.validate-email', ['service.auth', 'utils.loading']);

	validateEmail.controller( 'ValidateEmailController', [ '$rootScope', '$scope', '$state', 'AuthService','Loading',
		function ( $rootScope, $scope, $state, AuthService, Loading ) {

			console.log("ValidateEmailController");
			$scope.person = {};

			$scope.sendConfirmationEmail = function() {
				Loading.show();
				var success = function(response) {
					$rootScope.email = $scope.person.email;
					Loading.hide();
					$state.go('confirmation-token');
				}

				var error = function(errorMessage){
					Loading.hide();
					$ionicPopup.alert({
					     title: 'Error en el envío de Email',
					     template: errorMessage
					});
				}
				
				AuthService.sendTokenValidator($scope.person.email).then(success).catch(error);
			}

		}]);

})()