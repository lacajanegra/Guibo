(function() {

	var notification = angular.module( 'controllers.notification', 
		[ 	
			'dao.bills-dao',
			'dao.company-dao',
			'dao.product-dao',
			'dao.account-dao',
			'dao.settings-dao',
			'service.bill',
			'utils.constants'
		]);

	notification.factory('NotificationController', 
		[ '$rootScope', 'BillService', 'BillsDAO', 'AccountDAO', 
			'CompanyDAO', 'ProductDAO' ,'SettingsDAO', 'AppConstants',
		function( $rootScope, BillService, BillsDAO, AccountDAO, 
			CompanyDAO, ProductDAO ,SettingsDAO, AppConstants) {

			console.log("cargando StatsController");

			var service = {};

			service.loadBill = function( billId ) {

				var user = angular.fromJson(window.localStorage.getItem('user'));

				var error = function(error) {					
					console.log(error);
				};

				var success = function(response) {
					console.log(response);					
					$rootScope.$broadcast('refresh-inbox');
					$rootScope.$broadcast('refresh-notiffication-view');
				};

				var scope = this;

				// alert(angular.toJson(user));
				BillService.retrieveBill(billId, user.id)
					.then(function(response) {
						console.log(angular.toJson(response));						
						scope.bill = response.bill;
						scope.setting = response.setting;						
						return CompanyDAO.findOrCreate(scope.bill.account.product.company);
					}).then(function(company) {
						console.log("findOrCreate company", company );						
						return ProductDAO.findOrCreate(scope.bill.account.product);
					}).then(function(product) {
						console.log("findOrCreate product", product );						
						return AccountDAO.findOrCreate(scope.bill.account);
					}).then(function(account) {												
						console.log("findOrCreate account", account );						
						var setting = {
							id : scope.setting.id,
							accountId : scope.setting.account,
							alias : scope.bill.account.product.description,
							categoryId : AppConstants.DEFAULT_CATEGORY
						};						
						return SettingsDAO.findOrCreate(setting);

					}).then(function(setting) {
						var dbBill = {
							id: scope.bill.id,
			                accountId : scope.bill.account.id,
			                voucherCode : scope.bill.number,
			                emissionDate: scope.bill.emissionDate,
			                expirationDate: scope.bill.expirationDate,
			                cost: scope.bill.service ? scope.bill.service.cost : 0,
			                consumption: scope.bill.service ? scope.bill.service.consumption : 0,
			                nationalCost: scope.bill.transactional ? scope.bill.transactional.nationalCost : 0,
			                foreignCost: scope.bill.transactional ? scope.bill.transactional.foreignCost : 0,
			            };
						return BillsDAO.saveBill(dbBill);
					}).then(success).catch(error);
			};

			service.removeAccount = function(accountId) {

				var success = function(response) {
	                console.log("removeSetting Response", angular.toJson(response));
	                $rootScope.$broadcast('refresh-boxes-event');
	            }
	            
	            var error = function(error) {
	                console.log("Remove Error", angular.toJson(error));
	            }

	            BillsDAO.removeAccountBills(accountId)
		            .then( function(response) {
		                return SettingsDAO.removeSetting(accountId);
		            }).then( function(response) {
		                return AccountDAO.removeAccount(accountId);
		            }).then(success).catch(error);

			};

			return service;

		}]);
})()