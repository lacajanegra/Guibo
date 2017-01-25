(function(){

	var profile = angular.module('controllers.profile', ['ionic-material', 'dao.account-dao']);

	profile.controller('ProfileController', 
		[ 
			'$scope', 
			'$state', 
			'$timeout', 
			'ionicMaterialMotion', 
			'ionicMaterialInk', 
			'AccountDAO',
		function( $scope, $state, $timeout, ionicMaterialMotion, ionicMaterialInk, AccountDAO ) {

			$scope.user = angular.fromJson( window.localStorage.getItem('user') );

			$scope.categorySort = function (accountList) {
	            console.log('NotificationManagerController, categorySort');
	            $scope.accountsMap = {};

	            for(var index in accountList) {                
	                var section = [];                
	                var sectionTitle = accountList[index].category;
	                
	                if($scope.accountsMap.hasOwnProperty(sectionTitle)) {
	                    continue;
	                }
	                
	                for(var accIndex in accountList) {
	                    var category = accountList[accIndex].category;
	                    if( sectionTitle === category ) {
	                        var account = {
	                            companyName : accountList[accIndex].companyName,
	                            address : accountList[accIndex].address,
	                            notification : accountList[accIndex].notification,
	                            settingId : accountList[accIndex].settingId,
	                            logo : accountList[accIndex].logo,
	                            id : accountList[accIndex].id,
	                        };
	                        section.push(account);
	                    }
	                }
	                $scope.accountsMap[sectionTitle] = section;                
	            }
	            
	            console.log("categorySort: ", angular.toJson($scope.accountsMap));
	        };

			$scope.loadAccounts = function() {
	            
	            var success = function(response) {
	                console.log('NotificationManagerController:', angular.toJson(response))                
	                $scope.categorySort(response);
	            };
	        
	            var error = function(error) {	                
	                $ionicPopup.alert({
	                         title: AppConstants.ERROR_TITLE,
	                         template: angular.toJson(error)
	                });
	                console.log('ERROR!!! ', angular.toJson(error) );
	            };
	            
	            AccountDAO.retrieveAllAccounts().then(success).catch(error);
	        }; 

		    // Set Motion
		    $timeout(function() {
		        ionicMaterialMotion.slideUp({
		            selector: '.slide-up'
		        });
		    }, 300);

		    $timeout(function() {
		        ionicMaterialMotion.fadeSlideInRight({
		            startVelocity: 3000
		        });
		    }, 700);

		    // Set Ink
		    ionicMaterialInk.displayEffect();

		    $scope.$on("$ionicView.afterEnter", function(event, data) {
		    	$scope.loadAccounts();
		    });

		}]);
})()