(function(){
	var terms = angular.module('controllers.register.terms', ['service.auth', 'utils.loading']);

	terms.controller('TermsController', [ '$rootScope', '$scope', '$state', '$ionicHistory', 'AuthService', 'Loading',
		function( $rootScope, $scope, $state, $ionicHistory, AuthService, Loading){

			console.log("TermsController");			

			$scope.cancel = function() {
				$ionicHistory.nextViewOptions({ disableBack: true });				
				$state.go('home');				
				console.log("CANCEL");
			};

			$scope.register = function() {
				Loading.show();
				var success = function(response) {
					$ionicHistory.nextViewOptions({ disableBack: true });
					window.localStorage.setItem('user', angular.toJson(response));
					console.log("el usuario es " + $rootScope.email)
					window.localStorage.setItem('uemail', $rootScope.email);
					Loading.hide();
					$state.go('walkthrough');
					console.log("REGISTER");
				};

				var error = function(errorMessage) {
					Loading.hide();
					$ionicPopup.alert({
					     title: 'Error en el Registro',
					     template: errorMessage
					});					
				};

				AuthService.registerUser($rootScope.user).then(success).catch(error);
			};

		}]);
})()