( function() {
    
    var allBills = angular.module('controllers.bills.all', 
        [
            'utils.constants',
            'controllers.stats',
            'service.sort',
            'dao.bills-dao',
            'dao.stats-dao',
        ]);
        
    allBills.controller('AllVoucherController', 
        [ 
            '$scope', 
            '$rootScope', 
            'BillsDAO',
            'VoucherSortService',             
            '$state', 
            'AppConstants',             
            '$ionicPopup',
            '$ionicActionSheet',

        function ( $scope, $rootScope, BillsDAO, VoucherSortService, $state, 
            AppConstants, $ionicPopup, $ionicActionSheet ) {

        $scope.voucherMap = {};

        $scope.settings = {
            notificationsManagement : "app.notification-management",
            addAccount : "app.add-account-qr"
        }

        $scope.sorts = {
            0 : 'dateSort',
            1 : 'accountSort',
            2 :'userSort',
            3 : 'companySort'
        }

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

            BillsDAO.retrieveBills().then(success).catch(error);
        }
        
        $rootScope.$on('refresh-boxes-event', function(event) {
            $scope.loadVouchers();
        });

        $rootScope.$on('settings-event', function(event, data) {
            $state.go( $scope.settings[data] );
        });

        $scope.$on("$ionicView.afterEnter", function(event, data){
            $scope.loadVouchers();
            $scope.search = false;
        });

        $scope.goToDetail = function (bill) {
            console.log(bill.serviceCategory);
            if(bill.serviceCategory === 'Banca') {                
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
                return false
            }            
        };

        $scope.showSearch = function() {
            console.log("showSearch")
            $scope.search = true;
        };

        $scope.showSortOptions = function() {            
            
            $ionicActionSheet.show (
                {
                    buttons: [
                        { text: '<i class="icon ion-calendar"></i>Ordenar por Fecha' },
                        { text: '<i class="icon ion-folder"></i>Ordenar por tipo de cuenta' },
                        { text: '<i class="icon ion-person"></i>Ordenar por Categoria' },
                        { text: '<i class="icon ion-arrow-swap"></i>Ordenar por Compañia' },
                    ],
                    
                    cancelText: 'Cancelar',
                    
                    buttonClicked: function(index) {
                        $scope.voucherMap = VoucherSortService.sortVouchers(
                            $scope.sorts[index], $scope.voucherList )

                        return true
                    },
                }
            );
        };
        
    }]);
    
})();

