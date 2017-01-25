(function(){

	var qr = angular.module('controllers.add-account.qr', ['service.account', 'utils.loading']);

	qr.controller('QRController', [
		'$rootScope', '$scope', '$state', '$cordovaBarcodeScanner', '$ionicPopup','AccountService', 'Loading',
		function( $rootScope, $scope, $state, $cordovaBarcodeScanner, $ionicPopup, AccountService, Loading) {
			console.log('QRController');

			$scope.codeScanner = function() {

				var error = function(error) {
					console.log(error);	
				};

				$cordovaBarcodeScanner.scan().then(function(result) {
					if ( result.text ) {
						$scope.retrieveAccount(result.text);
					}					
				}).catch(error);

				// $scope.retrieveAccount("3102546-3");

			};

			$scope.retrieveAccount = function(accountNumber) {
				
				var success = function(account) {
					Loading.hide();
					$state.go('app.add-account-enroll', { account : angular.toJson(account) } );
				};

				var error = function(error) {
					console.log(error);	
					Loading.hide();
					$ionicPopup.alert({
                         title: 'Error',
                         template: angular.toJson(error)
                	});
				};

				Loading.show().then(function(){
					return AccountService.retrieveAccount( accountNumber );	
				}).then(success).catch(error);
				
			}

		}]);
})()