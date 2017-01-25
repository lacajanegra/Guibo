(function(){
	var inbox = angular.module('controllers.bills.inbox', 
		[ 
			'utils.constants', 			
			'controllers.stats',			
			'service.sort',
			'dao.bills-dao',
			'dao.stats-dao',			
		]);

	inbox.controller('InboxController', 
		[ 
		'$rootScope', 
		'$scope', 
		'$state', 
		'AppConstants', 
		'BillsDAO', 
		'VoucherSortService', 
		'StatsDAO', 
		'StatsController', 		
		'$cordovaLocalNotification', 
		'$ionicActionSheet', 
		'$ionicModal', 
		'$ionicPopup', 

		function( $rootScope, $scope, $state, AppConstants, BillsDAO, VoucherSortService , 
			StatsDAO, StatsController, $cordovaLocalNotification, $ionicActionSheet, $ionicModal, $ionicPopup) {
        
			console.log('InboxController');			

			$ionicModal.fromTemplateUrl('templates/selectdate.html', { scope: $scope})
	            .then(function(modal) {
	                $scope.modal = modal;
	            });

	        $scope.currentDate = new Date();
			$scope.voucherMap = {};
			$scope.user = angular.fromJson(window.localStorage.getItem('user'));
			$scope.device = angular.fromJson(window.localStorage.getItem('device'));
			console.log("device: ", angular.toJson($scope.device));

			 $scope.loadVouchers = function() {
			 	
	            var success = function(response) {
	                console.log( "INBOX: ", angular.toJson(response));            
	                $scope.voucherList = response;
	                $scope.voucherMap = VoucherSortService.dateSort($scope.voucherList);
	            };

	            var error = function(error) {	            	
	            	$ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                	});
	                console.log(error);
	            };

	            BillsDAO.retrieveActiveBills().then(success).catch(error);
	        }

        	$rootScope.$on('refresh-boxes-event', function(event) {
	            $scope.loadVouchers();	            
        	});

        	$rootScope.$on('refresh-inbox', function(event) {
	            $scope.loadVouchers();	            
        	});        	

        	$rootScope.$on('sort-event', function(event, data) {
        		console.log('Data: ', data);
        		$scope.voucherMap = VoucherSortService.sortVouchers(data, $scope.voucherList);
        	});

        	$rootScope.$on('settings-event', function(event, data) {
        		console.log('Data: ', data)
        		$state.go(data);
        	});

        	$scope.$on("$ionicView.afterEnter", function(event, data){
     				$scope.loadVouchers();  
     		});		
     		$scope.getExpirationDays = function(date) {
	            var currentDate = new Date();
	            var expirationDate = new Date(date);
	            var timeDiff = Math.abs(expirationDate.getTime() - currentDate.getTime());
	            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
	            if (expirationDate.getTime() >= currentDate.getTime()) {
                	return "Vence en "+ diffDays +" días";
                }else{
                	return "Venció hace " + diffDays + " días"
                }
	        };

	        $scope.readyStatus = function ( bill, section ) {
	        	var actionDescription = 'Bill: ' + bill.id + ', INBOX TO READY';
	        	$scope.changeStatus(bill, section, AppConstants.READY_STATUS, actionDescription);
	        }

	        $scope.changeStatus = function(bill, section, status, actionDescription ) {	        	

	            var success = function(response) {	            	
	                console.log("changeStatus inbox Response: ", angular.toJson(response));
	                $scope.voucherMap[section].splice($scope.voucherMap[section].indexOf(bill), 1);
	                $rootScope.$broadcast('refresh-boxes-event');
	                $scope.showToast("Su boleta ha sido tranferida");
	                StatsController.exportStats();
	            }
	            
	            var error = function(error) {
	                console.log("Ready Response: ", angular.toJson(error));
	            }
	            
	            BillsDAO.updateBillState( bill.id, status )
                .then( function( response ) {
                    var currentTime = new Date();

                    console.log($scope.user);

                    var stat = {
                        action : status, 
                        timestamp : currentTime.getTime(),
                        user : $scope.user.id,
                        device : $scope.device.identifier,
                        description : actionDescription
                    };

                    console.log('STATS: ', angular.toJson(stat));

                    return StatsDAO.saveStat(stat);
                })
                .then(success).catch(error);
	            
	            console.log("MAP:", angular.toJson($scope.voucherMap));
	        }

	        $scope.showRememberOptions = function(bill, section) {

	            $ionicActionSheet.show(
	            	{
	            		buttons: [
	            			{ text: 'Recuérdame Mañana' },
	            			{ text: 'Recuérdame a 1 Semana' },
	            			{ text: 'Recuérdame el Día de Vencimiento' },
	                        { text: 'Seleccionar Día' },
	                    ],
	                        
	                    cancelText: 'Cancelar',
	                    
	                    buttonClicked: function(index) {
	                        if(index === 0) {
	                            var now = new Date().getTime();
	                            var _10SecondsFromNow = new Date(now + 10 * 1000);
	                            $scope.programmedBill(bill, section, _10SecondsFromNow);
	                        }
	                        
	                        if(index === 1) {
	                            var now = new Date().getTime();
	                            var _10SecondsFromNow = new Date(now + 10 * 1000);
	                            $scope.programmedBill(bill, section, _10SecondsFromNow);
	                        }
	                        
	                        if(index === 2) {
	                            var now = new Date().getTime();
	                            var _10SecondsFromNow = new Date(now + 10 * 1000);
	                            $scope.programmedBill(bill, section, _10SecondsFromNow);
	                        }
	                        
	                        if(index === 3) {
	                        	$scope.selectDateBill = bill;
	                        	$scope.selectDateBill.section = section;
	                            $scope.modal.show();
	                        }
	                        
	                        return true;
	                    },
	                }
	            );
        };

        $scope.programmedBill = function(bill, section, date) {

            var actionDescription = 'Bill: ' + bill.id + ', INBOX TO PROGRAMMED';
            $scope.changeStatus(bill, section, AppConstants.PROGRAMMED_STATUS, actionDescription);

            $cordovaLocalNotification.schedule({
	                id: bill.id,
	                title: 'Boleta',
	                text: "Reprogramada!",
	                at: date
	            }).then(function (result) {
	                console.log('Notification 1 triggered');
	            });

        }

        $scope.selectDateProgrammed = function() {
            $scope.programmedBill($scope.selectDateBill, $scope.selectDateBill.section, $scope.selectDateBill.programmedDate );
            $scope.modal.hide();
        }

        $scope.goToDetail = function (bill) {
            console.log(bill.serviceCategory);
            if(bill.serviceCategory === 'Banca') {                
                $state.go('app.detail-transactional', { bill : bill.id } );
            } else {
                $state.go('app.detail-service', { bill : bill.id } );
            }            
        }

		$scope.showToast = function(message) {
			window.plugins.toast.showWithOptions ({
             	message: message,
             	duration: "short",
             	position: "bottom",
             });
        }

	}]);
})()