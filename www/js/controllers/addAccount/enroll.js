(function(){
	var enroll = angular.module('controllers.add-account.enroll', 
		[ 
			'service.account', 			

			'dao.company-dao',
			'dao.product-dao',
			'dao.account-dao',			
			'dao.settings-dao',
			'utils.loading',
			'utils.constants'
		]);

	enroll.controller('EnrollController', [ 
		'$rootScope', '$scope', '$state', '$stateParams', 'AccountService', 
		'AccountDAO', 'CompanyDAO', 'ProductDAO' ,'SettingsDAO', '$ionicPopup', 'Loading', 'AppConstants',
		function( $rootScope, $scope, $state, $stateParams, AccountService, 
			AccountDAO, CompanyDAO, ProductDAO, SettingsDAO, $ionicPopup, Loading,AppConstants ) {

			console.log('EnrollController', angular.toJson($stateParams));

			$scope.user = angular.fromJson( window.localStorage.getItem('user') );
			$scope.account = angular.fromJson($stateParams.account);			
			$scope.company = $scope.account.product.company;
			$scope.viewData = {};			

			var defaultCategory = 5;

			$scope.enroll = function() {
				
				var success = function(response) {
					console.log("success save enroll:", angular.toJson(response));										
					$rootScope.$broadcast('refresh-notiffication-view');
					Loading.hide();
					$state.go('app.add-account-confirm', { companyId : $scope.company.id });
				};


				var error = function(error) {					
					Loading.hide();
					$ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                	});			
				};
				
				Loading.show().then(function() {
						return AccountService.enrollAccount($scope.user.id, $scope.account.id,
						$scope.viewData.holderIdentification);
					}).then(function(response) {
						console.log("enrollData" + angular.toJson(response));
						$scope.setting = response;
						return CompanyDAO.findOrCreate($scope.account.product.company);
					}).then(function(response){
						console.log("findOrCreate company", response );						
						return ProductDAO.findOrCreate($scope.account.product);
					}).then(function(response) {
						console.log("findOrCreate product", response );
						return AccountDAO.findOrCreate($scope.account);
					}).then(function(response) {
						console.log("findOrCreate account", response );

						var setting = {
							id : $scope.setting.id,
							accountId : $scope.account.id,
							alias : $scope.account.product.description,
							categoryId : defaultCategory
						};
						return SettingsDAO.findOrCreate(setting);

					}).then(success).catch(error);

			}

		}]);
})()