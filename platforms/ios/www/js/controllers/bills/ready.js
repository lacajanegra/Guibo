( function() {
    
    var readyBills = angular.module('controllers.bills.ready', 
        [
            'utils.constants',          
            'controllers.stats',            
            'service.sort',
            'dao.bills-dao',
            'dao.stats-dao',            
        ]);
        
    readyBills.controller('ReadyVoucherController', 
        [ 
            '$scope', 
            '$rootScope', 
            'BillsDAO', 
            'StatsDAO',
            '$ionicModal', 
            'VoucherSortService', 
            '$ionicActionSheet', 
            '$state', 
            'AppConstants',             
            '$ionicPopup',
            '$cordovaLocalNotification',
            'StatsController',

        function ( $scope, $rootScope, BillsDAO, StatsDAO, $ionicModal,  VoucherSortService, 
            $ionicActionSheet, $state, AppConstants,$ionicPopup, $cordovaLocalNotification, StatsController ) {

        $ionicModal.fromTemplateUrl('templates/selectdate.html', { scope: $scope})
            .then(function(modal) {
                $scope.modal = modal;
            });

        $scope.voucherMap = {};        
        $scope.needSwipe = true;

        $scope.currentDate = new Date();
        $scope.user = angular.fromJson(window.localStorage.getItem('user'));
        $scope.device = angular.fromJson(window.localStorage.getItem('device'));
        console.log("showRememberOptions");        

        $scope.loadVouchers = function() {
            
            var success = function(response) {
                $scope.voucherList = response;
                $scope.voucherMap = VoucherSortService.dateSort($scope.voucherList);                
            };

            var error = function(error) {
                console.log(error);
                $ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                });                
            };

            BillsDAO.retrieveBillsByState(AppConstants.READY_STATUS).then(success).catch(error);
            
        }

        $scope.showRememberOptions = function(bill, section) {

            $ionicActionSheet.show(
                    {
                        buttons: [
                            { text: 'Recuérdame Mañana' },
                            { text: 'Recuérdame a 1 Semana' },
                            { text: 'Recuérdame el Día Vencimiento' },
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

            var actionDescription = 'Bill: ' + bill.id + ', READY TO PROGRAMMED';            
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
            $scope.programmedBill($scope.selectDateBill, $scope.selectDateBill.section,$scope.selectDateBill.programmedDate );
            $scope.modal.hide();
        }
        
        $rootScope.$on('sort-event', function(event, data) {
            console.log('Data: ', data);
            $scope.voucherMap = VoucherSortService.sortVouchers(data, $scope.voucherList);
        });
        
        $rootScope.$on('ready-event', function(event, data) {
            $scope.loadVouchers();
        });
        
        $rootScope.$on('refresh-boxes-event', function(event) {
            $scope.loadVouchers();
        });
        $scope.$on("$ionicView.afterEnter", function(event, data){
            $scope.loadVouchers();
        });
        $scope.goToDetail = function (bill) {
            console.log(bill.serviceCategory);
            if(bill.serviceCategory === 'Banca') {
                console.log("ENTRO!!!! BANCARIO");
                $state.go('app.detail-transactional', { bill : bill.id } );
            } else {
                $state.go('app.detail-service', { bill : bill.id } );
            }            
        }

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
        
        $scope.checkDate = function(date) {
            var currentDate = new Date();
            var expirationDate = new Date(date);
            if (expirationDate.getTime() >= currentDate.getTime()) {
                return true
            } else {
                return false;
            }            
        };

        $scope.inboxStatus = function ( bill, section ) {
            var actionDescription = 'Bill: ' + bill.id + ', READY TO INBOX';
            $scope.changeStatus(bill, section, AppConstants.INBOX_STATUS, actionDescription);
        }

        $scope.expiredStatus = function ( bill, section ) {
            var actionDescription = 'Bill: ' + bill.id + ', READY TO EXPIRED';                
            $scope.changeStatus(bill, section, AppConstants.EXPIRED_STATUS, actionDescription );
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

        $scope.showToast = function(message) {
            window.plugins.toast.showWithOptions ({
                message: message,
                duration: "short",
                position: "bottom",
             });
        }
        
    }]);
    
})();

