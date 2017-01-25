 ( function() {
    
    var readyVouchers = angular.module('controllers.bills.expired', 
        ['service.sort', 'controllers.stats', 'utils.constants', 'dao.stats-dao'] );
    
    readyVouchers.controller('ExpiredVoucherController', [ 
        '$scope', '$rootScope', 'BillsDAO', 'VoucherSortService', '$state', 
        'AppConstants', 'StatsController', 'StatsDAO', '$ionicPopup',
        function ($scope, $rootScope, BillsDAO, VoucherSortService, $state, 
            AppConstants, StatsController, StatsDAO, $ionicPopup) {
        
        $scope.voucherMap = {};        
        $scope.needSwipe = false;

        $scope.user = angular.fromJson(window.localStorage.getItem('user'));
        $scope.device = angular.fromJson(window.localStorage.getItem('device'));
        
        $scope.loadVouchers = function() {

            var success = function(response) {                
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

            BillsDAO.retrieveExpiredBills().then(success).catch(error);
        }
        
        $rootScope.$on('sort-event', function(event, data) {
            console.log('Data: ', data);
            $scope.voucherMap = VoucherSortService.sortVouchers(data, $scope.voucherList);
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

        $scope.readyStatus = function ( bill, section ) {
            $scope.changeStatus(bill, section, AppConstants.READY_STATUS );
        }

        $scope.changeStatus = function(bill, section, status) {

            var success = function(response) {
                console.log("Ready Response: ", angular.toJson(response));
                $scope.voucherMap[section].splice($scope.voucherMap[section].indexOf(bill), 1);                
                $rootScope.$broadcast('refresh-boxes-event');
                $scope.showToast("Su boleta ha sido tranferida");
                StatsController.exportStats();
            }
            
            var error = function(error) {
                console.log("Ready Response: ", angular.toJson(error));
                $ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                });
            }

            BillsDAO.updateBillState( bill.id, AppConstants.READY_STATUS )
                .then( function( response ) {

                    var currentTime = new Date();

                    var stat = {
                        action : AppConstants.READY_ACTION, 
                        timestamp : currentTime.getTime(),
                        user : $scope.user.id, 
                        device : $scope.device.identifier,
                        description : 'EXPIRED TO READY'
                    };

                    console.log('STATS: ', angular.toJson(stat));

                    return StatsDAO.saveStat(stat);
                })
                .then(success).catch(error);
            
            console.log("MAP:", angular.toJson($scope.voucherMap));
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
        $scope.showToast = function(message) {
            window.plugins.toast.showWithOptions ({
                message: message,
                duration: "short",
                position: "bottom",
             });
        }
        
    }]);
    
})();