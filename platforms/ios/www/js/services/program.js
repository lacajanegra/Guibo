( function() {

    var programService = angular.module('service.state', ['dao.bills-dao']);
    
    programService.factory('StateService', [ 
        'BillsDAO', function( BillsDAO ) {

        var user = angular.fromJson(window.localStorage.getItem('user'));
        var device = angular.fromJson(window.localStorage.getItem('device'));
        var service = {};

        service.inboxState = function(bill) {

        }

        service.readyState = function(){

        }

        service.programmedState = function() {

        }

        service.expiredState = function() {

        }

        service.rememberTomorrow = function ( bill ) {
            var now = new Date().getTime();            
            var tomorrow = new Date(now + ( 86400 * 1000 );
            service.programmedBill( bill, tomorrow);
        }

        service.programmedBill = function(bill, tomorrow) {

        }

        $scope.changeStatus = function(bill, status, actionDescription ) {             

                var success = function(response) {
                    console.log("changeStatus inbox Response: ", angular.toJson(response));
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

                    console.log("", angular.toJson(user));

                    var stat = {
                        action : status,
                        timestamp : currentTime.getTime(),
                        user : user.id,
                        device : device.identifier,
                        description : actionDescription
                    };

                    console.log('STATS: ', angular.toJson(stat));

                    return StatsDAO.saveStat(stat);
                })
                .then(success).catch(error);
                
                console.log("MAP:", angular.toJson($scope.voucherMap));
            }

        // service.showRememberOptions = function(bill, section) {

        //         $ionicActionSheet.show(
        //             {
        //                 buttons: [
        //                     { text: 'Recuérdame Mañana' },
        //                     { text: 'Recuérdame a 1 Semana' },
        //                     { text: 'Recuérdame el Día de Vencimiento' },
        //                     { text: 'Seleccionar Día' },
        //                 ],
                            
        //                 cancelText: 'Cancelar',
                        
        //                 buttonClicked: function(index) {
        //                     if(index === 0) {
        //                         var now = new Date().getTime();
        //                         var _10SecondsFromNow = new Date(now + 10 * 1000);
        //                         $scope.programmedBill(bill, section, _10SecondsFromNow);
        //                     }
                            
        //                     if(index === 1) {
        //                         var now = new Date().getTime();
        //                         var _10SecondsFromNow = new Date(now + 10 * 1000);
        //                         $scope.programmedBill(bill, section, _10SecondsFromNow);
        //                     }
                            
        //                     if(index === 2) {
        //                         var now = new Date().getTime();
        //                         var _10SecondsFromNow = new Date(now + 10 * 1000);
        //                         $scope.programmedBill(bill, section, _10SecondsFromNow);
        //                     }
                            
        //                     if(index === 3) {
        //                         $scope.selectDateBill = bill;
        //                         $scope.selectDateBill.section = section;
        //                         $scope.modal.show();
        //                     }
                            
        //                     return true;
        //                 },
        //             }
        //         );
        // };
        
        return service;
        
    }]);
    
})()