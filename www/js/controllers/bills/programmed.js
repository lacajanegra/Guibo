( function() {
    
    var programmedBills = angular.module('controllers.bills.programmed', 
        ['utils.constants', 'service.sort', 'dao.bills-dao', 'dao.stats-dao']);
    
    programmedBills.controller('ReprogrammedVoucherController', 
        [ '$scope', '$rootScope', 'BillsDAO', 'StatsDAO', 'VoucherSortService', '$state', 'AppConstants', '$ionicPopup',
        function ($scope, $rootScope, BillsDAO, StatsDAO, VoucherSortService, $state, AppConstants, $ionicPopup) {
        
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

            BillsDAO.retrieveBillsByState(AppConstants.PROGRAMMED_STATUS).then(success).catch(error);
        }
        
        $rootScope.$on('sort-event', function(event, data) {
            console.log('Data: ', data);
            $scope.voucherMap = VoucherSortService.sortVouchers(data, $scope.voucherList);
        });
        
        $rootScope.$on('programmed-event', function(event, data) {
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

        $scope.readyStatus = function ( bill, section ) {
            var actionDescription = 'Bill: ' + bill.id + ', PROGRAMMED TO READY';
            $scope.changeStatus(bill, section, AppConstants.READY_STATUS, actionDescription);
        }

        $scope.inboxStatus = function ( bill, section ) {
            var actionDescription = 'Bill: ' + bill.id + ', PROGRAMMED TO INBOX';
            $scope.changeStatus(bill, section, AppConstants.INBOX_STATUS, actionDescription);
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

