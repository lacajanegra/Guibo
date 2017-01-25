(function(){
	var forgotPassword = angular.module('controllers.forgot-password', ['utils.constants', 'service.auth','utils.loading']);

	forgotPassword.controller('ForgotPasswordController', [ '$scope', '$ionicHistory', 'AppConstants', 'AuthService','$ionicPopup', 'Loading',
		function( $scope, $ionicHistory, AppConstants, AuthService, $ionicPopup, Loading){

			$scope.questions = AppConstants.SECRET_QUESTIONS;
			$scope.user = {};

			$scope.chooseQuestion = function() {
				$scope.tmpData.documentLenght = $scope.tmpData.documentType.size;
				$scope.person.documentType = $scope.tmpData.documentType.name;
				console.log("PERSON", angular.toJson($scope.person));
			}

			$scope.forgotPassword = function() {
				Loading.show();
				console.log("forgotPassword:", angular.toJson($scope.user));

				var success = function(response) {
					console.log("RESPONSE: ", angular.toJson(response));
					Loading.hide();
					$ionicHistory.goBack();
				};

				var error = function(error) {
					Loading.hide();
					$ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                	});
					console.log("ERROR: ", angular.toJson(error));
				};

				AuthService.forgotPassword($scope.user.username, $scope.user.secretQuestion, $scope.user.secretAnswer )
					.then(success).catch(error);
			};

		}]);
})()