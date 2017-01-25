(function(){
    
    var app = angular.module('controllers.detail.service',
        [
            'utils.constants', 
            'nvd3', 
            'dao.bills-dao', 
            'controllers.stats', 
            'dao.stats-dao',             
        ]);

    app.controller('ServiceDetailController', 
    	[ 
        '$scope', 
        '$rootScope', 
        '$stateParams', 
        '$ionicActionSheet', 
        'AppConstants', 
    	'$ionicPopup', 
        '$ionicModal', 
        'BillsDAO', 
        'StatsController', 
        'StatsDAO', 
        '$ionicModal',         
        '$ionicPopup', 
        '$cordovaLocalNotification',

    	function( $scope, $rootScope, $stateParams, $ionicActionSheet, AppConstants, 
            $ionicPopup, $ionicModal, BillsDAO , StatsController, StatsDAO, 
            $ionicModal, $ionicPopup, $cordovaLocalNotification) {

            console.log('ServiceDetailController');
            $scope.colorsBarChart = [];
            $ionicModal.fromTemplateUrl('templates/selectdate.html', { scope: $scope})
                .then(function(modal) {
                    $scope.modal = modal;
                });

            $scope.currentDate = new Date();
            $scope.user = angular.fromJson(window.localStorage.getItem('user'));
            $scope.device = angular.fromJson(window.localStorage.getItem('device'));
            $scope.billId = $stateParams.bill;        
            $scope.maxConsumption = 0;            

            $scope.$on('elementMouseover.tooltip', function(event){
                console.log('scope.elementMouseover.tooltip', event);
            });
        
        $scope.options = {
            chart: {
                type: 'discreteBarChart',
                height: 230,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 55
                },
                x: function(d){ return d.label; },
                y: function(d){ return d.value; },
                showValues: false,
                tooltips : false, 
                tooltip : null,
                valueFormat: function(d){
                    return d3.format(',.4f')(d);
                },
                color: $scope.colorsBarChart,
                transitionDuration: 500,
                xAxis: {},
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: 30
                },
                
                discretebar: {
                  dispatch: {
                    elementClick: function(event) {
                        console.log("Click graph")                        
                        console.log("EVENT: ", angular.toJson(event.data));
                        $scope.showDetail(event.data);
                    },

                  }
                },

            }
        };        

        $scope.data = [{ key: "Historical", values: [] } ];        
        
        $scope.findVoucherFromGraph = function(graphData) {
            var voucher = {};
            
            for( var index in $scope.voucherHistoric ) {
                
                var historic = $scope.voucherHistoric[index];
                
                var emissionDate = new Date(historic.emissionDate);
                var month = AppConstants.MONTHS_SHORT[emissionDate.getMonth()];
                
                if(historic.consumption == graphData.value && month == graphData.label) {
                    voucher = historic;
                    break;
                }               
            }
                        
            return voucher;
        }
        
        $scope.loadChart = function() {
            
            for( var index in $scope.voucherHistoric) {
            
                var chartValue = {};

                var historicVoucher = $scope.voucherHistoric[index];            
                if($scope.maxConsumption < historicVoucher.consumption){
                    $scope.maxConsumption = historicVoucher.consumption;
                }

                var emissionDate = new Date(historicVoucher.emissionDate);

                chartValue.label = AppConstants.MONTHS_SHORT[emissionDate.getMonth()];
                chartValue.value = historicVoucher.consumption;

                $scope.data[0].values.push(chartValue);

                (index == $scope.voucherHistoric.length -1 ) ? $scope.colorsBarChart.push("#ef473a") : $scope.colorsBarChart.push("#cacaca");
            };

        }
        
        $scope.showDetail = function(graphData) {
            var historicVoucher = $scope.findVoucherFromGraph(graphData);
            console.log("HISCTORIC:", angular.toJson($scope.voucherHistoric));
            console.log("Show Detail:", angular.toJson(historicVoucher));

            var emissionDate = new Date(historicVoucher.emissionDate);
            var monthText = AppConstants.MONTHS_LARGE[emissionDate.getMonth()];
            var expiredDate = new Date(historicVoucher.expirationDate);
            var expiredText = expiredDate.getDate()+'/'+ (expiredDate.getMonth()+1) +'/'+ expiredDate.getFullYear();
            $ionicPopup.alert({
                title: "Detalle",
                template:  '<div>'
                            +'<div>'+$scope.bill.alias+'</div>'
                            +'<div>'+monthText+' - $'+ historicVoucher.cost +'</div>'
                            +'<div>Detalle Consumo</div>'
                            +'<div> Consumido en '+monthText+': '+historicVoucher.consumption+'</div>'
                            +'<div> Vencimiento - '+expiredText+'</div>'
                        +'</div>',
            });

        }
        
        $scope.showRememberOptions = function() {
            
            console.log("showRememberOptions");
            
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
                            $scope.programmedBill($scope.bill, _10SecondsFromNow);
                        }
                        
                        if(index === 1) {
                            var now = new Date().getTime();
                            var _10SecondsFromNow = new Date(now + 10 * 1000);
                            $scope.programmedBill($scope.bill, _10SecondsFromNow);
                        }
                        
                        if(index === 2) {
                            var now = new Date().getTime();
                            var _10SecondsFromNow = new Date(now + 10 * 1000);
                            $scope.programmedBill($scope.bill, _10SecondsFromNow);
                        }
                        
                        if(index === 3) {          
                            $scope.selectDateBill = $scope.bill;
                            $scope.modal.show();
                        }
                        
                        return true;
                    },
                }
            );
        };
        
        $scope.programmedBill = function(bill, date) {

            var actionDescription = 'Bill: ' + bill.id + ', DETAIL TO PROGRAMMED';
            $scope.changeStatus(bill, AppConstants.PROGRAMMED_STATUS, actionDescription);

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
            $scope.programmedBill($scope.selectDateBill, $scope.selectDateBill.programmedDate );
            $scope.modal.hide();
        }

        $scope.changeStatus = function(bill, status, actionDescription ) {

            var success = function(response) {                  
                console.log("changeStatus inbox Response: ", angular.toJson(response));
                $rootScope.$broadcast('refresh-boxes-event');
                $scope.showToast("Su boleta ha sido programada");
                StatsController.exportStats();
            }
            
            var error = function(error) {                
                console.log("Service Detail Response: ", angular.toJson(error));
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
                            
        }
        
        $scope.showToast = function(message) {
            
             window.plugins.toast.showWithOptions(
                 {
                  message: message,
                  duration: "short",
                  position: "bottom",                  
                }
             );
        }
        
        $scope.getExpirationDays = function(date) {
            var currentDate = new Date();
            var expirationDate = new Date(date);
            
            var timeDiff = Math.abs(expirationDate.getTime() - currentDate.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return diffDays;
        };
        
        $scope.getHistoricData = function (bill) {

            var success = function(response) {            
                console.log("HISTORIC: ", angular.toJson(response));
                $scope.voucherHistoric = response;
                $scope.loadChart();
            };

            var error = function(error) {
                $ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                });
                console.log("ERROR ACC DETAIL: ", angular.toJson(error));
            };
            
            console.log("GET HISTORIC VOUCHER: ", angular.toJson(bill));
            BillsDAO.retrieveBillHistoric(bill).then(success).catch(error);
        };
        
        $scope.updateBill = function(bill) {
            
            console.log("updateBill!!!");
            
            var success = function(response) {
                console.log("UPDATE BILL DETAIL: ", angular.toJson(response));
            };

            var error = function(error) {
                $ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                });
                console.log("ERROR ACC DETAIL: ", angular.toJson(error));
            };

            var billToUpdate = {
                state : bill.state, 
                wasRead : 1, 
                id : bill.id 
            };
            
            BillsDAO.updateBill(billToUpdate).then(success).catch(error);
            
        };

        $rootScope.$on('refresh-detail-event', function(event) {
            console.log("Detail Refresh", angular.toJson(event));
            $scope.loadView();
        });

        $scope.$on("$ionicView.afterEnter", function(event, data){
            $scope.loadView();
        });
        
        $scope.loadView = function () {
            
            var success = function(bill) {
                console.log("Response ACC DETAIL: ", angular.toJson(bill));
                $scope.bill = bill;
                $scope.getHistoricData(bill);
                if(bill.wasRead !== 1) {
                    console.log("wasRead: ", bill.wasRead);
                    $scope.updateBill(bill);
                }                
            };

            var error = function(error) {
                
                $ionicPopup.alert({
                         title: AppConstants.ERROR_TITLE,
                         template: angular.toJson(error)
                });
                console.log("ERROR ACC DETAIL: ", angular.toJson(error));
            };

            BillsDAO.retrieveBill($scope.billId).then(success).catch(error);
        };

        $scope.checkDate = function(expirationDate) {
            var currentDate = new Date();            
            if (expirationDate >= currentDate.getTime()) {
                return true
            } else {
                return false;
            }
        };
        
    }]);
    
})()