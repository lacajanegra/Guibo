(function(){
	var confirm = angular.module('controllers.add-account.confirm', [ 'dao.company-dao', 'utils.constants']);

	confirm.controller('AccConfirmController', 
		[ '$scope', '$state', '$stateParams', '$ionicHistory', 'CompanyDAO', '$ionicPopup', 'AppConstants',
		function( $scope, $state, $stateParams, $ionicHistory, CompanyDAO, $ionicPopup, AppConstants) {

			console.log('AccConfirmController', angular.toJson($stateParams));

			$scope.companyId = $stateParams.companyId;			

			$scope.loadData = function() {				

				var success = function(company) {
					console.log("company response:", angular.toJson(company));					
					$scope.company = company;										
				}

				var error = function(error) {
					
					$ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                	});
					console.log("company error:", angular.toJson(error));
				}
				console.log("companyId", $scope.companyId);
				CompanyDAO.findCompany($scope.companyId).then(success).catch(error);

			}

			$scope.loadData();

			$scope.goToInbox = function() {
				$ionicHistory.goBack(-2);
			};

		}]);
})()