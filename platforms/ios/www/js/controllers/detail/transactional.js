(function(){
    
    var app = angular.module('controllers.detail.transactional', 
        [
            'utils.constants', 
            'nvd3', 
            'dao.bills-dao', 
            'controllers.stats', 
            'dao.stats-dao',             
        ]);
    
    app.controller('TransacDetailController', 
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
            $ionicModal, $ionicPopup, $cordovaLocalNotification){
        
            $ionicModal.fromTemplateUrl('templates/selectdate.html', { scope: $scope})
                .then(function(modal) {
                    $scope.modal = modal;
                });
            $scope.colorsBarChart = [];
            $scope.currentDate = new Date();
            $scope.user = angular.fromJson(window.localStorage.getItem('user'));
            $scope.device = angular.fromJson(window.localStorage.getItem('device'));
            $scope.billId = $stateParams.bill;
        
        $scope.foreignData = [];
        $scope.nationalData = [];
        
        $scope.maxNationalConsumption = 0;
        $scope.maxForeignConsumption = 0;
        
        $scope.nationalGraph = true;        
        $scope.maxConsumption = 0;
        
        $scope.details = [];
        
        $scope.options = {
            chart: {
                type: 'discreteBarChart',
                height: 300,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
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
                        console.log("EVENT: ", angular.toJson(event.data));
                        var historic = $scope.findVoucherFromGraph(event.data);
                        $scope.showDetail(historic); 
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
                if($scope.nationalGraph && historic.nationalCost == graphData.value && month == graphData.label) {
                    voucher = historic;
                    break;
                } else if(!$scope.nationalGraph && historic.foreignCost == graphData.value && month == graphData.label) {
                    voucher = historic;
                    break;
                }                
            }       
            return voucher;
        }
        
        $scope.loadGraphData = function() {
            
            for( var index in $scope.voucherHistoric) {
            
                var chartNationalValue = {};
                var chartForeignValue = {};

                var historicVoucher = $scope.voucherHistoric[index];            
                if($scope.maxNationalConsumption < historicVoucher.nationalCost){
                    $scope.maxNationalConsumption = historicVoucher.nationalCost;
                }
                
                if($scope.maxForeignConsumption < historicVoucher.foreignCost){
                    $scope.maxForeignConsumption = historicVoucher.foreignCost;
                }

                var emissionDate = new Date(historicVoucher.emissionDate);

                chartNationalValue.label = AppConstants.MONTHS_SHORT[emissionDate.getMonth()];
                chartNationalValue.value = historicVoucher.nationalCost;
                
                chartForeignValue.label = AppConstants.MONTHS_SHORT[emissionDate.getMonth()];
                chartForeignValue.value = historicVoucher.foreignCost;
                
                $scope.nationalData.push(chartNationalValue);
                $scope.foreignData.push(chartForeignValue);
                (index == $scope.voucherHistoric.length -1 ) ? $scope.colorsBarChart.push("#ef473a") : $scope.colorsBarChart.push("#cacaca");
                
            };

        }
        
        $scope.showDetail = function(bill) {
            console.log("Show Detail:", angular.toJson(bill));
            $scope.retrieveDetail(bill);
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
        
        $scope.getHistoric = function (bill) {
            var success = function(response) {            
                console.log("HISTORIC: ", angular.toJson(response));
                $scope.voucherHistoric = response;
                $scope.loadGraphData();
                $scope.data[0].values = $scope.nationalData;
                $scope.maxConsumption = $scope.maxNationalConsumption;
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
        
        $scope.retrieveDetail = function(bill) {
            
            var success = function(response) {
                console.log('GET DETAIL:', angular.toJson(response));
                $scope.details = response;

                console.log($scope.details)
                 
                var template = '<ion-list>';
                for (var index in $scope.details) {  
                    var detail = $scope.details[index];
                    var dateDetail = new Date(detail.date);
                    var dateDetailFormated = dateDetail.getDate()+'/'+ (dateDetail.getMonth()+1) +'/'+ dateDetail.getFullYear();
                    template =template +  '<div><span><div>'+ (index) +') Fecha: '+  
                                                dateDetailFormated + 
                                                '</div></span><span><div>Detalle: '+ 
                                                detail.description +
                                                '</div></span><span><div> Costo: ' +
                                                detail.cost +
                                                '</div></span></div><br>';
                }
                template = template + "</ion-list>";
                $ionicPopup.alert({
                    title: "Detalle",
                    template:template
                });
            };
            
            var error = function(error) {
                console.log('DETAIL ERROR:', angular.toJson(error));
            };
            
            var type = 'INT';
            
            if($scope.nationalGraph) {
                type = 'NAC';
            }
            
            BillsDAO.retrieveDetailsType(bill.id, type).then(success).catch(error);
        };
        
        $scope.loadView = function () {
            
            var success = function(response) {
                console.log("Response ACC DETAIL: ", angular.toJson(response));
                $scope.bill = response;
                $scope.getHistoric($scope.bill);
                
                if($scope.bill.wasRead !== 1) {
                    $scope.updateBill($scope.bill);
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
        
        $rootScope.$on('refresh-detail-event', function(event) {
            console.log("Detail Refresh", angular.toJson(event));
            $scope.loadView();
        });
        
        $scope.loadGraph = function(isNational) {
            if(isNational) {
                $scope.nationalGraph = true;                
                $scope.data[0].values = $scope.nationalData;
                $scope.maxConsumption = $scope.maxNationalConsumption;
            } else {
                $scope.nationalGraph = false;
                $scope.data[0].values = $scope.foreignData;
                $scope.maxConsumption = $scope.maxForeignConsumption;         
            }
        }

        $scope.checkDate = function(expirationDate) {
            var currentDate = new Date();            
            if ( expirationDate >= currentDate.getTime() ) {
                return true
            } else {
                return false;
            }            
        };
        
        $scope.$on("$ionicView.afterEnter", function(event, data){
                $scope.loadView();
        });
    }]);
    
})()