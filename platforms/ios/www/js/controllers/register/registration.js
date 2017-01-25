(function(){

	var registration = angular.module('controllers.register.registration', ['utils.constants']);

	registration.controller('RegistrationController', [ '$rootScope', '$scope', '$state', 'AppConstants',
		function( $rootScope, $scope, $state, AppConstants) {

			$scope.documentTypes = [
				{ name : 'DNI', size : 8 },
				{ name: 'Carnet de Extranjeria', size: 11 }, 
				{ name: 'RUC', size : 11 }];

			$scope.tmpData = {};

			$scope.questions = AppConstants.SECRET_QUESTIONS;

			$scope.device = window.localStorage.getItem('device');

			$scope.user = {
				activeDevices : [ angular.fromJson($scope.device) ]
			};

			$scope.person = {};
			$scope.person.email = $rootScope.email;

			$scope.tmpData.documentLenght = 0;

			$scope.inputValidationSize = function() {
				$scope.tmpData.documentLenght = $scope.tmpData.documentType.size;
				$scope.person.documentType = $scope.tmpData.documentType.name;
				console.log("PERSON", angular.toJson($scope.person));
			}

			$scope.nextPage = function() {
				$scope.user.person = $scope.person;
				console.log('USER', angular.toJson($scope.user));
				$rootScope.user = $scope.user;
				$state.go('terms');
			}

		}]);

})()